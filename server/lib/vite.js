import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename );

/**
 * Helper para handlerbars que genera las etiquetas de  Vite
 * En desarrollo: Conecta al servidor de Vite
 * En produccion: Usa los archivos compilados del manifiesto
 */
export function viteAssets() {
    const isDev = process.env.VITE_DEV_SERVER !== 'production'
    const viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173'

    if (isDev) {
        // En desarrollo, cargamos el codigo para el front-end 
        //directamente desde el servidor de Vite
        // /@vite/client da acceso a un servidor HMR (Hot Module Replacement) para recargar el navegador automáticamente cuando se hacen cambios en el código fuente
        // /main.js es el punto de entrada de la aplicación front-end
        return `
            <script type="module" src="${viteDevServer}/@vite/client"></script>
            <script type="module" src="${viteDevServer}/main.js"></script>
        `;
    }

    // En producción, leemos el manifiesto generado por Vite para incluir los archivos compilados
    const manifestPath = path.join(__dirname, '..','..','dist','.vite','manifest.json');

    // Verificamos que el manifiesto exista
    if(!fs.existsSync(manifestPath)) {
        console.warn('Vite manifest not found. Run "npm run build" first.');
        return '';
    }

    // Parseamos el manifiesto para obtener los archivos compilados
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')
);

// Obtener el punto de entrada de los scripts del front-end
const mainEntry = manifest['main.js'];

// Verificando la correcta carga del mainEntry
if(!mainEntry) {
    console.warn('main.js entry not found in Vite manifest.');
    return '';
}

    // Creando la variable que contendra la etiqueta de los scripts del front-end
    let tags = '';

    // CSS files
    if(mainEntry.css){
        mainEntry.css.forEach(cssFile => {
            tags += `<script type="stylesheet" src="/${cssFile}"></script>`
        })
    }

    // JS Files
    tags += `<script type="module" src="/${mainEntry.file}"></script>`
    return tags;
}

// Registrae el HELPER
export function registerViteHelper(hbs) {
    hbs.registerHelper(
        'viteAssets', 
        () => new hbs.SafeString(viteAssets())
    )
}