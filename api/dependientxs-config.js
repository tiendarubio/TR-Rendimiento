export default async function handler(req, res) {
  try {
    const apiKey  = process.env.GOOGLE_SHEETS_API_KEY;
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    if (!apiKey || !sheetId) {
      res.status(500).json({ error: 'Faltan variables de entorno (GOOGLE_SHEETS_API_KEY / GOOGLE_SHEETS_ID)' });
      return;
    }

    const fetchRange = async (range) => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Sheets error (${range}): ${resp.status} ${text}`);
      }
      const data = await resp.json();
      return Array.isArray(data.values) ? data.values : [];
    };

    const [rowsDep, rowsSuc, rowsMetasSuc, rowsMetaPers] = await Promise.all([
      fetchRange('dependientxs!A2:A200'),
      fetchRange('dependientxs!B2:B200'),
      fetchRange('dependientxs!C2:C4'),
      fetchRange('dependientxs!D2:D2')
    ]);

    const dependientes = (rowsDep || [])
      .map(r => (r[0] || '').toString().trim())
      .filter(v => v.length > 0);

    const sucursalesList = (rowsSuc || [])
      .map(r => (r[0] || '').toString().trim())
      .filter(v => v.length > 0);
    const sucursales = Array.from(new Set(sucursalesList));

    const metasSucursal = {
      'Avenida Morazán': parseFloat(rowsMetasSuc?.[0]?.[0] || '0') || 0,
      'Sexta Calle':     parseFloat(rowsMetasSuc?.[1]?.[0] || '0') || 0,
      'Centro Comercial':parseFloat(rowsMetasSuc?.[2]?.[0] || '0') || 0
    };

    const metaPersonal = parseFloat(rowsMetaPers?.[0]?.[0] || '0') || 0;

    res.status(200).json({ dependientes, sucursales, metasSucursal, metaPersonal });
  } catch (err) {
    console.error('dependientxs-config error', err);
    res.status(500).json({ error: 'Error interno en /api/dependientxs-config', details: String(err) });
  }
}
