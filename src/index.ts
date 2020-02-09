import 'reflect-metadata'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import * as Dotenv from 'dotenv'
import express, { Express } from 'express'
import http from 'http'
import {Connection} from 'typeorm'
import Database from './common/utils/Database'
import Router from './sprintman/Router'
import IStartSession from './IStartSession'
import { createMessageAdapter } from '@slack/interactive-messages/dist'
import { createEventAdapter } from '@slack/events-api/dist'

const initDatabase = async (): Promise<Connection> => {
  try {
    return await new Database(
      process.env.DB_HOST,
      parseInt(process.env.DB_PORT, 10),
      process.env.DB_NAME,
      process.env.DB_PASSWORD,
      process.env.DB_USER
    ).connect()
  } catch (err) {
    console.error(`Unable to connect database, error is ${err.message}`)
  }
}

const initServer = (defaultPort: number, connection: Connection): IStartSession => {
  const port: number = parseInt(process.env.PORT, 10) || defaultPort
  const app: Express = express()

  const interactions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET)
  const events = createEventAdapter(process.env.SLACK_SIGNING_SECRET)

  app.use(cors({ origin: '*' }))
  app.use('/events', events.requestListener())
  app.use('/interactions', interactions.requestListener())
  // app.use(bodyParser.json())

  const server = http.createServer(app)
  server.listen(port, () => console.info(`Server listening on :${port}`))
  return { app, interactions, events, connection }
}

const initApp = async (): Promise<void> => {
  const connection = await initDatabase()
  const startSession = initServer(3000, connection)
  const router = new Router(startSession)
  router.exposeEvents()
  router.exposeHttpRoutes()
}

Dotenv.config()
initApp().catch(console.error)
