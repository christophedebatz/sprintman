import axios from 'axios'
import { NextFunction } from 'connect'
import crypto from 'crypto'
import http from 'http'
import moment from 'moment'
import uuid from 'uuid'
import ICacheService from '../../common/service/ICacheService'
import RedisCacheService from '../../common/service/RedisCacheService'

export default class AuthService {

  public static async filterSlackRequest(req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction): Promise<void> {
    const timestamp = parseInt(req.headers['x-slack-request-timestamp'] as string, 10)
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      const requestHasLessThan5Minutes = moment.unix(timestamp)
        .isSameOrAfter(moment().subtract(5, 'm'))
      if (requestHasLessThan5Minutes) {
        const slackSignature = Buffer.from(req.headers['x-slack-signature'] as string, 'hex')
        const appSignature = Buffer.from('v0=' + crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
          .update(`v0:${timestamp}:${body}`)
          .digest('hex'), 'hex')
        if (crypto.timingSafeEqual(slackSignature, appSignature)) {
          next()
        }
      }
    })
  }

  private static getStateCacheKey(state: string): string {
    return `sm:auth:states:${state}`
  }

  private cacheServie: ICacheService<string>

  public constructor() {
    this.cacheServie = new RedisCacheService()
  }

  public async getAccessToken(code: string, state: string): Promise<string> {
    const stateKey = AuthService.getStateCacheKey(state)
    const hasState = await this.cacheServie.has(stateKey)
    if (hasState) {
      const body = {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
        code
      }
      const { data } = await axios.post(
        'https://slack.com/api/oauth.access',
        body,
        { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
      )

      console.log('data=', data)
      return data.access_token
    }

    return null
  }

  public async generateOAuthUrl(): Promise<string> {
    const state: string = uuid.v4()
    const slackUrl = new URL('https://slack.com/oauth/authorize')
    const authVariables = {
      client_id: process.env.SLACK_CLIENT_ID,
      scope: process.env.SLACK_SCOPES,
      redirect_uri: process.env.SLACK_REDIRECT_URI,
      team: process.env.SLACK_TEAM,
      state
    }
    Object.entries(authVariables).forEach(entry => {
      const [key, value] = entry
      if (value) {
        slackUrl.search += `&${key}=${value}`
      }
    })
    await this.cacheServie.set(AuthService.getStateCacheKey(state), undefined, 900)
    return slackUrl.href
  }

}
