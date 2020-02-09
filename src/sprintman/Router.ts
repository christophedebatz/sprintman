import * as express from 'express'
import SprintRepository from '../common/model/repository/SprintRepository'
import SprintController from './controller/SprintController'
import axios from 'axios'
import AuthService from './service/AuthService'
import IStartSession from '../IStartSession'

export default class Router {

  private readonly startSession: IStartSession
  private readonly sprintController: SprintController

  constructor(startSession: IStartSession) {
    this.startSession = startSession
    this.sprintController = new SprintController(new SprintRepository(startSession.connection))
  }

  public exposeEvents() {
    // il faut gérer le bot, il faut un bot pour cet évent
    this.startSession.events.on('app_home_opened',  e => {
      console.log('e=', e)
      const view = {
        user_id: e.user,
        view: require('./home.json')
      }
      const axiosInstance = axios.create({
        baseURL: 'https://slack.com/api',
        timeout: 3000,
        headers: {'Content-Type': 'application/json', 'Authorization': 'xoxp-931735759395-943224228901-932382940019-b197aa07a02f960dffc10fd2b9376b00'}
      });
      console.log('response=', JSON.stringify(view))
      axiosInstance.post('https://slack.com/api/views.publish', { view })
    })
  }

  public exposeHttpRoutes() {
    this.startSession.app
      .get('/version', (req: express.Request, res: express.Response) => res.json({ version: 1.0 }))

      .get('/auth', async (req, res) => {
        const authService = new AuthService()
        if (req.query.code && req.query.state) {
          const accessToken = await authService.getAccessToken(req.query.code, req.query.state)
        } else {
          res.redirect(await authService.generateOAuthUrl())
        }
      })

      .post('/sprints', async (req, res) =>
        await this.sprintController.createSprint(req, res))
  }

}
