// Ponto de entrada de inicialização do servidor, garante requisições HTTP

// Objeto app é uma instância do Express preparado com middlewares, configurações e conexões de rotas
import { app } from "./app.js"

const PORT = 3000

// Coloca no modo escuta para requisições
app.listen(PORT,()=>{
    console.log("Aplicativo rodando na porta: " + PORT + ".")
})