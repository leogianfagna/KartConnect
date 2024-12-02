// Define as rotas para conectar com as funções dos controladores

import { Router } from "express"

// Importa as funções dos controladores
import { postClassification, getClassification} from "../controllers/classificationController.js"

// Router cria um conjunto de rotas. Essa instância será usada para registrar as rotas associadas aos controladores acima
const classificationRoutes = Router()

// Definições das rotas para os caminhos específicos, os dados enviados no corpo da requisição (JSON) serão processados pelo controlador
classificationRoutes.get("/classifications/:karttrack/:weight/:name", getClassification)
classificationRoutes.post("/classifications", postClassification)

// Exporta para ser usado no app.js
export default classificationRoutes