// Controladores para processar a lógica necessária e retornar as respostas recebidas do banco de dados

// Importa o modelo que será usado
import Classification from "../models/classification.js"
import net from "net"

// Controlador criado exclusivamente para se conectar com o back-end do Java
export const postClassification = async (req, res) => {
    try {
        const { qtd } = req.body
        const client = new net.Socket()

        client.connect(8000, 'localhost', () => {
            console.log('Connected to Java server')
            client.write(`${qtd}\n`)
        });

        // Fica esperando uma informação do Java. (data) é o resultado inteiro do Java que contém as classificações geradas
        client.on('data', async (data) => {
            try {
                // No Java, o tipo da variável é String, precisa converter para JSON
                const classificationArray = JSON.parse(data.toString())
                await Classification.insertMany(classificationArray)
                res.json("Classificações inseridas")
            } catch (error) {
                console.error('Error parsing or inserting data:', error)
            }

            client.destroy()
            console.log('Closed connection to Java server');
        });

        client.on('error', (error) => {
            console.error('Error connecting to Java server:', error)
            res.status(500).send('Error connecting to Java server')
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Node server error')
    }
};

export const getClassification = async (req, res) => {
    try {
        const { weight, karttrack, name } = req.params
        const filter = {}

        if (karttrack !== "null") filter.kartodromo = karttrack
        if (weight !== "null") filter.peso = { $gte: parseInt(weight), $lte: parseInt(weight) + 9 }
        if (name !== "null") filter.nome = name

        // Modelo KartTrack sendo usado para operações no banco de dados
        const classifications = await Classification.find(filter).sort({ "tempo.totalEmMs": 1 })

        // Resposta do controlador que recebeu do banco
        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
