let arregloPersonal = [];
let arregloMateriales = [];
let arregloOtrosCostos = [];
let arregloTareas = [];

let idPersonalSeq = 1;
let idMaterialSeq = 1;
let idOtrosSeq = 1;
let idTareasSeq = 1;

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacion();
    inicializarFormularios();
    actualizarDashboard();
    renderTablaPersonal();
    renderTablaMateriales();
    renderTablaOtros();
    renderTablaTareas();
    actualizarDashboard();
});

document.addEventListener('input', function (e) {
    if (e.target.classList.contains('solo-letras')) {
        e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }
});

function inicializarNavegacion(){
    const botonesNav = document.querySelectorAll('.btn-nav');
    botonesNav.forEach(boton => {
        boton.addEventListener('click',() =>{
            const objetivo = boton.getAttribute('data-target');
            cambiarSeccion(objetivo);    
        });
    });
}

function cambiarSeccion(objetivo){
    const secciones = document.querySelectorAll('.seccion');
    const botonesNav = document.querySelectorAll('.btn-nav');
    secciones.forEach(sec => sec.classList.remove('active'));
    botonesNav.forEach(btn => btn.classList.remove('active'));
    const seccionObjetivo = document.getElementById(`seccion-${objetivo}`);
    const botonActivo = document.querySelector(`.btn-nav[data-target="${objetivo}"]`);
    if (seccionObjetivo) seccionObjetivo.classList.add('active');
    if (botonActivo) botonActivo.classList.add('active');

    if (objetivo === 'dashboard'){
        actualizarDashboard();
    }   
}

function inicializarFormularios(){
    const formPersonal = document.getElementById('form-personal');
    if (formPersonal){
        formPersonal.addEventListener('submit',(e) =>{
            e.preventDefault();
            const nombre = document.getElementById('pers-nombre').value.trim();
            const rol = document.getElementById('pers-rol').value.trim();
            const costoHora = parseFloat(document.getElementById('pers-costo').value);

            // Item 6: Validación numérica estricta
            if(!nombre || !rol || isNaN(costoHora) || !isFinite(costoHora) || costoHora <= 0){
                mostrarToast('Por favor ingrese un costo por hora válido mayor a 0.', 'error');
                return;
            }

            // Item 3: Validación de nombres duplicados en Personal
            if (arregloPersonal.some(p => p.nombre.trim().toLowerCase() === nombre.toLowerCase())){
                mostrarToast(`Ya existe un trabajador registrado con el nombre "${nombre}".`, 'error');
                return;
            }

            const nuevoPersonal = {
                id: idPersonalSeq++,
                nombre,
                rol,
                costoHora,
            };
            
            arregloPersonal.push(nuevoPersonal);
            formPersonal.reset();
            renderTablaPersonal();
            actualizarDashboard();
            mostrarToast(`Personal "${nombre}" registrado con éxito.`, 'success');
        });
    }

    const formMateriales = document.getElementById('form-materiales');
    if (formMateriales){
        formMateriales.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('mater-nombre').value.trim();
            const unidad = document.getElementById('mater-unidad').value.trim();
            const precioUnitario = parseFloat(document.getElementById('mater-costo').value);

            // Item 6: Validación numérica estricta
            if (!nombre || !unidad || isNaN(precioUnitario) || !isFinite(precioUnitario) || precioUnitario <= 0){
                mostrarToast('Por favor ingrese un precio unitario de material válido mayor a 0.', 'error');
                return;
            }

            // Item 3: Validación de nombres duplicados en Materiales
            if (arregloMateriales.some(m => m.nombre.trim().toLowerCase() === nombre.toLowerCase())){
                mostrarToast(`Ya existe un material registrado con el nombre "${nombre}".`, 'error');
                return;
            }

            const nuevoMaterial = {
                id: idMaterialSeq++,
                nombre,
                unidad,
                precioUnitario
            };

            arregloMateriales.push(nuevoMaterial);
            formMateriales.reset();
            renderTablaMateriales();
            actualizarDashboard();
            mostrarToast(`Material "${nombre}" registrado con éxito.`, 'success');
        });
    }

    const formOtros = document.getElementById('form-otros');
    if (formOtros){
        formOtros.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('otro-nombre').value.trim();
            const costoUnitario = parseFloat(document.getElementById('otro-costo').value);

            // Item 6: Validación numérica estricta
            if(!nombre || isNaN(costoUnitario) || !isFinite(costoUnitario) || costoUnitario <= 0){
                mostrarToast('Por favor ingrese un costo unitario válido mayor a 0.', 'error');
                return;
            }

            // Item 3: Validación de nombres duplicados en Otros Costos
            if (arregloOtrosCostos.some(o => o.nombre.trim().toLowerCase() === nombre.toLowerCase())){
                mostrarToast(`Ya existe un gasto registrado con la descripción "${nombre}".`, 'error');
                return;
            }
            
            const nuevoGasto = {
                id: idOtrosSeq++,
                nombre,
                costoUnitario,
            };

            arregloOtrosCostos.push(nuevoGasto);
            formOtros.reset();
            renderTablaOtros();
            actualizarDashboard();
            mostrarToast(`Gasto "${nombre}" registrado con éxito.`, 'success');
        });
    }

    const formTareas = document.getElementById('form-tareas');
    if (formTareas){
        formTareas.addEventListener('submit', (e) =>{
            e.preventDefault();
            crearTarea();
        });
    }

    const formEditTarea = document.getElementById('form-editar-tarea');
    if (formEditTarea){
        formEditTarea.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarEdicionTarea();
        });
    }
}

function renderTablaPersonal(){
    const tbody = document.getElementById('tabla-personal-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (arregloPersonal.length === 0){
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-dim);">No hay personal registrado aún.</td></tr>`;
        return;
    }

    arregloPersonal.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
      <td><strong>#${p.id}</strong></td>
      <td>${p.nombre}</td>
      <td>${p.rol}</td>
      <td>$${p.costoHora.toFixed(2)}/h</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarPersonal(${p.id})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
    });
}

function eliminarPersonal(id){
    const persona = arregloPersonal.find(p => p.id === id);
    if (!persona) return;

    // Solo se bloquea si la persona está en una tarea que NO está finalizada (pendiente o en proceso)
    const asignadoEnTareaActiva = arregloTareas.some(tarea =>
        tarea.estado !== 'finalizado' && tarea.personalAsignado.some(pa => pa.idPersonal === id)
    );

    if (asignadoEnTareaActiva) {
        mostrarToast(`No se puede eliminar a "${persona.nombre}" porque está asignado a una tarea activa (pendiente o en proceso).`, 'error');
        return;
    }

    arregloPersonal = arregloPersonal.filter(p => p.id !== id);
    renderTablaPersonal();
    actualizarDashboard();
    mostrarToast(`Personal "${persona.nombre}" eliminado.`, 'success');
}

function renderTablaMateriales(){
    const tbody = document.getElementById('tabla-material-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (arregloMateriales.length === 0){
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-dim);">No hay materiales registrados aún.</td></tr>`;
        return;
    }

    arregloMateriales.forEach(m => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
      <td><strong>#${m.id}</strong></td>
      <td>${m.nombre}</td>
      <td>${m.unidad}</td>
      <td>$${m.precioUnitario.toFixed(2)}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarMaterial(${m.id})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
    });
}

function eliminarMaterial(id){
    const mat = arregloMateriales.find(m => m.id === id);
    if (!mat) return;

    // Solo se bloquea si el material está en una tarea que NO está finalizada (pendiente o en proceso)
    const asignadoEnTareaActiva = arregloTareas.some(tarea =>
        tarea.estado !== 'finalizado' && tarea.materialesAsignados.some(ma => ma.idMaterial === id)
    );

    if(asignadoEnTareaActiva){
        mostrarToast(`No se puede eliminar "${mat.nombre}" porque está asignado a una tarea activa (pendiente o en proceso).`, 'error');
        return;
    }

    arregloMateriales = arregloMateriales.filter(m => m.id !== id);
    renderTablaMateriales();
    actualizarDashboard();
    mostrarToast(`Material "${mat.nombre}" eliminado.`, 'success');
}

function renderTablaOtros(){
    const tbody = document.getElementById('tabla-otros-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (arregloOtrosCostos.length === 0){
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-dim);">No hay otros costos registrados aún.</td></tr>`;
        return;
    }

    arregloOtrosCostos.forEach(o => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
      <td><strong>#${o.id}</strong></td>
      <td>${o.nombre}</td>
      <td>$${o.costoUnitario.toFixed(2)}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarOtro(${o.id})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
    });
}

function eliminarOtro(id){
    const otro = arregloOtrosCostos.find(o => o.id === id);
    if (!otro) return;

    // Solo se bloquea si el gasto está en una tarea que NO está finalizada (pendiente o en proceso)
    const asignadoEnTareaActiva = arregloTareas.some(tarea =>
        tarea.estado !== 'finalizado' && tarea.otrosAsignados.some(oa => oa.idOtro === id)
    );

    if(asignadoEnTareaActiva){
        mostrarToast(`No se puede eliminar "${otro.nombre}" porque está asignado a una tarea activa (pendiente o en proceso).`, 'error');
        return;
    }

    arregloOtrosCostos = arregloOtrosCostos.filter(o => o.id !== id);
    renderTablaOtros();
    actualizarDashboard();
    mostrarToast(`Costo "${otro.nombre}" eliminado.`, 'success');
}

function agregarFilaPersonalTarea(){
    if(arregloPersonal.length === 0){
        mostrarToast('Primero debe registrar al menos un trabajador en la pestaña Personal.', 'error');
        return;
    }

    const contenedor = document.getElementById('tarea-personal-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

    div.innerHTML = `
    <select class="t-pers-select" required>
      ${arregloPersonal.map(p => `<option value="${p.id}">${p.nombre} (${p.rol}) - $${p.costoHora.toFixed(2)}/h</option>`).join('')}
    </select>
    <input type="number" class="t-pers-horas" placeholder="Horas trab." min="0.5" step="0.5" required>
    <button type="button" class="btn-quitar-fila" onclick="this.parentElement.remove()" title="Quitar">✕</button>
  `; 
  contenedor.appendChild(div);
}

function agregarFilaMaterialTarea(){
    if (arregloMateriales.length === 0){
        mostrarToast('Primero debe registrar al menos un material en la sección Materiales.', 'error');
        return;
    }

    const contenedor = document.getElementById('tarea-materiales-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

    div.innerHTML = `
    <select class="t-mat-select" required>
      ${arregloMateriales.map(m => `<option value="${m.id}">${m.nombre} ($${m.precioUnitario.toFixed(2)} / ${m.unidad})</option>`).join('')}
    </select>
    <input type="number" class="t-mat-cant" placeholder="Cantidad" min="0.1" step="0.1" required>
    <button type="button" class="btn-quitar-fila" onclick="this.parentElement.remove()" title="Quitar">✕</button>
  `;
  contenedor.appendChild(div);
}

function agregarFilaOtroTarea(){
    if (arregloOtrosCostos.length === 0){
        mostrarToast('Primero debe registrar al menos un gasto en la sección Otros Costos.', 'error');
        return;
    }

    const contenedor = document.getElementById('tarea-otros-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

     div.innerHTML = `
    <select class="t-otro-select" required>
      ${arregloOtrosCostos.map(o => `<option value="${o.id}">${o.nombre} ($${o.costoUnitario.toFixed(2)})</option>`).join('')}
    </select>
    <input type="number" class="t-otro-cant" placeholder="Cant. / Servicios" min="1" step="1" required>
    <button type="button" class="btn-quitar-fila" onclick="this.parentElement.remove()" title="Quitar">✕</button>
  `;
   contenedor.appendChild(div);
}

function limpiarContenedoresDinamicosTarea(){
    const pCont = document.getElementById('tarea-personal-contenedor');
    const mCont = document.getElementById('tarea-materiales-contenedor');
    const oCont = document.getElementById('tarea-otros-contenedor');
    if (pCont) pCont.innerHTML = '';
    if (mCont) mCont.innerHTML = '';
    if (oCont) oCont.innerHTML = '';
}

function crearTarea() {
    const nombre = document.getElementById('tarea-nombre').value.trim();
    const fecha = document.getElementById('tarea-fecha').value;

    if (!nombre || !fecha){
        mostrarToast('El nombre de la tarea y la fecha son obligatorios.', 'error');
        return;
    }

    const filasPers = document.querySelectorAll('#tarea-personal-contenedor .fila-dinamica');
    if (filasPers.length === 0) {
        mostrarToast('Debe asignar al menos un trabajador a la tarea (campo obligatorio).', 'error');
        return;
    }

    const personalAsignado = [];
    const idsPersVistos = new Set(); // Item 1: Control de duplicados

    for (let fila of filasPers){
        const idPersonal = parseInt(fila.querySelector('.t-pers-select').value);
        const horas = parseFloat(fila.querySelector('.t-pers-horas').value);

        // Item 6: Validación numérica
        if (isNaN(horas) || !isFinite(horas) || horas <= 0){
            mostrarToast('Por favor asigne horas de trabajo válidas (> 0).', 'error');
            return;
        }

        // Item 1: Validación duplicado en la misma tarea
        if (idsPersVistos.has(idPersonal)){
            const persObj = arregloPersonal.find(p => p.id === idPersonal);
            const nombrePers = persObj ? persObj.nombre : `ID #${idPersonal}`;
            mostrarToast(`No puede asignar al trabajador "${nombrePers}" más de una vez en la misma tarea.`, 'error');
            return;
        }
        idsPersVistos.add(idPersonal);

        const persObj = arregloPersonal.find(p => p.id === idPersonal);
        personalAsignado.push({
            idPersonal,
            nombre: persObj ? persObj.nombre : `Trabajador #${idPersonal}`,
            rol: persObj ? persObj.rol : '',
            costoHora: persObj ? persObj.costoHora : 0,
            horas
        });
    }

    const filasMat = document.querySelectorAll('#tarea-materiales-contenedor .fila-dinamica');
    if (filasMat.length === 0) {
        mostrarToast('Debe asignar al menos un material a la tarea (campo obligatorio).', 'error');
        return;
    }

    const materialesAsignados = [];
    const idsMatVistos = new Set(); // Item 1: Control de duplicados

    for (let fila of filasMat){
        const idMaterial = parseInt(fila.querySelector('.t-mat-select').value);
        const cantidad = parseFloat(fila.querySelector('.t-mat-cant').value);

        // Item 6: Validación numérica
        if (isNaN(cantidad) || !isFinite(cantidad) || cantidad <= 0) { 
            mostrarToast('Por favor ingrese una cantidad de material válida (> 0).', 'error'); 
            return; 
        }

        // Item 1: Validación duplicado en la misma tarea
        if (idsMatVistos.has(idMaterial)){
            const matObj = arregloMateriales.find(m => m.id === idMaterial);
            const nombreMat = matObj ? matObj.nombre : `ID #${idMaterial}`;
            mostrarToast(`No puede asignar el material "${nombreMat}" más de una vez en la misma tarea.`, 'error');
            return;
        }
        idsMatVistos.add(idMaterial);

        const matObj = arregloMateriales.find(m => m.id === idMaterial);
        materialesAsignados.push({
            idMaterial,
            nombre: matObj ? matObj.nombre : `Material #${idMaterial}`,
            unidad: matObj ? matObj.unidad : '',
            precioUnitario: matObj ? matObj.precioUnitario : 0,
            cantidad
        });
    }

    // Otros costos es OPCIONAL
    const otrosAsignados = [];
    const idsOtroVistos = new Set(); // Item 1: Control de duplicados
    const filasOtros = document.querySelectorAll('#tarea-otros-contenedor .fila-dinamica');

    for (let fila of filasOtros){
        const idOtro = parseInt(fila.querySelector('.t-otro-select').value);
        const cantidad = parseFloat(fila.querySelector('.t-otro-cant').value);

        // Item 6: Validación numérica
        if (isNaN(cantidad) || !isFinite(cantidad) || cantidad <= 0) { 
            mostrarToast('Por favor ingrese una cantidad de servicio o gasto válida (> 0).', 'error');
            return;
        }

        // Item 1: Validación duplicado en la misma tarea
        if (idsOtroVistos.has(idOtro)){
            const otroObj = arregloOtrosCostos.find(o => o.id === idOtro);
            const nombreOtro = otroObj ? otroObj.nombre : `ID #${idOtro}`;
            mostrarToast(`No puede asignar el gasto "${nombreOtro}" más de una vez en la misma tarea.`, 'error');
            return;
        }
        idsOtroVistos.add(idOtro);

        const otroObj = arregloOtrosCostos.find(o => o.id === idOtro);
        otrosAsignados.push({
            idOtro,
            nombre: otroObj ? otroObj.nombre : `Gasto #${idOtro}`,
            costoUnitario: otroObj ? otroObj.costoUnitario : 0,
            cantidad
        });
    }
    
    const nuevaTarea = {
        id: idTareasSeq++,
        nombre,
        fecha,
        personalAsignado,
        materialesAsignados,
        otrosAsignados,
        estado: 'pendiente', // 3 estados: 'pendiente', 'en proceso', 'finalizado'
        concluida: false
    };

    arregloTareas.push(nuevaTarea);
    
    document.getElementById('form-tareas').reset();
    limpiarContenedoresDinamicosTarea();
    renderTablaTareas();
    actualizarDashboard();
    mostrarToast(`Tarea "${nombre}" creada exitosamente.`, 'success');   
}

function calcularCostosTarea(tarea){
    let costoPersonal = (tarea.personalAsignado || []).reduce((acc,p) =>{
        const pers = arregloPersonal.find(x => x.id === p.idPersonal);
        const costoH = pers ? pers.costoHora : (p.costoHora || 0);
        return acc + (costoH * p.horas);
    }, 0);

    let costoMateriales = (tarea.materialesAsignados || []).reduce((acc,m) => {
        const mat = arregloMateriales.find(x => x.id === m.idMaterial);
        const precioU = mat ? mat.precioUnitario : (m.precioUnitario || 0);
        return acc + (precioU * m.cantidad);
    }, 0);

    let costoOtros = (tarea.otrosAsignados || []).reduce((acc,o) => {
        const otro = arregloOtrosCostos.find(x => x.id === o.idOtro);
        const costoU = otro ? otro.costoUnitario : (o.costoUnitario || 0);
        return acc + (costoU * o.cantidad);
    }, 0);

    return {
        personal: costoPersonal,
        materiales: costoMateriales,
        otros: costoOtros,
        total: costoPersonal + costoMateriales + costoOtros
    };
}

function cambiarEstadoTarea(id, nuevoEstado){
    const tarea = arregloTareas.find(t => t.id === id);
    if (!tarea) return;

    // Item 5: Integridad / Auditoría - Una tarea finalizada no puede ser reabierta
    if (tarea.estado === 'finalizado' && nuevoEstado !== 'finalizado') {
        mostrarToast('Una tarea FINALIZADA ya está cerrada formalmente y no se puede revertir.', 'error');
        renderTablaTareas();
        return;
    }

    tarea.estado = nuevoEstado;
    tarea.concluida = (nuevoEstado === 'finalizado');
    renderTablaTareas();
    actualizarDashboard();

    if (nuevoEstado === 'finalizado'){
        mostrarToast(`Tarea "${tarea.nombre}" marcada como FINALIZADA.`, 'success');
    } else if (nuevoEstado === 'en proceso') {
        mostrarToast(`Tarea "${tarea.nombre}" cambiada a EN PROCESO.`, 'info');
    } else {
        mostrarToast(`Tarea "${tarea.nombre}" cambiada a PENDIENTE.`, 'info');
    }
}

function eliminarTarea(id){
    const tarea = arregloTareas.find(t => t.id === id);
    if (!tarea) return;

    if (tarea.estado === 'en proceso'){
        mostrarToast(`No se puede eliminar la tarea "${tarea.nombre}" mientras esté EN PROCESO.`, 'error');
        return;
    }

    arregloTareas = arregloTareas.filter(t => t.id !== id);
    renderTablaTareas();
    actualizarDashboard();
    mostrarToast(`Tarea "${tarea.nombre}" eliminada.`, 'success');
}

// -------------------------------------------------------------
// FUNCIONES DE EDICIÓN DE TAREAS (Solo permitido en estado Pendiente)
// -------------------------------------------------------------
function abrirModalEditarTarea(id){
    const tarea = arregloTareas.find(t => t.id === id);
    if (!tarea) return;

    if (tarea.estado !== 'pendiente'){
        mostrarToast('Solo se pueden editar tareas que estén en estado Pendiente.', 'error');
        return;
    }

    document.getElementById('edit-tarea-id').value = tarea.id;
    document.getElementById('edit-tarea-nombre').value = tarea.nombre;
    document.getElementById('edit-tarea-fecha').value = tarea.fecha;

    const pCont = document.getElementById('edit-tarea-personal-contenedor');
    const mCont = document.getElementById('edit-tarea-materiales-contenedor');
    const oCont = document.getElementById('edit-tarea-otros-contenedor');
    pCont.innerHTML = '';
    mCont.innerHTML = '';
    oCont.innerHTML = '';

    // Cargar personal asignado existente
    tarea.personalAsignado.forEach(pa => {
        agregarFilaPersonalEdit(pa.idPersonal, pa.horas);
    });

    // Cargar materiales asignados existentes
    tarea.materialesAsignados.forEach(ma => {
        agregarFilaMaterialEdit(ma.idMaterial, ma.cantidad);
    });

    // Cargar otros asignados existentes
    tarea.otrosAsignados.forEach(oa => {
        agregarFilaOtroEdit(oa.idOtro, oa.cantidad);
    });

    const modal = document.getElementById('modal-editar-tarea');
    if (modal) modal.classList.add('active');
}

function cerrarModalEditarTarea(){
    const modal = document.getElementById('modal-editar-tarea');
    if (modal) modal.classList.remove('active');
}

function agregarFilaPersonalEdit(idPersonalSeleccionado = null, horasValor = ''){
    if (arregloPersonal.length === 0){
        mostrarToast('No hay trabajadores registrados en el sistema.', 'error');
        return;
    }

    const contenedor = document.getElementById('edit-tarea-personal-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

    div.innerHTML = `
    <select class="t-pers-select" required>
      ${arregloPersonal.map(p => `
        <option value="${p.id}" ${idPersonalSeleccionado === p.id ? 'selected' : ''}>
          ${p.nombre} (${p.rol}) - $${p.costoHora.toFixed(2)}/h
        </option>
      `).join('')}
    </select>
    <input type="number" class="t-pers-horas" placeholder="Horas trab." min="0.5" step="0.5" value="${horasValor}" required>
    <button type="button" class="btn-quitar-fila" onclick="this.parentElement.remove()" title="Quitar">✕</button>
  `; 
    contenedor.appendChild(div);
}

function agregarFilaMaterialEdit(idMaterialSeleccionado = null, cantidadValor = ''){
    if (arregloMateriales.length === 0){
        mostrarToast('No hay materiales registrados en el sistema.', 'error');
        return;
    }

    const contenedor = document.getElementById('edit-tarea-materiales-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

    div.innerHTML = `
    <select class="t-mat-select" required>
      ${arregloMateriales.map(m => `
        <option value="${m.id}" ${idMaterialSeleccionado === m.id ? 'selected' : ''}>
          ${m.nombre} ($${m.precioUnitario.toFixed(2)} / ${m.unidad})
        </option>
      `).join('')}
    </select>
    <input type="number" class="t-mat-cant" placeholder="Cantidad" min="0.1" step="0.1" value="${cantidadValor}" required>
    <button type="button" class="btn-quitar-fila" onclick="this.parentElement.remove()" title="Quitar">✕</button>
  `;
    contenedor.appendChild(div);
}

function agregarFilaOtroEdit(idOtroSeleccionado = null, cantidadValor = ''){
    if (arregloOtrosCostos.length === 0){
        mostrarToast('No hay otros costos registrados en el sistema.', 'error');
        return;
    }

    const contenedor = document.getElementById('edit-tarea-otros-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

    div.innerHTML = `
    <select class="t-otro-select" required>
      ${arregloOtrosCostos.map(o => `
        <option value="${o.id}" ${idOtroSeleccionado === o.id ? 'selected' : ''}>
          ${o.nombre} ($${o.costoUnitario.toFixed(2)})
        </option>
      `).join('')}
    </select>
    <input type="number" class="t-otro-cant" placeholder="Cant. / Servicios" min="1" step="1" value="${cantidadValor}" required>
    <button type="button" class="btn-quitar-fila" onclick="this.parentElement.remove()" title="Quitar">✕</button>
  `;
    contenedor.appendChild(div);
}

function guardarEdicionTarea(){
    const id = parseInt(document.getElementById('edit-tarea-id').value);
    const tarea = arregloTareas.find(t => t.id === id);
    if (!tarea) return;

    if (tarea.estado !== 'pendiente'){
        mostrarToast('Solo se pueden editar tareas en estado Pendiente.', 'error');
        cerrarModalEditarTarea();
        return;
    }

    const nombre = document.getElementById('edit-tarea-nombre').value.trim();
    const fecha = document.getElementById('edit-tarea-fecha').value;

    if (!nombre || !fecha){
        mostrarToast('El nombre de la tarea y la fecha son obligatorios.', 'error');
        return;
    }

    const filasPers = document.querySelectorAll('#edit-tarea-personal-contenedor .fila-dinamica');
    if (filasPers.length === 0) {
        mostrarToast('Debe asignar al menos un trabajador a la tarea (campo obligatorio).', 'error');
        return;
    }

    const personalAsignado = [];
    const idsPersVistos = new Set(); // Item 1: Control de duplicados

    for (let fila of filasPers){
        const idPersonal = parseInt(fila.querySelector('.t-pers-select').value);
        const horas = parseFloat(fila.querySelector('.t-pers-horas').value);

        // Item 6: Validación numérica
        if (isNaN(horas) || !isFinite(horas) || horas <= 0){
            mostrarToast('Por favor asigne horas de trabajo válidas (> 0).', 'error');
            return;
        }

        // Item 1: Validación duplicados
        if (idsPersVistos.has(idPersonal)){
            const persObj = arregloPersonal.find(p => p.id === idPersonal);
            const nombrePers = persObj ? persObj.nombre : `ID #${idPersonal}`;
            mostrarToast(`No puede asignar al trabajador "${nombrePers}" más de una vez en la misma tarea.`, 'error');
            return;
        }
        idsPersVistos.add(idPersonal);

        const persObj = arregloPersonal.find(p => p.id === idPersonal);
        personalAsignado.push({
            idPersonal,
            nombre: persObj ? persObj.nombre : `Trabajador #${idPersonal}`,
            rol: persObj ? persObj.rol : '',
            costoHora: persObj ? persObj.costoHora : 0,
            horas
        });
    }

    const filasMat = document.querySelectorAll('#edit-tarea-materiales-contenedor .fila-dinamica');
    if (filasMat.length === 0) {
        mostrarToast('Debe asignar al menos un material a la tarea (campo obligatorio).', 'error');
        return;
    }

    const materialesAsignados = [];
    const idsMatVistos = new Set(); // Item 1: Control de duplicados

    for (let fila of filasMat){
        const idMaterial = parseInt(fila.querySelector('.t-mat-select').value);
        const cantidad = parseFloat(fila.querySelector('.t-mat-cant').value);

        // Item 6: Validación numérica
        if (isNaN(cantidad) || !isFinite(cantidad) || cantidad <= 0) { 
            mostrarToast('Por favor ingrese una cantidad de material válida (> 0).', 'error'); 
            return; 
        }

        // Item 1: Validación duplicados
        if (idsMatVistos.has(idMaterial)){
            const matObj = arregloMateriales.find(m => m.id === idMaterial);
            const nombreMat = matObj ? matObj.nombre : `ID #${idMaterial}`;
            mostrarToast(`No puede asignar el material "${nombreMat}" más de una vez en la misma tarea.`, 'error');
            return;
        }
        idsMatVistos.add(idMaterial);

        const matObj = arregloMateriales.find(m => m.id === idMaterial);
        materialesAsignados.push({
            idMaterial,
            nombre: matObj ? matObj.nombre : `Material #${idMaterial}`,
            unidad: matObj ? matObj.unidad : '',
            precioUnitario: matObj ? matObj.precioUnitario : 0,
            cantidad
        });
    }

    // Otros costos es OPCIONAL
    const otrosAsignados = [];
    const idsOtroVistos = new Set(); // Item 1: Control de duplicados
    const filasOtros = document.querySelectorAll('#edit-tarea-otros-contenedor .fila-dinamica');

    for (let fila of filasOtros){
        const idOtro = parseInt(fila.querySelector('.t-otro-select').value);
        const cantidad = parseFloat(fila.querySelector('.t-otro-cant').value);

        // Item 6: Validación numérica
        if (isNaN(cantidad) || !isFinite(cantidad) || cantidad <= 0) { 
            mostrarToast('Por favor ingrese una cantidad de servicio o gasto válida (> 0).', 'error');
            return;
        }

        // Item 1: Validación duplicados
        if (idsOtroVistos.has(idOtro)){
            const otroObj = arregloOtrosCostos.find(o => o.id === idOtro);
            const nombreOtro = otroObj ? otroObj.nombre : `ID #${idOtro}`;
            mostrarToast(`No puede asignar el gasto "${nombreOtro}" más de una vez en la misma tarea.`, 'error');
            return;
        }
        idsOtroVistos.add(idOtro);

        const otroObj = arregloOtrosCostos.find(o => o.id === idOtro);
        otrosAsignados.push({
            idOtro,
            nombre: otroObj ? otroObj.nombre : `Gasto #${idOtro}`,
            costoUnitario: otroObj ? otroObj.costoUnitario : 0,
            cantidad
        });
    }

    // Actualizar tarea
    tarea.nombre = nombre;
    tarea.fecha = fecha;
    tarea.personalAsignado = personalAsignado;
    tarea.materialesAsignados = materialesAsignados;
    tarea.otrosAsignados = otrosAsignados;

    cerrarModalEditarTarea();
    renderTablaTareas();
    actualizarDashboard();
    mostrarToast(`Tarea "${nombre}" actualizada exitosamente.`, 'success');
}

function renderTablaTareas(){
    const tbody = document.getElementById('tabla-tareas-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (arregloTareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-dim);">No hay tareas registradas aún.</td></tr>`;
        return;
    }

    arregloTareas.forEach(t =>{
        const costos = calcularCostosTarea(t);
        const estado = t.estado || (t.concluida ? 'finalizado' : 'pendiente');
        t.estado = estado; // sincronizar
        
        const estadoSlug = estado.replace(/\s+/g, '-');
        const puedeEditar = (estado === 'pendiente');
        const puedeEliminar = (estado !== 'en proceso');
        const esFinalizada = (estado === 'finalizado'); // Item 5: Tarea cerrada

        const fila = document.createElement('tr');
        fila.innerHTML = `
      <td><strong>#${t.id}</strong></td>
      <td>
        <strong>${t.nombre}</strong>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
          ${t.personalAsignado.length} pers. | ${t.materialesAsignados.length} mat. | ${t.otrosAsignados.length} otros
        </div>
      </td>
      <td>${formatearFecha(t.fecha)}</td>
      <td><strong>$${costos.total.toFixed(2)}</strong></td>
      <td>
        <select class="select-estado select-estado-${estadoSlug}" onchange="cambiarEstadoTarea(${t.id}, this.value)" ${esFinalizada ? 'disabled style="opacity:0.85; cursor:not-allowed;" title="Tarea cerrada / Finalizada"' : 'title="Cambiar estado"'}>
          <option value="pendiente" ${estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="en proceso" ${estado === 'en proceso' ? 'selected' : ''}>En Proceso</option>
          <option value="finalizado" ${estado === 'finalizado' ? 'selected' : ''}>Finalizado</option>
        </select>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="abrirModalEditarTarea(${t.id})" ${!puedeEditar ? 'disabled style="opacity:0.4; cursor:not-allowed;" title="Solo editable en estado Pendiente"' : 'title="Editar tarea"'}>
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${t.id})" ${!puedeEliminar ? 'disabled style="opacity:0.4; cursor:not-allowed;" title="No se puede eliminar una tarea en proceso"' : 'title="Eliminar tarea"'}>
            ✕
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(fila);       
    });
}

function formatearFecha(fechaStr){
    if (!fechaStr) return '-';
    const partes = fechaStr.split('-');
    if (partes.length === 3){
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return fechaStr;
}

function actualizarDashboard(){
    const totalTareas = arregloTareas.length;
    const tareasFinalizadas = arregloTareas.filter(t => (t.estado === 'finalizado' || t.concluida)).length;

    let porcentaje = 0;
    if (totalTareas > 0){
        porcentaje = Math.round((tareasFinalizadas / totalTareas) * 100);
    }

    if (isNaN(porcentaje)){
        porcentaje = 0;
    }

    const dashAvance = document.getElementById('dash-avance');
    const dashBarra = document.getElementById('dash-barra');
    const dashResumen = document.getElementById('dash-tareas-resumen');

    if (dashAvance) dashAvance.innerText = `${porcentaje}%`;
    if (dashBarra) dashBarra.style.width = `${porcentaje}%`;
    if (dashResumen) dashResumen.innerText = `${tareasFinalizadas} de ${totalTareas} actividades concluidas`;
    
    let persPlan = 0, persReal = 0; 
    let matPlan = 0, matReal = 0; 
    let otrosPlan = 0, otrosReal = 0;

    arregloTareas.forEach(t => {
        const c = calcularCostosTarea(t);
        persPlan += c.personal; 
        matPlan += c.materiales;
        otrosPlan += c.otros;

        if (t.estado === 'finalizado' || t.concluida) {
            persReal += c.personal;
            matReal += c.materiales;
            otrosReal += c.otros;
        }
    });

    const totalPlan = persPlan + matPlan + otrosPlan;
    const totalReal = persReal + matReal + otrosReal;

    const dashCostos = document.getElementById('dash-costos');
    if (dashCostos) {
        dashCostos.innerText =  `$${totalPlan.toFixed(2)} / $${totalReal.toFixed(2)}`;
    }
    const dashCostoPlan = document.getElementById('dash-costo-plan');
    if (dashCostoPlan) dashCostoPlan.innerText = `$${totalPlan.toFixed(2)}`;
    const dashCostoReal = document.getElementById('dash-costo-real');
    if (dashCostoReal) dashCostoReal.innerText = `$${totalReal.toFixed(2)}`;

    const dashPers = document.getElementById('dash-pers-costo');
    if (dashPers) dashPers.innerText = `$${persPlan.toFixed(2)} / $${persReal.toFixed(2)}`;

    const dashMat = document.getElementById('dash-mat-costo');
    if (dashMat) dashMat.innerText = `$${matPlan.toFixed(2)} / $${matReal.toFixed(2)}`;

    const dashOtros = document.getElementById('dash-otros-costo');
    if (dashOtros) dashOtros.innerText = `$${otrosPlan.toFixed(2)} / $${otrosReal.toFixed(2)}`;

    actualizarAlertasSobrecarga();
}

function actualizarAlertasSobrecarga(){
    const contenedor = document.getElementById('contenedor-sobrecarga');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const mapaHoras = {};

    // Item 4: Evaluar sobrecarga laboral únicamente en tareas activas (Pendientes y En Proceso)
    const tareasActivas = arregloTareas.filter(t => t.estado !== 'finalizado');

    tareasActivas.forEach(t => {
        t.personalAsignado.forEach(pa => {
            const clave = `${pa.idPersonal}_${t.fecha}`;
            if (!mapaHoras[clave]) {
                mapaHoras[clave] = {
                    idPersonal: pa.idPersonal,
                    fecha: t.fecha,
                    totalHoras: 0,
                    tareas: []
                };
            }
            mapaHoras[clave].totalHoras += pa.horas;
            mapaHoras[clave].tareas.push({ nombre: t.nombre, horas: pa.horas});
        });
    });
    const sobrecargas = Object.values(mapaHoras).filter(item => item.totalHoras > 8);

    if(sobrecargas.length === 0) {
        contenedor.innerHTML = `
      <p class="mensaje-vacio">
        No hay alertas de sobrecarga laboral en tareas activas. Todos los trabajadores tienen una jornada asignada &le; 8h/día.
      </p>
    `;
    return;
    }

    sobrecargas.forEach(item => {
        const persona = arregloPersonal.find(p => p.id === item.idPersonal);
        const nombrePersona = persona ? persona.nombre : `Trabajador #${item.idPersonal}`; 
        const rolPersona = persona ? persona.rol : 'Sin rol';
        const exceso = item.totalHoras - 8;

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta tarjeta-sobrecarga';
        tarjeta.innerHTML = `
      <div class="alerta-header">
        <span class="badge-peligro">ALERTA DE SOBRECARGA ACTIVA</span>
        <span style="font-size:0.8rem; color:var(--text-muted);">${formatearFecha(item.fecha)}</span>
      </div>
      <div class="valor-metrica color-peligro" style="font-size:1.4rem;">
        ${nombrePersona}
      </div>
      <div class="subtexto" style="margin-bottom:0.6rem;">
        Cargo: <strong>${rolPersona}</strong>
      </div>
      <div style="background:rgba(15,23,42,0.6); padding:0.6rem; border-radius:8px; font-size:0.85rem;">
        <div>Jornada Planificada: <strong class="color-peligro" style="font-size:1.05rem;">${item.totalHoras} hrs/día</strong></div>
        <div style="color:var(--warning); font-size:0.78rem; margin-top:2px;">Exceso: +${exceso.toFixed(1)} hrs sobre el límite legal (8 hrs).</div>
      </div>
      <div style="margin-top:0.6rem; font-size:0.75rem; color:var(--text-dim);">
        Tareas activas involucradas: ${item.tareas.map(t => `${t.nombre} (${t.horas}h)`).join(', ')}
      </div>
    `;
    contenedor.appendChild(tarjeta);
    });
}

function mostrarToast(mensaje, tipo = 'info') { 
    let toastCont = document.getElementById('toast-container'); 
    if (!toastCont) { 
        toastCont = document.createElement('div'); 
        toastCont.id = 'toast-container'; 
        document.body.appendChild(toastCont);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `
    <span>${mensaje}</span>
    <span style="cursor:pointer; font-size:1.1rem; margin-left:0.5rem;" onclick="this.parentElement.remove()">✕</span>
  `;

    toastCont.appendChild(toast);

    setTimeout(() =>{
        toast.classList.add('toast-salida');
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}