// importando biblioteca winston
import winston, { format } from "winston";
import path from "node:path";
import fs from "node:fs";
//importando biblioteca de transporte
import DailyRotateFile from "winston-daily-rotate-file";

// desestructurando funciones de format
const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

// creando los directorios raiz
const __rootdir = path.resolve(process.cwd());

// creando la ruta del directorio de logs en
// la raiz del proyecto
const logsDir = path.join(__rootdir, "logs");

// rutina que crea la carpeta donde iran los logs solo
// en caso de no existir
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// definiendo esquema de colores
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Agregando esquema de colores a winston
winston.addColors(colors);

//creamos los formatos de salida para los diferentes transporetes
const myConsoleFormat = combine(
  //agregando colores a este formato
  colorize({ all: true }),
  //agregar una etiqueta log
  label({ label: "📢" }),
  //agrego formato de fecha
  timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  //agrego formato de impresión
  printf(
    (info) => `${info.level}: ${info.label} ${info.timestamp} ${info.message}`,
  ),
);

// formato para los archivos
const myFileFormat = combine(
  //quitando colorizacion
  format.uncolorize(),
  //agregamos fecha en formato ISO
  timestamp(),
  //salida en formato JSON
  format.json(),
);

// Creando el objeto de opciones para cada transporte
const options = {
  errorFile: {
    level: "error",
    filename: path.join(__rootdir, "logs", "error.log"),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readableFile: {
    filename: path.join(logsDir, "app-readable.log"),
    level: "info",
    format: combine(
      format.uncolorize(),
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      prettyPrint(),
    ),
    maxsize: 5242880,
    maxFiles: 5,
  },
  dailyRotateFile: {
    filename: path.join(logsDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
    format: myFileFormat,
  },
};

// creando una instancia del logger
/*
Usaremos un transport diario (DailyRotateFile) para el log principal,
esto facilita la retencion por fecha y la compresion de archivos

Para los demas logs mantenemos archivos separados 
*/

const logger = winston.createLogger({
  transports: [
    //log principal con rotacion por fecha
    new DailyRotateFile(options.dailyRotateFile),
    //archivo legible para humanos
    new winston.transports.File(options.readableFile),
    // log de errores en un archivo por separado
    new winston.transports.File(options.errorFile),
    // log para consola de desarrollo (colores y formatos)
    new winston.transports.Console(options.console),
  ],
  //Captura de excepciones
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
    }),
  ],
  exitOnError: false,
});

//Finalmenteexportamos el logger
export default logger;
