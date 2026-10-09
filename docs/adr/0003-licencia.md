# ADR 0003 — Licencia del núcleo y política de marca
Estado: aceptada
Fecha: 2026-10-09 · Decidió: humano (Builder, Brandon)

## Contexto
Se necesita decidir la licencia para el núcleo de Ludoforge y la política de marca, considerando la sección 16.5 y la decisión requerida H-03.

## Opciones consideradas
1. Licencia permisiva: Apache-2.0 (recomendado) o MIT
2. Licencia copyleft: GPL-3.0
3. Licencia propietaria

## Decisión
Adoptar licencia Apache-2.0 para el núcleo, CLI, MCP, roles y blueprints base.
Se establece una política de marca separada para el nombre y logo de Ludoforge.

## Consecuencias
### Positivas
- Apache-2.0 es permisiva y incluye una concesión de patentes, lo que es beneficioso para un proyecto que podría incluir contribuciones de diversas fuentes.
- Facilita la adopción y la creación de derivados comerciales sin requerir la liberación de código fuente de los derivados.
- La separación de la política de marca permite controlar el uso del nombre y logo independientemente de la licencia del código.

### Negativas
- Requiere mantener dos documentos: licencia y política de marca.
- Algunas comunidades prefieren licencias más simples como MIT.

## Verificación
Se verificará que el archivo LICENSE en el repositorio contenga la licencia Apache-2.0 y que exista un documento separado para la política de marca (por ejemplo, TRADEMARK.md).

## Enlaces
- Sección 16.5: Licencia, propiedad y gobernanza
- Sección 19 H-03: Licencia del núcleo y política de marca
