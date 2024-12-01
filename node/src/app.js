import express from "express"
import { connectDB } from "./db.js"
import classificationRoutes from "./routes/classificationRoutes.js"
import kartTrackRoutes from "./routes/kartTrackRoutes.js"
import cors from "cors"

export const app = express()

app.use(cors())
app.use(express.json());
connectDB()

app.use("/", classificationRoutes, kartTrackRoutes)