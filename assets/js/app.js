function today(){
  return new Date().toISOString().split('T')[0];
}

function saveDay(payload, dateStr){
  const db = firebase.firestore();
  const day = dateStr || today();
  return db.collection('tr_rendimiento')
    .doc('global')
    .collection('historial')
    .doc(day)
    .set(payload, {merge:true});
}

function loadDay(dateStr){
  const db = firebase.firestore();
  const day = dateStr || today();
  return db.collection('tr_rendimiento')
    .doc('global')
    .collection('historial')
    .doc(day)
    .get()
    .then(d => d.exists ? d.data() : {registros:[]});
}

async function loadConfig(){
  const r = await fetch('/api/dependientxs');
  return r.json();
}
