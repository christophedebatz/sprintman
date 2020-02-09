import * as bodyParser from 'body-parser'
import cors from 'cors'
import * as Dotenv from 'dotenv'
import express from 'express'
import { Express } from 'express-serve-static-core'
import { Server } from 'http'
import 'reflect-metadata'
import {Connection} from 'typeorm'
import Database from './common/utils/Database'
import Router from './sprintman/Router'
import AuthService from './sprintman/service/AuthService'

const initDatabase = async (): Promise<Connection> => {
  return await new Database(
    process.env.DB_HOST,
    parseInt(process.env.DB_PORT, 10),
    process.env.DB_NAME,
    process.env.DB_PASSWORD,
    process.env.DB_USER
  ).connect()
}

const initServer = (defaultPort: number): { http: Server, app: Express } => {
  const port: number = parseInt(process.env.PORT, 10) || defaultPort
  const app: Express = express()
  app.use(AuthService.filterSlackRequest)
  app.use(cors({ origin: '*' }))
  app.use(bodyParser.json())
  const http = app.listen(port, () => console.info(`Server started, listening on :${port}`))
  return { app, http }
}

const initApp = async (): Promise<void> => {
  const { app } = initServer(3000)
  return initDatabase().then(connection => {
      const router = new Router(app, connection)
      router.exposeHttpRoutes()
    })
    .catch(err => {
      console.error(`Unable to connect database, error is ${err.message}`)
    })
}

Dotenv.config()
initApp().catch(console.error)
