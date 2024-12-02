// Define as rotas para conectar com as funções dos controladores

import { Router } from "express"

// Importa as funções dos controladores
import { getKartTracks } from "../controllers/kartTrackController.js"

// Router cria um conjunto de rotas. Essa instância será usada para registrar as rotas associadas aos controladores acima
const kartTrackRoutes = Router()

// Definições das rotas para os caminhos específicos, os dados enviados no corpo da requisição (JSON) serão processados pelo controlador
kartTrackRoutes.get("/kartTracks/:name", getKartTracks)

// Exporta para ser usado no app.js
export default kartTrackRoutes