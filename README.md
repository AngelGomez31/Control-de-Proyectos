# 📊 Sistema de Control de Proyectos (SPA)

Un sistema de gestión y control de proyectos desarrollado con arquitectura **Single Page Application (SPA)** nativa (sin frameworks ni librerías externas). Permite administrar presupuestos, personal, insumos y asignación de tareas, además de visualizar métricas en tiempo real a través de un Dashboard analítico.

---

## 📈 Estado del Proyecto y Avance

| Lenguaje / Módulo | Estado de Desarrollo | Porcentaje | Notas |
| :--- | :---: | :---: | :--- |
| **HTML5** | 🟢 Completado | **100%** | Estructura semántica, formulación de entidades y tablas terminadas. |
| **CSS3** | 🟡 En proceso | **30%** | Reglas básicas de visualización y alternancia de vistas configuradas. Pendiente aplicar estilos del Dashboard, *transitions* y *transformations*. |
| **JavaScript (ES6+)** | 🟡 En proceso | **60%** | Lógica de navegación SPA, formularios de Personal/Materiales y manipulación básica del DOM implementadas. Pendiente dinamismo de tareas y motor del Dashboard. |

---

## 🛠️ Requisitos Técnicos y Arquitectura

* **Patrón de Arquitectura:** Single Page Application (SPA) en un solo archivo ejecutable en el navegador.
* **Persistencia de Datos:** Estructuras de datos dinámicas en memoria RAM utilizando arreglos (`Array`) de JavaScript.
* **Backend:** Ninguno (requisito académico del proyecto).

---

## 📌 Funcionalidades Principales

- [x] **Navegación SPA:** Transición entre secciones sin recargar la página.
- [x] **Gestión de Personal:** Registro de trabajadores y definición de costo por hora.
- [x] **Gestión de Materiales:** Registro de insumos con unidades de medida y costo unitario.
- [x] **Gestión de Otros Costos:** Registro de servicios o gastos adicionales.
- [ ] **Asignación Múltiple en Tareas:** Creación dinámicas de filas para asociar personal, horas, materiales y otros costos.
- [ ] **Integridad Referencial:** Bloqueo de eliminación para elementos que estén o hayan estado asignados a una tarea.
- [ ] **Dashboard Analítico:**
  - Cálculo automático del avance (%) basado en tareas concluidas.
  - Comparativa de costo Total, Personal, Materiales y Otros (Planificado vs. Real).
  - Alerta de sobreutilización de personal (>8 horas de trabajo por día).

---

## 🚀 Próximos Pasos (Roadmap)

1. **JavaScript:** Completar el generador de filas dinámicas dentro del formulario de Tareas.
2. **JavaScript:** Programar la función de cálculo financiero y detección de sobrecarga laboral en el Dashboard.
3. **JavaScript:** Aplicar la validación de integridad referencial con `.some()` en la eliminación de datos.
4. **CSS3:** Diseñar la interfaz con Grid/Flexbox, agregar animación a la barra de progreso y efectos `hover` con `transform: translateY()`.

---

## 👤 Autor

* **Desarrollado para:** 3er Parcial de Programación / Ingeniería.
