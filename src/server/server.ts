// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()
import express, { Express } from 'express'
import { routes } from '@src/routes/routes'
import { LogErrorMessage } from '@src/utils'
import { SwaggerDocs } from '@docs/swagger/swagger'
import { PORT } from '@src/constants/constants'
import { AppDataSource } from '@src/data-source'
import { initializeRabbitMQ } from '@src/server/rabbitmqService'
import { consumerService } from '@src/services/product.service'

export const app: Express = express()
export const PortNum = Number(process.env.PORT!) || PORT
export let dataBase: any
export let rabbitmqChannel: any

const connectToDatabase = async () => {
  AppDataSource.initialize().then(async (db) => {
    console.log('Connected to MongoDB!')
    dataBase = db
  })
}

const connectToRabbitMQ = async () => {
  rabbitmqChannel = await initializeRabbitMQ()
  console.log('RabbitMQ connected!')
}

const listenPort = (PORT: number) => {
  app.listen(PORT, () => console.log(`Server is up & running on http://localhost:${PortNum}`))
}

const userBodyParser = () => {
  app.use(express.json())
}

const createRoutes = async () => {
  routes(app)
}

const createSwaggerDocs = () => {
  SwaggerDocs(app, PortNum)
}

const start = async () => {
  try {
    await connectToDatabase()
    await connectToRabbitMQ()
    await consumerService()
    await listenPort(PortNum)
    createSwaggerDocs()
    userBodyParser()
    await createRoutes()
  } catch (error) {
    console.log(LogErrorMessage(error))
  }
}

export default {
  start,
}
