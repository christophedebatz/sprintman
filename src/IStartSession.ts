import { Server } from 'http'
import express from 'express'
import SlackMessageAdapter from '@slack/interactive-messages/dist/adapter'
import SlackEventAdapter from '@slack/events-api/dist/adapter'
import { Connection } from 'typeorm'

export default interface IStartSession {
  app: express.Express
  connection: Connection | null
  interactions: SlackMessageAdapter
  events: SlackEventAdapter
}
