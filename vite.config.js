//Importo la funcion de configuracion de Vite
import { defineConfig } from 'vite'

//Importo un resolvedor de rutas 
import { resolve } from 'node:path'

//Exportar una instancia de configuracion 
export default defineConfig({
    //Directorio raiz de los archivos fuente
    root: 'src',
    //Configuracion del servidor de desarrollo de front-end
    server: {
        port: 5173,
        strictPort: true
    },

    //Configuracion del build
    build: {
        //Directorio de salida 
        outdir: '../dist',
        emptyOutDir: true,
        //Generador de manifiesto
        manifest: true,
        rollupOptions: {
            input: {
            main: resolve(__dirname, 'src/main.js')
            }
        },
    },
    //Configuracion para desarrollo 
    publicDir: false,

})
