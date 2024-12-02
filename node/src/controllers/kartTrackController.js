// Controladores para processar a lógica necessária e retornar as respostas recebidas do banco de dados

// Importa o modelo que será usado
import KartTrack from "../models/kart_track.js"

// Define um controlador
export const getKartTracks = async (req, res) => {
    try {
        const { name } = req.params

        const filter = {}
        if (name != "null") {filter.nome = { $regex: name, $options: "i" }}

        // Modelo KartTrack sendo usado para operações no banco de dados
        const classifications = await KartTrack.find(filter)

        // Resposta do controlador que recebeu do banco
        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
