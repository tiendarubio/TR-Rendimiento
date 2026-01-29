// app.js — Helpers Firestore + config dependientxs (Vercel)

// ---- Formato de fecha/hora local (El Salvador)
function formatSV(iso){
  if(!iso) return 'Aún no guardado.';
  try{
    const dt = new Date(iso);
    return dt.toLocaleString('es-SV',{
      timeZone:'America/El_Salvador',
      year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    });
  }catch(e){
    return 'Aún no guardado.';
  }
}

// ---- Helpers fecha
function hoyISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth()+1).padStart(2,'0');
  const dd   = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

// ====== Firestore paths ======
// tr_rendimiento/global/historial/{YYYY-MM-DD}
function _db(){
  if (typeof firebase === 'undefined' || !firebase.firestore) throw new Error('Firebase/Firestore no disponible');
  return firebase.firestore();
}
function _base(){
  return _db().collection('tr_rendimiento').doc('global');
}
function _hist(){
  return _base().collection('historial');
}
function _metaDoc(){
  return _base().collection('config').doc('meta');
}

async function loadMeta(){
  try{
    const d = await _metaDoc().get();
    return d.exists ? (d.data()||{}) : {};
  }catch(e){
    console.error('loadMeta error', e);
    return {};
  }
}

async function saveMeta(meta){
  const payload = meta || {};
  return _metaDoc().set(payload, { merge:true });
}

async function listHistoryDates(){
  try{
    const snap = await _hist().get();
    return snap.docs.map(d => d.id);
  }catch(e){
    console.error('listHistoryDates error', e);
    return [];
  }
}

async function loadDayDoc(day){
  const d = await _hist().doc(day).get();
  return d.exists ? (d.data()||{}) : null;
}

async function saveDayDoc(day, record){
  return _hist().doc(day).set(record || {}, { merge:true });
}

async function deleteDayDoc(day){
  return _hist().doc(day).delete();
}

async function loadAllDays(){
  // returns [{day, data}]
  try{
    const snap = await _hist().get();
    const out = [];
    snap.docs.forEach(doc => out.push({ day: doc.id, data: doc.data() || {} }));
    return out;
  }catch(e){
    console.error('loadAllDays error', e);
    return [];
  }
}

async function deleteAllHistory(){
  const snap = await _hist().get();
  const deletions = snap.docs.map(d => d.ref.delete());
  await Promise.allSettled(deletions);
}

// ===== Config dependientxs (via Vercel API) =====
function loadDependientxsConfig(){
  return fetch('/api/dependientxs-config')
    .then(r => {
      if(!r.ok) throw new Error('Error /api/dependientxs-config');
      return r.json();
    });
}
