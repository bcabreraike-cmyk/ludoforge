# ADR 0004 — Motor principal y plan para Unity/Unreal
Estado: aceptada
Fecha: 2026-10-09 · Decidió: humano (Builder, Brandon)

## Contexto
Se necesita decidir el motor principal para las fases iniciales de Ludoforge y el plan para adaptadores de Unity y Unreal, considerando la sección 7 y la decisión requerida H-04.

## Opciones consideradas
1. Godot 4 como motor principal, con adaptador Web para prototipos; Unity y Unreal como adaptadores exploratorios en fases posteriores.
2. Unity como motor principal.
3. Unreal Engine como motor principal.
4. Motor propio desde el inicio (no recomendado en la sección 7.6).

## Decisión
Adoptar Godot 4 como motor principal para las fases 1-2 (2D y 3D) y un adaptador Web (Phaser/Three.js/Babylon) para prototipos y juegos ligeros.
Planificar adaptadores exploratorios para Unity y Unreal en la Fase 6, después de validar el enfoque con Godot y Web.
No construir un motor propio en esta fase, ya que no se justifica según los criterios de la sección 7.6.

## Consecuencias
### Positivas
- Godot 4 tiene una licencia permisiva (MIT) y buen soporte para 2D y 3D.
- El formato de proyecto editable como texto facilita la generación y verificación por agentes.
- El adaptador Web permite resultados inmediatos en el navegador para validación rápida.
- Posponer Unity y Unreal a fases posteriores permite enfocarse en estabilizar el núcleo primero.
- Evita la inversión temprana en un motor propio que no es el cuello de botella.

### Negativas
- Godot 4 puede tener limitaciones en rendimiento 3D AAA en comparación con Unreal.
- Requiere mantener múltiples adaptadores.

## Verificación
Se verificará que el adaptador Godot 4 pueda generar un proyecto desde una spec válida y que el proyecto se compile y ejecute en modo headless.
Se verificará que el adaptador Web pueda generar un proyecto que se ejecute en un navegador headless.

## Enlaces
- Sección 7: Motores y adaptadores
- Sección 19 H-04: Motor principal y plan para Unity/Unreal
