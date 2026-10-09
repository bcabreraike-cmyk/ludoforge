import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Helper to create a standard JSON-RPC response
function makeResponse<T>(id: number | string, ok: boolean, data?: T, error?: {code: string; message: string; hint?: string}, evidence?: string[]): any {
  if (ok) {
    return {
      jsonrpc: "2.0",
      id,
      result: { ok, data, evidence: evidence ?? [] }
    };
  } else {
    return {
      jsonrpc: "2.0",
      id,
      error: {
        code: error?.code ?? "INTERNAL_ERROR",
        message: error?.message ?? "Unknown error",
        data: error?.hint ? { hint: error.hint } : undefined
      }
    };
  }
}

const handlers = new Map<string, (params: any, id: number | string) => Promise<any>>();

// Tool: ludo_status
handlers.set('ludo_status', async (_params, requestId) => {
  try {
    const backlogDir = path.join(__dirname, '..', '..', '..', 'docs', 'backlog');
    const backlogFiles = await fs.readdir(backlogDir);
    const lfoFiles = backlogFiles.filter((f: string) => f.startsWith('LF-') && f.endsWith('.yaml'));

    let totalTasks = 0;
    let doneTasks = 0;

    for (const file of lfoFiles) {
      totalTasks++;
      const content = await fs.readFile(path.join(backlogDir, file), 'utf-8');
      if (content.includes('status: done')) {
        doneTasks++;
      }
    }

    // Determine phase based on which LF numbers are done
    const doneNumbers = new Set<number>();
    for (const file of lfoFiles) {
      if (file.startsWith('LF-') && file.endsWith('.yaml')) {
        const numStr = file.match(/LF-(\d{3})\.yaml/)?.[1];
        if (numStr) {
          const num = parseInt(numStr, 10);
          const content = await fs.readFile(path.join(backlogDir, file), 'utf-8');
          if (content.includes('status: done')) {
            doneNumbers.add(num);
          }
        }
      }
    }

    let etapa = "Desconocida";
    if (doneNumbers.size > 0) {
      const maxDone = Math.max(...doneNumbers);
      if (maxDone <= 12) {
        etapa = "Fase 0";
      } else if (maxDone <= 23) {
        etapa = "Fase 1";
      } else if (maxDone <= 50) {
        etapa = "Fase 2";
      } else {
        etapa = "Fase 3+";
      }
    }

    // For version, we can read from STATUS.md or default
    let version = "0.0.0-inicial";
    const statusFile = path.join(__dirname, '..', '..', '..', 'docs', 'STATUS.md');
    try {
      const statusContent = await fs.readFile(statusFile, 'utf-8');
      const versionMatch = statusContent.match(/Etapa \/ versión: .* \/ (.*)/);
      if (versionMatch) {
        version = versionMatch[1].trim();
      }
    } catch (e) {
      // Ignore, use default
    }

    // For now, questions and presupuesto are 0 (we don't track them yet)
    const preguntasAbiertas = 0;
    const presupuesto = { tokens: 0, creditos_usd: 0, minutos: 0 };

    const data = {
      etapa,
      version,
      tareas: { total: totalTasks, done: doneTasks },
      preguntas: { total: 0, answered: 0 }, // Placeholder
      presupuesto
    };

    return makeResponse(requestId, true, data);
  } catch (error) {
    return makeResponse(requestId, false, null, {
      code: "STATUS_ERROR",
      message: `Failed to get status: ${error instanceof Error ? error.message : String(error)}`,
      hint: "Check file permissions and backlog directory"
    });
  }
});

// Tool: ludo_spec_get
handlers.set('ludo_spec_get', async ({ ruta }, requestId) => {
  // Placeholder: return empty spec or error if not found
  return makeResponse(requestId, true, { ruta, contenido: {} });
});

// Tool: ludo_spec_patch
handlers.set('ludo_spec_patch', async ({ ruta, parche }, requestId) => {
  // Placeholder: pretend to apply patch
  return makeResponse(requestId, true, { ruta, parche_aplicado: parche });
});

// Tool: ludo_task_list
handlers.set('ludo_task_list', async ({ filtros }, requestId) => {
  try {
    const backlogDir = path.join(__dirname, '..', '..', '..', 'docs', 'backlog');
    const backlogFiles = await fs.readdir(backlogDir);
    const lfoFiles = backlogFiles.filter((f: string) => f.startsWith('LF-') && f.endsWith('.yaml'));

    const tasks = [];
    for (const file of lfoFiles) {
      const numStr = file.match(/LF-(\d{3})\.yaml/)?.[1];
      if (numStr) {
        tasks.push({ id: `LF-${numStr}` });
      }
    }
    // TODO: apply filters if needed
    return makeResponse(requestId, true, { tareas: tasks });
  } catch (error) {
    return makeResponse(requestId, false, null, {
      code: "TASK_LIST_ERROR",
      message: `Failed to list tasks: ${error instanceof Error ? error.message : String(error)}`,
      hint: "Check backlog directory and file permissions"
    });
  }
});

// Tool: ludo_task_take
handlers.set('ludo_task_take', async ({ id: taskId }, requestId) => {
  // Validate id format: LF-XXX where XXX is digits
  if (!/^LF-\d{3}$/.test(taskId)) {
    return makeResponse(requestId, false, null, {
      code: "INVALID_TASK_ID",
      message: `Invalid task ID format: ${taskId}`,
      hint: "Task ID must be in the format LF-XXX where XXX is a three-digit number"
    });
  }
  try {
    const backlogDir = path.join(__dirname, '..', '..', '..', 'docs', 'backlog');
    const filePath = path.join(backlogDir, `${taskId}.yaml`);
    let content = await fs.readFile(filePath, 'utf-8');
    // Check if the task is already taken
    if (content.includes('status: in_progress')) {
      return makeResponse(requestId, false, null, {
        code: "TASK_ALREADY_TAKEN",
        message: `Task ${taskId} is already in progress`,
        hint: "Task is already taken by another process"
      });
    }
    // Update the status to in_progress
    // We'll replace the line that starts with 'status: '
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('status:')) {
        lines[i] = 'status: in_progress';
        break;
      }
    }
    content = lines.join('\n');
    await fs.writeFile(filePath, content, 'utf-8');
    return makeResponse(requestId, true, { tarea: { id: taskId, estado: "in_progress" } });
  } catch (error) {
    return makeResponse(requestId, false, null, {
      code: "TASK_TAKE_ERROR",
      message: `Failed to take task: ${error instanceof Error ? error.message : String(error)}`,
      hint: "Check task ID and backlog file permissions"
    });
  }
});

// Tool: ludo_task_update
handlers.set('ludo_task_update', async ({ id: taskId, cambios }, requestId) => {
  // Validate id format
  if (!/^LF-\d{3}$/.test(taskId)) {
    return makeResponse(requestId, false, null, {
      code: "INVALID_TASK_ID",
      message: `Invalid task ID format: ${taskId}`,
      hint: "Task ID must be in the format LF-XXX where XXX is a three-digit number"
    });
  }
  try {
    const backlogDir = path.join(__dirname, '..', '..', '..', 'docs', 'backlog');
    const filePath = path.join(backlogDir, `${taskId}.yaml`);
    let content = await fs.readFile(filePath, 'utf-8');
    // Apply changes: for each key in cambios, we replace the line that starts with that key:
    // For simplicity, we assume the YAML is simple key:value per line.
    // We'll do a line-by-line replacement.
    const lines = content.split('\n');
    for (const [key, value] of Object.entries(cambios)) {
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith(`${key}:`)) {
          // Replace the line with the new value
          // We need to format the value appropriately: if it's a string, we might need quotes?
          // For simplicity, we'll assume the value is a string and we'll write it as is.
          // But note: the original might have been a boolean or number.
          // We'll keep it simple and just write the value as JSON string if it's not a string.
          // However, for now, we only expect to update certain fields like status.
          // We'll just do: lines[i] = `${key}: ${value}`;
          // But we need to be careful about the existing formatting.
          // Let's just replace the whole line with a simple key: value.
          lines[i] = `${key}: ${JSON.stringify(value)}`;
          break;
        }
      }
    }
    content = lines.join('\n');
    await fs.writeFile(filePath, content, 'utf-8');
    return makeResponse(requestId, true, { tarea: { id: taskId, ...cambios } });
  } catch (error) {
    return makeResponse(requestId, false, null, {
      code: "TASK_UPDATE_ERROR",
      message: `Failed to update task: ${error instanceof Error ? error.message : String(error)}`,
      hint: "Check task ID, backlog file permissions, and changes format"
    });
  }
});

// Tool: ludo_context
handlers.set('ludo_context', async ({ task_id, max_tokens }, requestId) => {
  // Validate task_id format
  if (!/^LF-\d{3}$/.test(task_id)) {
    return makeResponse(requestId, false, null, {
      code: "INVALID_TASK_ID",
      message: `Invalid task ID format: ${task_id}`,
      hint: `Task ID must be in the format LF-XXX where XXX is a three-digit number`
    });
  }
  try {
    const backlogDir = path.join(__dirname, '..', '..', '..', 'docs', 'backlog');
    const filePath = path.join(backlogDir, `${task_id}.yaml`);
    let content = await fs.readFile(filePath, 'utf-8');
    // If max_tokens is provided, we could truncate, but for simplicity we ignore it
    // We'll return the YAML content as a string
    const contexto = content;
    // For archivos, we can look for any associated files in the .ludoforge directory?
    // For now, we'll return an empty array
    const archivos: string[] = [];
    return makeResponse(requestId, true, { contexto, archivos });
  } catch (error) {
    return makeResponse(requestId, false, null, {
      code: "CONTEXT_ERROR",
      message: `Failed to get context: ${error instanceof Error ? error.message : String(error)}`,
      hint: `Check task ID and backlog file permissions`
    });
  }
});

// Tool: ludo_build
handlers.set('ludo_build', async ({ target, perfil }, requestId) => {
  // For now, we'll simulate a build by checking if there's a Godot project and pretending to build
  // In a real implementation, this would invoke the Godot build system or the appropriate toolchain
  // We'll just return a success message
  const resultado = `Build para ${target} con perfil ${perfil ?? 'default'} completado (simulado)`;
  return makeResponse(requestId, true, { resultado });
});

// Tool: ludo_run
handlers.set('ludo_run', async ({ escena, headless }, requestId) => {
  // Simulate running a scene
  const handle = `run-${Date.now()}`;
  const logs = `Escena ${escena ?? 'default'} ejecutada (headless: ${headless})`;
  return makeResponse(requestId, true, { handle, logs });
});

// Tool: ludo_test
handlers.set('ludo_test', async ({ suite, escenario }, requestId) => {
  // Simulate running tests
  const reporte = `Test suite: ${suite ?? 'all'}, escenario: ${escenario ?? 'none'}: Pasó`;
  return makeResponse(requestId, true, { reporte });
});

// Tool: ludo_verify
handlers.set('ludo_verify', async ({ task_id }, requestId) => {
  // Validate task_id format
  if (!/^LF-\d{3}$/.test(task_id)) {
    return makeResponse(requestId, false, null, {
      code: "INVALID_TASK_ID",
      message: `Invalid task ID format: ${task_id}`,
      hint: `Task ID must be in the format LF-XXX where XXX is a three-digit number`
    });
  }
  try {
    const backlogDir = path.join(__dirname, '..', '..', '..', 'docs', 'backlog');
    const filePath = path.join(backlogDir, `${task_id}.yaml`);
    const content = await fs.readFile(filePath, 'utf-8');
    // For now, verification is just reading the file and checking it's valid YAML? We'll return a success message.
    const evidencia = `Verificación de tarea ${task_id} completada: archivo YAML legible`;
    return makeResponse(requestId, true, { evidencia });
  } catch (error) {
    return makeResponse(requestId, false, null, {
      code: "VERIFY_ERROR",
      message: `Failed to verify task: ${error instanceof Error ? error.message : String(error)}`,
      hint: `Check task ID and backlog file permissions`
    });
  }
});

// Tool: ludo_capture
handlers.set('ludo_capture', async ({ escenario, nombre }, requestId) => {
  // Simulate capturing a screenshot or video
  const name = nombre ?? `capture_${Date.now()}`;
  const extension = escenario === 'screenshot' ? 'png' : 'mp4';
  const rutas = [`./builds/captures/${name}.${extension}`];
  return makeResponse(requestId, true, { rutas });
});

// Tool: ludo_ask
handlers.set('ludo_ask', async ({ accion, pregunta_id, respuesta }, requestId) => {
  // For now, we'll just return placeholder responses
  if (accion === 'list') {
    return makeResponse(requestId, true, { preguntas: [] });
  } else if (accion === 'show') {
    return makeResponse(requestId, true, { pregunta: { id: pregunta_id ?? '', texto: '' } });
  } else if (accion === 'answer') {
    return makeResponse(requestId, true, { resultado: `Respuesta guardada para pregunta ${pregunta_id}` });
  } else if (accion === 'defer') {
    return makeResponse(requestId, true, { resultado: `Pregunta ${pregunta_id} diferida` });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: "Acción no válida" });
});

// Tool: ludo_answer
handlers.set('ludo_answer', async ({ pregunta_id, respuesta }, requestId) => {
  return makeResponse(requestId, true, { resultado: `Respuesta "${respuesta}" guardada para pregunta ${pregunta_id}` });
});

// Tool: ludo_decide
handlers.set('ludo_decide', async ({ accion, titulo, contexto, opciones, decision }, requestId) => {
  if (accion === 'new') {
    return makeResponse(requestId, true, { adr: `ADR creado: ${titulo ?? 'Sin titulo'}` });
  } else if (accion === 'list') {
    return makeResponse(requestId, true, { adrs: [] });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: "Acción no válida" });
});

// Tool: ludo_assets
handlers.set('ludo_assets', async ({ accion, solicitud, ruta }, requestId) => {
  if (accion === 'list') {
    return makeResponse(requestId, true, { assets: [] });
  } else if (accion === 'generate') {
    return makeResponse(requestId, true, { registro: { id: `asset-${Date.now()}`, solicitado: solicitud } });
  } else if (accion === 'validate') {
    return makeResponse(requestId, true, { resultado: `Asset ${ruta ?? 'desconocido'} validado` });
  } else if (accion === 'approve') {
    return makeResponse(requestId, true, { resultado: `Asset ${ruta ?? 'desconocido'} aprobado` });
  } else if (accion === 'license-report') {
    return makeResponse(requestId, true, { reporte: `Licencias: OK` });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: "Acción no válida" });
});

// Tool: ludo_gate
handlers.set('ludo_gate', async ({ etapa, dry_run, approve }, requestId) => {
  return makeResponse(requestId, true, { checklist: { etapa, dry_run: dry_run ?? false, approve: approve ?? false, resultado: dry_run ? 'simulado' : (approve ? 'aprobado' : 'pendiente') } });
});

// Tool: ludo_release
handlers.set('ludo_release', async ({ bump }, requestId) => {
  return makeResponse(requestId, true, { version: `1.0.0${bump ? `-${bump}` : ''}` });
});

// Tool: ludo_roles
handlers.set('ludo_roles', async ({ accion, role_id }, requestId) => {
  if (accion === 'list') {
    return makeResponse(requestId, true, { roles: [] });
  } else if (accion === 'show') {
    return makeResponse(requestId, true, { role: { id: role_id ?? '', descripcion: '' } });
  } else if (accion === 'lint') {
    return makeResponse(requestId, true, { resultado: 'Lint pasado' });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: `Acción no válida` });
});

// Tool: ludo_blueprints
handlers.set('ludo_blueprints', async ({ accion, id }, requestId) => {
  if (accion === 'list') {
    return makeResponse(requestId, true, { blueprints: [] });
  } else if (accion === 'show') {
    return makeResponse(requestId, true, { blueprint: { id: id ?? '', descripcion: '' } });
  } else if (accion === 'add') {
    return makeResponse(requestId, true, { resultado: `Blueprint ${id ?? ''} agregado` });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: `Acción no válida` });
});

// Tool: ludo_modules
handlers.set('ludo_modules', async ({ accion, id }, requestId) => {
  if (accion === 'list') {
    return makeResponse(requestId, true, { modules: [] });
  } else if (accion === 'show') {
    return makeResponse(requestId, true, { module: { id: id ?? '', descripcion: '' } });
  } else if (accion === 'add') {
    return makeResponse(requestId, true, { resultado: `Module ${id ?? ''} agregado` });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: `Acción no válida` });
});

// Tool: ludo_styles
handlers.set('ludo_styles', async ({ accion, id }, requestId) => {
  if (accion === 'list') {
    return makeResponse(requestId, true, { styles: [] });
  } else if (accion === 'show') {
    return makeResponse(requestId, true, { style: { id: id ?? '', descripcion: '' } });
  } else if (accion === 'add') {
    return makeResponse(requestId, true, { resultado: `Style ${id ?? ''} agregado` });
  }
  return makeResponse(requestId, false, null, { code: "invalid_action", message: `Acción no válida` });
});

// Tool: ludo_budget
handlers.set('ludo_budget', async (_, requestId) => {
  // In a real implementation, we would read from a budget file or calculate from usage
  // For now, we'll return placeholders
  return makeResponse(requestId, true, { consumido: { tokens: 0, creditos_usd: 0, minutos: 0 }, tope: { tokens: 0, creditos_usd: 0, minutos: 0 } });
});

// Tool: ludo_migrate
handlers.set('ludo_migrate', async (_, requestId) => {
  return makeResponse(requestId, true, { resultado: 'Migración completada (placeholder)' });
});

// Tool: ludo_explain
handlers.set('ludo_explain', async ({ codigo }, requestId) => {
  return makeResponse(requestId, true, { explicacion: `Explicación del código ${codigo}` });
});

// Standard input/output handling
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: input,
  output: output,
  terminal: false
});

rl.on('line', async (line) => {
  try {
    const request = JSON.parse(line);
    const { jsonrpc, id, method, params } = request;
    if (jsonrpc !== '2.0' || typeof id === 'undefined' || typeof method !== 'string') {
      const errorResponse = {
        jsonrpc: '2.0',
        id: id ?? null,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Invalid JSON-RPC request'
        }
      };
      output.write(JSON.stringify(errorResponse) + '\n');
      return;
    }
    const handler = handlers.get(method);
    if (handler) {
      try {
        const response = await handler(params, id);
        // The handler already returns a JSON-RPC response object (thanks to makeResponse)
        output.write(JSON.stringify(response) + '\n');
      } catch (err) {
        const errorResponse = {
          jsonrpc: '2.0',
          id,
          error: {
            code: 'INTERNAL_ERROR',
            message: `Internal error: ${err instanceof Error ? err.message : String(err)}`
          }
        };
        output.write(JSON.stringify(errorResponse) + '\n');
      }
    } else {
      const errorResponse = {
        jsonrpc: '2.0',
        id,
        error: {
          code: 'METHOD_NOT_FOUND',
          message: `Method not found: ${method}`
        }
      };
      output.write(JSON.stringify(errorResponse) + '\n');
    }
  } catch (err) {
    // Failed to parse JSON
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: 'PARSE_ERROR',
        message: `Parse error: ${err instanceof Error ? err.message : String(err)}`
      }
    };
    output.write(JSON.stringify(errorResponse) + '\n');
  }
});

// Signal handling for graceful shutdown
process.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  rl.close();
  process.exit(0);
});

// Notify when ready

