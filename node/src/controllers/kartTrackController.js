import KartTrack from "../models/kart_track.js"


export const getKartTracks = async (req, res) => {
    try {
        const { nome } = req.params
        const classifications = await KartTrack.find({nome:"Velocitá"})
        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
