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

            if(!nombre || !rol || isNaN(costoHora) || costoHora <= 0){
                mostrarToast('Por favor ingrese valores validos para el personal', 'error');
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
            mostrarToast(`Personal "${nombre}" registrado con exito.`, 'success');
        });
    }

    const formMateriales = document.getElementById('form-materiales');
    if (formMateriales){
        formMateriales.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('mater-nombre').value.trim();
            const unidad = document.getElementById('mater-unidad').value.trim();
            const precioUnitario = parseFloat(document.getElementById('mater-costo').value);
            if (!nombre || !unidad || isNaN(precioUnitario) || precioUnitario <= 0){
                mostrarToast('Por favor ingrese valores validos para el material','error');
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
            mostrarToast(`Material "${nombre}" registrado con exito.`, 'success');
        });
    }

    const formOtros = document.getElementById('form-otros');
    if (formOtros){
        formOtros.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('otro-nombre').value.trim();
            const costoUnitario = parseFloat(document.getElementById('otro-costo').value);
            if(!nombre || isNaN(costoUnitario) || costoUnitario <= 0){
                mostrarToast('Por favor ingrese valores validos para el costo','error');
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
            mostrarToast(`Gasto "${nombre}" registrado con exito.`, 'success');
        });
    }

    const formTareas = document.getElementById('form-tareas');
    if (formTareas){
        formTareas.addEventListener('submit', (e) =>{
            e.preventDefault();
            crearTarea();
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

    const asignado = arregloTareas.some(tarea => tarea.personalAsignado.some(pa => pa.idPersonal === id));

    if (asignado) {
        mostrarToast(`No se puede eliminar a "${persona.nombre}" porque esta o estuvo asignado a una o mas tareas.`, 'error');
        return;
    }

    arregloPersonal = arregloPersonal.filter(p => p.id !== id);
    renderTablaPersonal();
    actualizarDashboard();
    mostrarToast(`Personal "${persona.nombre}" eliminado.`, 'success');
}

function renderTablaMateriales(){
    const tbody = document.getElementById('tabla-material-body')
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

    const asignado = arregloTareas.some(tarea =>
        tarea.materialesAsignados.some(ma => ma.idMaterial === id)
    );

    if(asignado){
        mostrarToast(`No se puede eliminar "${mat.nombre}" porque esta o estuvo asignado a una o mas tareas.`, 'error');
        return;
    }

    arregloMateriales = arregloMateriales.filter(m => m.id !== id);
    renderTablaMateriales();
    actualizarDashboard();
    mostrarToast();
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

    const asignado = arregloTareas.some(tarea => tarea.otrosAsignados.some(oa => oa.idOtro === id));

    if(asignado){
        mostrarToast(`No se puede eliminar "${otro.nombre}" porque esta o estuvo asignado a una o mas tareas.`, 'error');
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
    div.className = 'fila-dinamica'

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
        mostrarToast('Primero debe registrar al menos un material en la seccion Materiales', 'error');
        return;
    }

    const contenedor = document.getElementById('tarea-materiales-contenedor');
    const div = document.createElement('div');
    div.className = 'fila-dinamica';

    div.innerHTML =   div.innerHTML = `
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
        mostrarToast('Primero debe registrar al menos un gasto en la seccion Otros Costos', 'error');
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
        mostrarToast('EL nombre de la tarea y la fecha son obligatorios','error');
        return;
    }
    const personalAsignado = [];
    const filasPers = document.querySelectorAll('#tarea-personal-contenedor .fila-dinamica');
    for (let fila of filasPers){
        const idPersonal = parseInt(fila.querySelector('.t-pers-select').value);
        const horas = parseInt(fila.querySelector('.t-pers-horas').value);
        if (isNaN(horas) || horas <= 0){
            mostrarToast('Por favor asigne horas de trabajo validas','error');
            return;
        }
        personalAsignado.push({ idPersonal, horas});
    }

    const materialesAsignados = [];
    const filasMat = document.querySelectorAll('#tarea-materiales-contenedor .fila-dinamica');
    for (let fila of filasMat){
        const idMaterial = parseInt(fila.querySelector('.t-mat-select').value);
        const cantidad = parseFloat(fila.querySelector('.t-mat-cant').value);
         if (isNaN(cantidad) || cantidad <= 0) { 
            mostrarToast('Por favor ingrese una cantidad de material valida (> 0).', 'error'); 
            return; 
        } 
        materialesAsignados.push({ idMaterial, cantidad});
    }

    const otrosAsignados = [];
    const filasOtros = document.querySelectorAll('#tarea-otros-contenedor .fila-dinamica');
    for (let fila of filasOtros){
        const idOtro = parseInt(fila.querySelector('.t-otro-cant').value);
        const cantidad = parseFloat(fila.querySelector('.t-otro-cant').value);
        if (isNaN(cantidad) || cantidad <= 0) { 
            mostrarToast('Por favor ingrese una cantidad de servicio o gasto valida', 'error');
            return;
        }
        otrosAsignados.push({ idOtro, cantidad });
    }
    
    const nuevaTarea = {
        id: idTareasSeq++,
        nombre,
        fecha,
        personalAsignado,
        materialesAsignados,
        otrosAsignados,
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
    let costoPersonal = tarea.personalAsignado.reduce((acc,p) =>{
        const pers = arregloPersonal.find(x => x.id === p.idPersonal);
        return acc + (pers ? pers.costoHora * p.horas : 0);
    }, 0);

    let costoMateriales = tarea.materialesAsignados.reduce((acc,m) => {
        const mat = arregloMateriales.find(x => x.id === m.idMaterial);
        return acc + (mat ? mat.precioUnitario * m.cantidad : 0);
    }, 0);

    let costoOtros = tarea.otrosAsignados.reduce((acc,o) => {
        const otro = arregloOtrosCostos.find(x => x.id === o.idOtro);
        return acc + (otro ? otro.costoUnitario * o.cantidad : 0);
    }, 0);

    return {
        personal: costoPersonal,
        materiales: costoMateriales,
        otros: costoOtros,
        total: costoPersonal + costoMateriales + costoOtros
    };
}

function alternarEstadoTarea(id){
    const tarea = arregloTareas.find(t => t.id === id);
    if (!tarea) return;

    tarea.concluida = !tarea.concluida;
    renderTablaTareas();
    actualizarDashboard();

    if (tarea.concluida){
        mostrarToast(`Tarea "${tarea.nombre}" marcada como CONCLUIDA. Se suma al Costo Real.`, 'success');
    } else {
        mostrarToast(`Tarea "${tarea.nombre}" marcada como PENDIENTE.`, 'info');
    }
}

function eliminarTarea(id){
    const tarea = arregloTareas.find(t => t.id === id);
    if (!tarea) return;

    const tieneAsignaciones = tarea.personalAsignado.length > 0 || tarea.materialesAsignados.length > 0 || tarea.otrosAsignados > 0 || tarea.concluida;

    if (tieneAsignaciones){
        mostrarToast('No se puede eliminar esta tarea: tiene elementos asignados o ya fue concluida (regla de integridad)', 'error');
        return;
    }

    arregloTareas = arregloTareas.filter(t => t.id !== id);
    renderTablaTareas();
    actualizarDashboard();
    mostrarToast(`Tarea "${tarea.nombre}" eliminada.`, 'success');
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
        const badgeClase = t.concluida ? 'badge-concluida' : 'badge-pendiente';
        const badgeTexto = t.concluida ? 'Concluida' : 'Pendiente';
        const botonTexto = t.concluida ? 'Marcar Pendiente' : 'Marcar Concluida';
        const botonClase = t.concluida ? 'btn-secondary' : 'btn-success';
        
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
        <span class="badge ${badgeClase}">
          ${badgeTexto}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
          <button class="btn ${botonClase} btn-sm" onclick="alternarEstadoTarea(${t.id})">
            ${botonTexto}
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${t.id})" title="Eliminar">
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
    const tareasConcluidas = arregloTareas.filter(t => t.concluida).length;

    let porcentaje = 0;
    if (totalTareas > 0){
        porcentaje = Math.round((tareasConcluidas / totalTareas) * 100);
    }

    if (isNaN(porcentaje)){
        porcentaje = 0;
    }

    const dashAvance = document.getElementById('dash-avance');
    const dashBarra = document.getElementById('dash-barra');
    const dashResumen = document.getElementById('dash-tareas-resumen');

    if (dashAvance) dashAvance.innerText = `${porcentaje}%`;
    if (dashBarra) dashBarra.style.width = `${porcentaje}%`;
    if (dashResumen) dashResumen.innerText = `${tareasConcluidas} de ${totalTareas} actividades concluidas`;
    
    let persPlan = 0, persReal = 0; 
    let matPlan = 0, matReal = 0; 
    let otrosPlan = 0, otrosReal = 0;

    arregloTareas.forEach(t => {
        const c = calcularCostosTarea(t);
        persPlan += c.personal; 
        matPlan += c.materiales;
        otrosPlan += c.otros;

        if (t.concluida) {
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

    arregloTareas.forEach(t => {
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
        No hay alertas de sobrecarga laboral. Todos los trabajadores tienen una jornada asignada &le; 8h/día.
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
        <span class="badge-peligro">ALERTA DE SOBRECARGA</span>
        <span style="font-size:0.8rem; color:var(--text-muted);">${formatearFecha(item.fecha)}</span>
      </div>
      <div class="valor-metrica color-peligro" style="font-size:1.4rem;">
        ${nombrePersona}
      </div>
      <div class="subtexto" style="margin-bottom:0.6rem;">
        Cargo: <strong>${rolPersona}</strong>
      </div>
      <div style="background:rgba(15,23,42,0.6); padding:0.6rem; border-radius:8px; font-size:0.85rem;">
        <div>Jornada Asignada: <strong class="color-peligro" style="font-size:1.05rem;">${item.totalHoras} hrs/día</strong></div>
        <div style="color:var(--warning); font-size:0.78rem; margin-top:2px;">Exceso: +${exceso.toFixed(1)} hrs sobre el límite legal (8 hrs).</div>
      </div>
      <div style="margin-top:0.6rem; font-size:0.75rem; color:var(--text-dim);">
        Tareas involucradas: ${item.tareas.map(t => `${t.nombre} (${t.horas}h)`).join(', ')}
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