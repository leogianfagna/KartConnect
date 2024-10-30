import KartTrack from "../models/kart_track.js"


export const getKartTracks = async (req, res) => {
    try {
        const { name } = req.params

        const filter = {}
        if (karttrack != "null") {filter.nome = name;}

        const classifications = await KartTrack.find(filter)
        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
