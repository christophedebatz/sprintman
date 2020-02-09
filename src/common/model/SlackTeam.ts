import {Column, Entity } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity()
export class SlackTeam extends BaseEntity {

  @Column()
  private _teamId: string

  @Column()
  private _userToken: string

  @Column()
  private _botToken: string

  get teamId(): string {
    return this._teamId
  }

  set teamId(value: string) {
    this._teamId = value
  }

  get userToken(): string {
    return this._userToken
  }

  set userToken(value: string) {
    this._userToken = value
  }

  get botToken(): string {
    return this._botToken
  }

  set botToken(value: string) {
    this._botToken = value
  }
}
