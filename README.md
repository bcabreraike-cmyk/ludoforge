# Ludoforge

> **Versión del documento:** 1.0 · **Fecha:** 2026-10-09  
> **Humano responsable:** Brandon  
> **Idioma:** español (identificadores, comandos, código y nombres de archivos en inglés)

Ludoforge es una herramienta que se instala en un agente y le permite crear videojuegos completos desde cero, trabajando como un estudio multiagente, por etapas (prototipo → alfa → beta → versión final).

## Estado actual

Ver [docs/STATUS.md](docs/STATUS.md) para el estado del proyecto.

## Comenzar

Véase la [documentación](docs/) para instrucciones de instalación y uso.

## Licencia

Este proyecto está bajo la licencia MIT - vea el archivo [LICENSE](LICENSE) para detalles.

## Instalación rápida

1. **Clonar el repositorio** (si aún no lo has hecho):
   ```bash
   git clone <repository-url>
   cd ludoforge
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Construir los paquetes**:
   ```bash
   pnpm run build
   ```
   Esto construirá el CLI, el servidor MCP y otros paquetes.

## Uso básico

### Instalar Ludoforge en un host

Para instalar Ludoforge en un host (por ejemplo, `generic`, `claude-code`, `hermes`, `opencode`, `codex`):

```bash
# Instalación real (crea archivos de marcador)
ludo init --host <host>

# Prueba en seco (solo muestra lo que se haría)
ludo init --host <host> --dry-run

# Desinstalar (por ahora solo muestra un mensaje)
ludo init --host <host> --uninstall
```

### Crear un nuevo proyecto

```bash
ludo new
```

Esto creará un nuevo proyecto de juego en el directorio actual con la estructura básica.

### Ver el estado del proyecto

```bash
ludo status
```

Muestra información como la fase actual, versión, número de tareas totales y completadas, etc.

### Construir el juego

```bash
ludo build --target windows --profile debug
```

Compila el juego para la plataforma y perfil especificados (por defecto: windows y debug).

### Ejecutar el juego

```bash
ludo run --headless
```

Ejecuta el juego (por defecto con ventana, o sin ventana si se especifica `--headless`).

### Otros comandos disponibles

Ejecute `ludo --help` para ver la lista completa de comandos y sus opciones.

## Documentación

Consulte el directorio [`docs/`](docs/) para obtener información más detallada:

- [docs/STATUS.md](docs/STATUS.md): Estado actual del proyecto y seguimiento de tareas.
- [docs/MCP_REFERENCE.md](docs/MCP_REFERENCE.md): Referencia completa de las herramientas del servidor MCP.
- [docs/backlog/](docs/backlog/): Lista de tareas detalladas en formato YAML.

## Desarrollo

Este proyecto es un monorepo gestionado con pnpm. Los paquetes principales son:

- `packages/cli`: Interfaz de línea de comandos (`ludo`).
- `packages/mcp-server`: Servidor que proporciona las herramientas mediante JSON-RPC sobre stdio.
- `packages/orchestrator`: Orquestador de agentes (actualmente un placeholder).
- `packages/hosts/*`: Adaptadores para diferentes hosts de agentes (generic, claude-code, hermes, opencode, codex).
- `packages/core`: Tipos y esquemas compartidos.

Para reconstruir todo el proyecto:
```bash
pnpm run build
```

Para ejecutar las pruebas:
```bash
pnpm run test
```
(Esto ejecutará las pruebas de todos los paquetes que las tengan.)
