# Nuestros Lugares 💕

App simple para registrar lugares a los que quieren ir (o ya fueron) en citas, con reviews compartidas.

## Estructura del proyecto (organizada por responsabilidad)

```
dates-app/
├── index.html                # UI principal
├── css/style.css             # Estilos
├── js/
│   ├── firebase-config.js    # Conexión a Firebase (pega tu config aquí)
│   ├── dataService.js        # CRUD en Firestore + caché local automática
│   ├── uiService.js          # Renderizado de tarjetas en pantalla
│   ├── backupService.js      # Exportar/Importar respaldo en JSON
│   └── app.js                # Orquesta todo (eventos del DOM)
└── firestore.rules           # Reglas de seguridad de la base de datos
```

## 1. Configurar Firebase

1. Ve a `js/firebase-config.js`
2. Reemplaza el objeto `firebaseConfig` con el que copiaste de la consola de Firebase
   (Configuración del proyecto → Tus apps → config web)

## 2. Reglas de seguridad

Después de los primeros 30 días (cuando expira el "modo de prueba"):

1. Ve a Firebase Console → Firestore Database → pestaña "Reglas"
2. Pega el contenido de `firestore.rules`
3. Publica

## 3. Probar localmente

Como usa módulos de JS (`type="module"`), no puedes abrir el `index.html` directo con doble clic
(el navegador bloquea los módulos con `file://`). Necesitas un servidor local simple:

```bash
# Si tienes Python instalado:
cd dates-app
python3 -m http.server 8000
# Abre http://localhost:8000
```

O con la extensión "Live Server" de VS Code.

## 4. Subir a GitHub

```bash
cd dates-app
git init
git add .
git commit -m "Primera versión de la app"
```

Crea un repo en GitHub (puede ser privado) y súbelo:

```bash
git remote add origin https://github.com/TU_USUARIO/dates-app.git
git branch -M main
git push -u origin main
```

## 5. Deploy en Netlify

1. Entra a https://app.netlify.com/
2. "Add new site" → "Import an existing project"
3. Conecta tu cuenta de GitHub y selecciona el repo `dates-app`
4. Build command: (dejar vacío, no hay build)
5. Publish directory: `.` (raíz)
6. Deploy

Cada vez que hagas `git push`, Netlify actualiza el sitio automáticamente.

## Respaldos

- **Automático (silencioso):** cada vez que carga la app, guarda una copia en el
  `localStorage` del navegador (por si Firebase falla momentáneamente).
- **Manual:** el botón "Descargar respaldo (JSON)" en la app descarga todos los
  lugares a un archivo. Recomendado hacerlo cada tanto (ej. 1 vez al mes) y
  guardarlo en Drive/Dropbox.
- **Importar:** si algo se borra sin querer, usa "Importar respaldo" con el
  archivo `.json` guardado.

## Ideas para después

- Agregar rating con estrellas (1-5)
- Filtro por tipo de lugar (comida, actividad, etc.)
- Subir fotos (usando Firebase Storage)
- Notificación cuando el otro agrega un lugar nuevo
