import Kart_Track from "../models/kart_track.js"


export const getKartTracks = async (req, res) => {
    try {
        const { name } = req.params

        const filter = {}
        if (name != "null") {filter.nome = { $regex: name, $options: "i" }}

        const classifications = await Kart_Track.find(filter)
        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
