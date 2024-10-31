import Classification from "../models/classification.js"
import net from "net"

export const postClassification = async (req, res) => {
    try {
        const { qtd } = req.body

        const client = new net.Socket()

        client.connect(8000, 'localhost', () => {
            console.log('Connected to Java server')
            client.write(`${qtd}\n`)
        });

        client.on('data', async (data) => {
            try {
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

        const classifications = await Classification.find(filter).sort({ "tempo.totalEmMs": 1 })

        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
