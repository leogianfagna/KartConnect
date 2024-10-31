import { Router } from "express"

import { postClassification, getClassification} from "../controllers/classificationController.js"

const classificationRoutes = Router()

classificationRoutes.get("/classifications/:karttrack/:weight/:name", getClassification)

classificationRoutes.post("/classifications", postClassification)

export default classificationRoutes