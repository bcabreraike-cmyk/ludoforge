# ADR 0001 — Resumen inicial
Estado: aceptada
Fecha: 2026-10-09 · Decidió: humano (Builder, Brandon)

## Contexto
Se está iniciando el proyecto Ludoforge siguiendo la especificación maestra proporcionada. Se ha inspeccionado el entorno, inicializado el repositorio con la estructura mínima requerida y se está procediendo a documentar el entendimiento inicial, supuestos, dudas y decisiones pendientes que requieren intervención humana según la sección 19 de la especificación.

## Qué entendí
- Ludoforge es una herramienta para instalar en un agente de IA (como Claude Code, Codex, Hermes Agent, OpenCode, etc.) que le permite crear videojuegos completos desde cero, trabajando como un estudio multiagente por etapas (prototipo → alfa → beta → versión final).
- El Builder (yo) es responsable de construir el producto (Ludoforge), mientras que el Estudio (equipo de agentes con roles) es responsable de crear el juego del usuario.
- Se deben seguir reglas de trabajo obligatorias: leer el documento completo antes de codificar, no inventar APIs/versiones, hacer incrementos pequeños, Definition of Done estricta, registrar decisiones no triviales como ADR, evitar secretos en el repositorio, asegurar seguridad y licencias, mantener el estado actualizado, evitar sobre-ingeniería, mantener independencia de proveedor, separar implementador/revisor en pruebas, y documentar en español primero.
- El protocolo de arranque incluye: inspección del entorno, inicialización del repositorio, escritura de este ADR, preparación de CI, creación del tablero del proyecto desde el backlog inicial, iniciar con LF-001 y continuar en orden de dependencias, y al terminar actualizar STATUS.md y CHANGELOG.md.
- La Definition of Done requiere: compilación/ejecución sin errores en SO objetivo, pruebas nuevas/todas en verde, lint y tipos sin errores, criterios de aceptación verificados con evidencia, documentación actualizada, ADR si hubo decisión de diseño no trivial, CHANGELOG actualizado, ausencia de secretos y dependencias de licencia desconocida, y estado de tarea actualizado a 'done'.
- Se deben evitar: construir un motor propio, prometer un clic = GTA V, acoplar el núcleo a un host de agentes, guardar estado importante solo en memoria/conversación, usar assets/nombres/personajes/música/marcas de juegos existentes, y escribir código a prueba de todo antes de tener un camino extremo a extremo funcionando.
- El glosario mínimo define términos como Host, Estudio, CEO/Director, Rol/tarjeta de rol, Blueprint, Módulo, Style pack, Adapter, Spec/Game Spec, Gate, Tier, ADR, y Build jugable.

## Supuestos
1. El nombre provisionalmente recomendado "Ludoforge" está disponible para uso (dominio, GitHub, npm/PyPI, marca) aunque esto requiere verificación humana (H-01).
2. El stack recomendado (TypeScript/Node.js LTS para core/cli/mcp-server/hosts, Python para pipeline de assets, GDScript para Godot tests) es adecuado y se ratificará en H-02.
3. La licencia provisional MIT será reemplazada por la decidida en H-03 (probablemente Apache-2.0).
4. Godot 4 será el motor principal para las fases 1-2 y Web para prototipos/ligeros, según H-04.
5. Los proveedores de generación inicialmente serán locales/mock en fases 0-1, según H-05.
6. El orden de adaptadores de host iniciará con genérico (AGENTS.md) seguido del host que el humano use más, según H-06.
7. Los sistemas operativos objetivo son Windows y macOS (y Linux en CI), según H-07.
8. El modelo inicial será open-core: núcleo abierto, packs premium después, según H-08.
9. La documentación será en español primero, inglés después, según H-09.
10. La autonomía por defecto para Builder y Estudio es L2 (Colaborador), según H-10.
11. El repositorio alojará inicialmente como privado hasta decisión en H-11.
12. El juego de referencia #1 (T1) será "Plataformas 2D retro original, 8 niveles", según H-12.
13. El umbral mínimo de puntuación de evals de roles será 0.8 sobre 1.0, según H-13.
14. La política de telemetría y privacidad será opt-in anónima, según H-14.
15. La gestión de presupuesto máximo del proyecto será con tope bajo y explícito por fase, según H-15.

## Dudas
- ¿Cuál es la versión estable exacta de Godot 4 que se debe fijar para la Fase 1? Se requiere verificar la última estable y registrarla en un ADR.
- ¿Cuál será la organización/usuario de GitHub final para el repositorio? (H-11)
- ¿Se confirmará el nombre "Ludoforge" tras verificaciones de marca y dominio? (H-01)
- ¿Qué proveedores de generación específicos se configurarán una vez que se asignen créditos de generación? (H-05)
- ¿Cuál será el presupuesto detallado por fase para tokens, créditos de generación y minutos de cómputo? (H-15)
- ¿Cómo se manejará la escalabilidad del equipo según la fórmula de §9.4 en la práctica?
- ¿Cuál será el proceso exacto para la verificación de licencia de assets y la generación del informe de licencias?
- ¿Cómo se integrarán los adaptadores de host para los diferentes plataformas de mensajería (Telegram, Discord, etc.)?
- ¿Cuál será el método para generar y validar assets de voz (TTS) con licencia comercial confirmada?

## Decisiones de la §19 que aún faltan
Todas las decisiones marcadas como REQUIERE HUMANO en la sección 19 están pendientes de confirmación. Se listan a continuación con su ID, descripción, valor por defecto provisional y si bloquea alguna tarea inicial:

- H-01: Nombre definitivo y verificación de disponibilidad (dominio, GitHub, npm/PyPI, marca) → Valor por defecto: Ludoforge → Bloquea: Publicación; no bloquea desarrollo
- H-02: Lenguaje/stack del núcleo → Valor por defecto: TypeScript (Node LTS) + Python (assets) + GDScript (Godot) → Bloquea: LF-001
- H-03: Licencia del núcleo y política de marca → Valor por defecto: Apache-2.0 + política de marca separada → Bloquea: Publicación
- H-04: Motor principal y plan para Unity/Unreal → Valor por defecto: Godot 4 + Web; Unity/Unreal exploratorios en Fase 6 → Bloquea: LF-020
- H-05: Proveedores de generación (imagen/3D/audio/voz) y presupuesto mensual → Valor por defecto: Locales/*mock* en Fases 0–1; sin gasto en proveedores de pago → Bloquea: LF-026 (proveedor real)
- H-06: Orden de adaptadores de host (Claude Code, Hermes, OpenCode, Codex…) → Valor por defecto: Genérico (AGENTS.md) primero; luego el host que el humano use más → Bloquea: LF-041
- H-07: Sistemas operativos objetivo → Valor por defecto: Windows y macOS (y Linux en CI) → Bloquea: LF-004
- H-08: Open-source total o open-core desde el día 1 → Valor por defecto: Open-core: núcleo abierto, packs premium después → Bloquea: Publicación
- H-09: Idioma de documentación → Valor por defecto: Español primero, inglés después → Bloquea: LF-048
- H-10: Autonomía por defecto del Builder y del Estudio → Valor por defecto: Builder: L2; Estudio: L2 → Bloquea: Inicio
- H-11: Alojamiento del repositorio (organización/usuario de GitHub) → Valor por defecto: Repositorio privado hasta decidir → Bloquea: LF-001
- H-12: Juego de referencia #1 (T1) → Valor por defecto: «Plataformas 2D retro original, 8 niveles» → Bloquea: LF-031
- H-13: Umbral mínimo de puntuación de evals de roles → Valor por defecto: 0.8 sobre 1.0 → Bloquea: LF-046
- H-14: Política de telemetría y privacidad → Valor por defecto: Opt-in anónima → Bloquea: Fase 6
- H-15: Gestión de presupuesto máximo del proyecto (tokens/créditos/minutos) → Valor por defecto: Tope bajo y explícito por fase → Bloquea: Cada fase

Se procederá con los valores por defecto provisionales solo de forma temporal y se registrará cada decisión en un ADR marcado como provisional hasta que el humano la confirme. Mientras se espera la confirmación, se avanzará en tareas que no dependan de ellas.

## Consecuencias
- Positivas: Tener un registro claro de entendimientos, supuestos y decisiones pendientes facilita la comunicación y evita suposiciones no verificadas.
- Negativas: Hasta que se confirmen las decisiones H-xx, existe riesgo de tener que rehacer trabajo si las decisiones finales difieren de los provisionales.

## Verificación
Se verificará que este ADR exista y contenga la información requerida al revisar el repositorio. Además, se comprobará que las tareas iniciales (LF-001 en adelante) no se bloqueen indebidamente por decisiones pendientes, avanzando solo en lo independiente.

## Enlaces
- [LUDOFORGE_MASTER_SPEC.md](../../Downloads/LUDOFORGE_MASTER_SPEC.md) (especificación maestra)
- [docs/STATUS.md](./STATUS.md) (estado actual)
- [docs/ENVIRONMENT.md](./ENVIRONMENT.md) (entorno inspeccionado)
