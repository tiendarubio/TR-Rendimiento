# TRLista — Rendimiento por dependientx (Firestore + Vercel)

## Deploy en Vercel
1) Sube este repo a GitHub y crea un proyecto en Vercel.
2) En **Settings → Environment Variables** agrega:

### Google Sheets
- GOOGLE_SHEETS_API_KEY
- GOOGLE_SHEETS_ID

> La hoja `dependientxs` debe tener:
> - A2:A = dependientxs
> - B2:B = sucursales
> - C2:C4 = metas por sucursal (Avenida Morazán, Sexta Calle, Centro Comercial)
> - D2 = meta personal

### Firebase (Firestore)
- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID

## Firestore
Estructura:
- tr_rendimiento/global/historial/{YYYY-MM-DD}  (documento por día con `registros[]`)
- tr_rendimiento/global/config/meta             (corte mensual + snapshot de metas)

Asegura reglas de Firestore según tu necesidad (lectura/escritura).
