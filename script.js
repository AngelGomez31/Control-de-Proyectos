let arregloPersonal = [];
let arregloMateriales = [];
let arregloOtrosCostos = [];
let arregloTareas = [];

let idPeronsalSeq = 1;
let idMaterialSeq = 1;
let idOtrosSeq = 1;
let idTareasSeq = 1;

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacion();
    inicializarFormularios();
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
            const nombre = document.getElementById('pers-nombre').ariaValueMax.trim();
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

    const formMateriales = document.getElementBy('form-materiales');
    if(formMateriales){
        formMateriales.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('mater-nombre').value.trim();
            const unidad = document.getElementById('mater-unidad').value.trim();
            const precioUnitario = parseFloat(document.getElementById('mater-nombre').value).trim();
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