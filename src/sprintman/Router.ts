import { Request, Response } from 'express'
import { Express } from 'express-serve-static-core'
import { Connection } from 'typeorm'
import SprintRepository from '../common/model/repository/SprintRepository'
import SprintController from './controller/SprintController'
import AuthService from './service/AuthService'

export default class Router {

  private readonly app: Express
  private readonly sprintController: SprintController

  constructor(app: Express, connection: Connection) {
    this.app = app
    this.sprintController = new SprintController(new SprintRepository(connection))
  }

  public exposeHttpRoutes() {
    this.app

      .get('/version', (req: Request, res: Response) => res.json({ version: 1.0 }))

      .get('/auth', async (req: Request, res: Response) => {
        const authService = new AuthService()
        if (req.query.code && req.query.state) {
          const accessToken = await authService.getAccessToken(req.query.code, req.query.state)
        } else {
          res.redirect(await authService.generateOAuthUrl())
        }
      })

      .post('/events', (req: Request, res: Response) => {
        if (req.body.challenge) res.send(req.body.challenge);
      })

      .post('/sprints', async (req: Request, res: Response) =>
        await this.sprintController.createSprint(req, res))
  }

}
