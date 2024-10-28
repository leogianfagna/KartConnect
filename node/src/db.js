import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://pedroozassa01:puc123456@cluster0.dzsg9.mongodb.net/ProjetoKart?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Conectado ao banco")
    } catch (error) {
        console.error("Erro na conexão com o banco: ", error)
        process.exit()
    }
}