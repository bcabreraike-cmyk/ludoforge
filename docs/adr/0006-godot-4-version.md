# ADR 0006 — Godot 4 version
Estado: aceptada
Fecha: 2026-10-09 · Decidió: humano (Builder)

## Contexto
Necesitamos fijar una versión estable de Godot 4 para el adaptador de motor en la Fase 1. La versión debe ser lo suficientemente reciente para tener características estables y lo suficientemente probada para evitar errores críticos en modo headless.

## Opciones consideradas (pros/contras)
- **Godot 4.0**: Estable pero puede carecer de mejoras y correcciones de errores posteriores.
- **Godot 4.1**: Mejoras sobre 4.0, pero aún no la última estable.
- **Godot 4.2.1**: Versión estable reciente con correcciones de errores y mejoras de rendimiento.
- **Godot 4.3 beta**: Características más nuevas pero inestable, riesgo de cambios que rompan la compatibilidad.

## Decisión
Se fija la versión de Godot 4 a utilizar como **4.2.1** (estable). Esta versión ofrece un buen equilibrio entre estabilidad y características para el desarrollo inicial del adaptador.

## Consecuencias (positivas y negativas)
Positivas:
- Versión probada y estable para uso en modo headless.
- Disponible en los canales oficiales de descarga.
Negativas:
- Puede requerir actualización futura a medida que se lancen versiones más estables con mejoras significativas.
- La versión 4.2.1 podría no tener algunas características de las versiones beta posteriores.

## Verificación (cómo sabremos que fue correcta)
- El adaptador de Godot 4 verificará la versión instalada y será compatible con 4.2.1.
- Se probará el scaffold, run y build en modo headless con Godot 4.2.1.

## Enlaces
- Tarea LF-020: Adaptador Godot
