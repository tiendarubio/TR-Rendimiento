document.addEventListener('DOMContentLoaded', async ()=>{
const $ = id => document.getElementById(id);
const fechaInput=$('fechaInput'), depSel=$('dependienteSelect'),
 sucSel=$('sucursalSelect'), monto=$('montoInput'),
 tbody=$('tbody'), btn=$('btnAdd'), lastSaved=$('lastSaved');

flatpickr(fechaInput,{dateFormat:'Y-m-d',defaultDate:new Date()});

const cfg = await loadConfig();
cfg.dependientes.forEach(d=>{
  const o=document.createElement('option');o.textContent=d;depSel.appendChild(o);
});
cfg.sucursales.forEach(s=>{
  const o=document.createElement('option');o.textContent=s;sucSel.appendChild(o);
});

let registros=[];

async function refresh(){
  const rec = await loadDay(fechaInput.value);
  registros = rec.registros||[];
  render();
  lastSaved.textContent = rec.meta?.updatedAt
    ? 'Última actualización: '+rec.meta.updatedAt
    : '—';
}

function render(){
  tbody.innerHTML='';
  registros.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.fecha}</td><td>${r.dependiente}</td><td>${r.sucursal}</td><td>$${r.monto.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

btn.addEventListener('click', async ()=>{
  if(!depSel.value||!sucSel.value||!monto.value) return;
  registros.push({
    fecha:fechaInput.value,
    dependiente:depSel.value,
    sucursal:sucSel.value,
    monto:parseFloat(monto.value)
  });
  await saveDay({meta:{updatedAt:new Date().toISOString()},registros}, fechaInput.value);
  monto.value='';
  refresh();
});

fechaInput.addEventListener('change', refresh);
refresh();
});
