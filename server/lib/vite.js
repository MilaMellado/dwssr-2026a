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
}
