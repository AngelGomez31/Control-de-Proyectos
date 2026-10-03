# 📊 Sistema de Control de Proyectos (SPA)

Aplicación web desarrollada como arquitectura **Single Page Application (SPA)** nativa en un único archivo ejecutable (`index.html`), orientada a la gestión de recursos, presupuestos y control de avance de proyectos sin dependencias externas ni backend.

---

## 📈 Estado Actual del Código

| Lenguaje / Componente | Estado de Desarrollo | Porcentaje | Detalle del Avance |
| :--- | :---: | :---: | :--- |
| **HTML5** | 🟢 Completado | **100%** | Estructura semántica terminada. Incluye menú SPA, Dashboard con tarjetas de métricas/sobrecarga y formularios con tablas para Personal, Materiales, Otros Costos y Tareas. |
| **JavaScript (ES6+)** | 🟡 En proceso | **50%** | Conectada la navegación por pestañas y los módulos CRUD en memoria para **Personal** y **Materiales**. Pendientes el módulo de **Otros Costos**, la asignación dinámica en **Tareas**, el motor del **Dashboard** y las reglas de **Integridad Referencial**. |
| **CSS3** | 🔴 Inicial | **15%** | Declaradas únicamente las reglas básicas `.seccion` y `.seccion.active` para permitir la alternancia de pantallas. Pendiente diseño visual, transiciones y transformaciones. |

---

## ⚙️ Especificaciones Técnicas

* **Estructura de Datos:** Manejo de información en memoria RAM mediante arreglos dinámicos (`Array` de objetos en JavaScript).
* **Navegación:** Manipulación de clases del DOM sin recarga de página.
* **Integridad Referencial:** Control estricto para evitar el borrado de entidades asociadas a tareas.

---

## 📋 Estado de Módulos y Requerimientos

- [x] **Navegación SPA:** Transición fluida entre secciones.
- [x] **Registro de Personal:** Formulario y renderizado en tabla en memoria.
- [x] **Registro de Materiales:** Formulario y renderizado en tabla en memoria.
- [ ] **Registro de Otros Costos:** Formulario en HTML, pendiente conectar event listener en JS.
- [ ] **Creación y Asignación de Tareas:**
  - [ ] Generación dinámica de opciones (`<select>`) para Personal, Materiales y Otros Costos.
  - [ ] Asignación de horas de trabajo y cantidades por insumo.
  - [ ] Cambio de estado (Pendiente / Concluida).
- [ ] **Validación de Integridad (Borrado):** Bloqueo de eliminación si el ID figura en `arregloTareas`.
- [ ] **Dashboard Analítico:**
  - [ ] Porcentaje de avance general ($\frac{\text{Concluidas}}{\text{Totales}} \times 100$).
  - [ ] Cálculo de costos Planificados vs. Reales (Totales, Personal, Materiales, Otros).
  - [ ] Algoritmo de detección de sobreutilización (>8 horas/día por trabajador en la misma fecha).
- [ ] **Estilos y Animaciones (CSS3):**
  - [ ] Layout adaptativo para tarjetas (`grid`/`flexbox`).
  - [ ] Transiciones CSS en navegación (`transition: opacity`).
  - [ ] Transformaciones CSS en tarjetas del Dashboard (`transform: translateY`).

---

## 🚀 Hoja de Ruta para Finalizar

1. **JS:** Copiar la lógica de submit/render para el formulario de **Otros Costos**.
2. **JS:** Implementar las funciones de agregar filas dinámicas (`agregarFilaPersonalTarea()`, etc.).
3. **JS:** Procesar el submit de Tareas y vincular el cálculo matemáticos del Dashboard.
4. **JS:** Agregar la restricción `.some()` en las funciones de borrado.
5. **CSS:** Aplicar los estilos visuales, paleta de colores y animaciones requeridas.

---

## 👤 Autor

* **Asignatura:** 3er Parcial de Programación / Ingeniería de Computación.
