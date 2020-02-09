import {Column, Entity, ManyToOne} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Sprint } from './Sprint'
import { User } from './User'

@Entity()
export class Actor extends BaseEntity {

  @Column()
  private _duration: number

  @ManyToOne(type => User, user => user.actors)
  private _user!: User

  @ManyToOne(type => Sprint, sprint => sprint.actors)
  private _sprint!: Sprint

  get duration(): number {
    return this._duration
  }

  set duration(value: number) {
    this._duration = value
  }

  get user(): User {
    return this._user
  }

  set user(value: User) {
    this._user = value
  }

  get sprint(): Sprint {
    return this._sprint
  }

  set sprint(value: Sprint) {
    this._sprint = value
  }
}
