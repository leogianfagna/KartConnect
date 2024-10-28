import Classification from "../models/classification.js"

export const postClassification = async (req, res) => {
    try {
        const classification = await Classification.insertMany()
    } catch (error) {
        
    }
}

export const getClassification = async (req, res) => {
    try {
        const { peso } = req.params
        const { kartodromo } = req.params
        console.log(peso)
        console.log(kartodromo)
        const classifications = await Classification.find({kartodromo:"Velocita"}, {peso:"50"})
        res.json(classifications)
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}
