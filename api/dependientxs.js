export default async function handler(req,res){
  try{
    const key = process.env.GOOGLE_SHEETS_API_KEY;
    const id  = process.env.GOOGLE_SHEETS_ID;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/dependientxs!A2:D200?key=${key}`;
    const r = await fetch(url);
    const d = await r.json();

    res.status(200).json({
      dependientes: (d.values||[]).map(v=>v[0]).filter(Boolean),
      sucursales: [...new Set((d.values||[]).map(v=>v[1]).filter(Boolean))]
    });
  }catch(e){
    res.status(500).json({error:'Sheets error'});
  }
}
