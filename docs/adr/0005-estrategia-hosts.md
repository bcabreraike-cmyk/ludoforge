# ADR 0005 — Estrategia de adaptadores de host
Estado: aceptada
Fecha: 2026-10-09 · Decidió: humano (Builder, Brandon)

## Contexto
Se necesita decidir el orden de creación de adaptadores de host para Ludoforge, considerando la sección 5.3 y la decisión requerida H-06.

## Opciones consideradas
1. Primero el genérico (AGENTS.md + CLI ludo), luego el host que el humano use más.
2. Primero adaptador para Claude Code (ya que es popular entre agentes).
3. Primero adaptador para Hermes Agent (el agente actual).
4. Primero adaptador para OpenCode.
5. Primero adaptador para Codex.

## Decisión
Adoptar el orden sugerido por defecto en H-06:
1. Primero crear el adaptador de host genérico (AGENTS.md universal + CLI ludo) que funciona en cualquier host mediante Modo Sombreros.
2. Luego crear el adaptador para el host que el humano use más (en este caso, Hermes Agent, ya que estamos utilizando este agente para el desarrollo).

## Consecuencias
### Positivas
- El adaptador genérico asegura que Ludoforge pueda usarse en cualquier host desde el inicio, incluso si el host no soporta subagentes (Modo Sombreros).
- Permite retroalimentación temprana de una amplia gama de usuarios.
- El adaptador específico para Hermes Agent puede aprovechar características nativas si existen (como skills, MCP, etc.) una vez que se desarrolle el genérico.

### Negativas
- Puede haber trabajo duplicado si el adaptador genérico ya cubre las necesidades básicas y el adaptador específico añade poco valor.
- Retrasa la disponibilidad de características específicas de hosts populares como Claude Code.

## Verificación
Se verificará que el adaptador de host genérico pueda instalar Ludoforge en un host simulado (mock) y que el agente pueda usar el comando `ludo` sin errores.
Se verificará que el adaptador para Hermes Agent se integre correctamente con el agente Hermes (si aplica).

## Enlaces
- Sección 5.3: Hosts y adaptadores de host
- Sección 19 H-06: Orden de adaptadores de host (Claude Code, Hermes, OpenCode, Codex…)
