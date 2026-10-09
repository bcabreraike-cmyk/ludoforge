# ADR 0002 — Stack tecnológico
Estado: aceptada
Fecha: 2026-10-09 · Decidió: humano (Builder, Brandon)

## Contexto
Se necesita decidir el stack tecnológico para el núcleo de Ludoforge, considerando las recomendaciones de la sección 6.1 y la decisión requerida H-02.

## Opciones consideradas
1. **TypeScript/Node.js LTS para core, cli, mcp-server y adaptadores de host; Python para pipeline de assets; GDScript para Godot tests** (recomendado en 6.1)
2. Solo TypeScript/Node.js para todo
3. Solo Python para todo
4. Otros combinaciones (Rust, Go, etc.)

## Decisión
Adoptar el stack recomendado en la sección 6.1:
- TypeScript sobre Node.js LTS para `core`, `cli`, `mcp-server` y adaptadores de host (distribución con `npx`, SDKs de MCP maduros, tipos para esquemas)
- Python para el pipeline de assets (ecosistema de visión/audio, scripts de Blender headless)
- GDScript para el addon de pruebas en Godot
- Gestor: pnpm workspaces
- Esquemas con Zod → exportados a JSON Schema
- Pruebas: Vitest (TS), pytest (Python), GUT/propio (Godot)

## Consecuencias
### Positivas
- Aprovecha el ecosistema de TypeScript para herramientas y MCP.
- Python es ideal para generación y procesamiento de assets (Pillow, numpy, etc.).
- GDScript está integrado nativamente con Godot 4, el motor principal elegido.
- pnpm workspaces permite un monorepo eficiente.
- Zod proporciona validación de esquemas en tiempo de ejecución y tipos TypeScript.
- Las pruebas elegidas son rápidas y bien mantenidas.

### Negativas
- Requiere conocimiento de múltiples lenguajes.
- La complejidad del monorepo puede aumentar la curva de aprendizaje inicial.

## Verificación
Se verificará que los paquetes del monorepo usen las tecnologías especificadas y que las pruebas se ejecuten correctamente en cada lenguaje.

## Enlaces
- Sección 6.1: Stack recomendado y estructura del monorepo
- Sección 19 H-02: Lenguaje/stack del núcleo
