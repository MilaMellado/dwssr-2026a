import createError from "http-errors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
//importando Winston Logger
import logger from "./lib/winston.js";
import hbs from "hbs";

// Importar las rutas
import indexRouter from "#routes/index.js";
import usersRouter from "#routes/users.js";
import authorRouter from "#routes/author.js";

// Importando el registrador de Helpers
import { registerViteHelper } from "./lib/vite.js";

// recreando variables de path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

logger.info("Creando la instancia de express.js");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Registrando el Helper para el ENGINE
registerViteHelper(hbs);

logger.info("Configurando el middleware de morgan");
//Redirigiendo el flujo de logs de morgan a winston
// morgan -> [logs] -> winston -> transportes [consola, archivos]
app.use(
  morgan("dev", {
    stream: {
      write: (msg) => logger.http(msg.trim()),
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estaticos de Vite
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "dist")));
}

// Archivos estaticos del back-end
app.use(express.static(path.join(__dirname, "../public")));

// Registrando las rutas
app.use(["/", "/index"], indexRouter);
app.use("/users", usersRouter);
app.use("/author", authorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  logger.warn(`Se consulto la ruta no encontrada ${req.originalUrl}`);
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  logger.error(`Error: ${err.status || 500} -> ${err.message} `);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//module.exports = app;
export default app;
