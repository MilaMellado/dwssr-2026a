//var express = require('express');
import express from "express";
const router = express.Router();
//Import logger
import logger from "../lib/winston.js";

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get("/", function (req, res, next) {
  res.render("index", { title: "Proyecto Asombroso ✨" });
});

//Rutas para pruebas de logs
router.get("/test-logs", (req, res) => {
  //Generar logs
  logger.error("Esto es una prueba del log tipo Error");
  logger.warn("Esto es una prueba del log tipo Warn");
  logger.info("Esto es una prueba del log tipo Info");
  logger.http("Esto es una prueba del log tipo http");
  logger.debug("Esto es una prueba del log tipo Debug");

  //Estructurando respuesta
  res.json({
    message: "Se crearon logs de prueba",
    archivos: [
      "logs/app/YYYY-MM-DD.log",
      "logs/app-readble.log",
      "logs/error.log",
    ],
  });
});

//Rutas para prueba de exception y rejections
if (process.env.NODE.ENV === "production") {
  //Habilitando ruta para probar exceptionHandlers
  //Acceso: GET /test-exception
  router.get("/test-exception", (req, res) => {
    res.json({
      message: "Exception lanzada, revisa los logs/exceptions.log",
    });
    //Lanzando exception
    setTimeout(() => {
      throw new Error("Excepcionn de prueba no capturada");
    }, 300);
  });

  //Ruta para rejections
  //Acceso: GET /test-rejection
  router.get("/test-rejection", (req, res) => {
    res.json({
      message: "Promesa rechazada, revisa los logs/rejections.log",
    });
    //Generando Rejection
    Promise.reject(new Error("Promesa rechazada sin catch"));
  });
}

//module.exports = router;
export default router;
