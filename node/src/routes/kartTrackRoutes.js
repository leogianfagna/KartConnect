import { Router } from "express"

import { getKartTracks } from "../controllers/kartTrackController.js"

const kartTrackRoutes = Router()

kartTrackRoutes.get("/kartTracks/:nome", getKartTracks)

export default kartTrackRoutes