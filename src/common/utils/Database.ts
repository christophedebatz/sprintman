import * as path from 'path'
import {Connection, createConnection} from 'typeorm'

export default class Database {

  private readonly credentials: { dbHost: string, dbPort: number, dbName: string, dbPassword: string, dbUser: string }

  constructor(dbHost: string, dbPort: number, dbName: string, dbPassword: string, dbUser: string) {
    this.credentials = { dbHost, dbPort, dbName, dbPassword, dbUser }
  }

  public async connect(): Promise<Connection> {
    return await createConnection({
      type: 'mariadb',
      synchronize: true,
      logging: true,
      host: this.credentials.dbHost,
      port: this.credentials.dbPort,
      username: this.credentials.dbUser,
      password: this.credentials.dbPassword,
      database: this.credentials.dbName,
      entities: [
        path.join(__dirname, '../model/*.js')
      ]
    })
  }
}
