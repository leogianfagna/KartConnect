// Arquivo responsável pela configuração de conexão

// Importações de bibliotecas
import mongoose from "mongoose" // Api para manipulação de dados com MongoDB
const dotenv = require('dotenv');

// Exporta a função de conexão para ser usado no app.js
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Conectado ao banco")
    } catch (error) {
        console.error("Erro na conexão com o banco: ", error)
        process.exit()
    }
}