// Arquivo responsável pela configuração do servidor, usando Express para integrar os componentes

// Importações de framework
import express from "express"
import cors from "cors"

// Importação da configuração de conexão, criada no outro arquivo
import { connectDB } from "./db.js"

// Importação das rotas do projeto
import classificationRoutes from "./routes/classificationRoutes.js"
import kartTrackRoutes from "./routes/kartTrackRoutes.js"

// Criar o aplicativo express (gerenciar rotas, middlewares e configurações)
// e exportar para ser usado em outros arquivos
export const app = express()

// Middleware que vai permitir compartilhamento de recursos de
// diferentes domínios
app.use(cors())
app.use(express.json());
connectDB()

// Registra middlewares ou rotas para lidar com requisições, conectando os arquivos
// de rotas importados na raíz do projeto
app.use("/", classificationRoutes, kartTrackRoutes)