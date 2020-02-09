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

      .get('/api/auth', async (req: Request, res: Response) => {
        console.log('authhh')
        const authService = new AuthService()
        if (req.query.code && req.query.state) {
          const accessToken = await authService.getAccessToken(req.query.code, req.query.state)
          console.log('access token=', accessToken)
        } else {
          res.redirect(await authService.generateOAuthUrl())
        }
      })

      .post('/api/events', (req: Request, res: Response) => {
        if (req.body.challenge) { return res.send(req.body.challenge) }
      })

      .post('/sprints', async (req: Request, res: Response) =>
        await this.sprintController.createSprint(req, res))
  }

}
