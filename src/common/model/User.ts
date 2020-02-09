import {Column, Entity, ManyToMany, OneToMany} from 'typeorm'
import { Actor } from './Actor'
import { BaseEntity } from './BaseEntity'

@Entity()
export class User extends BaseEntity {

  @Column()
  private _name: string

  @Column()
  private _email: string

  @Column()
  private _status: string

  @ManyToMany(type => Actor, actor => actor.user)
  private _actors: Actor[]

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get email(): string {
    return this._email
  }

  set email(value: string) {
    this._email = value
  }

  get status(): string {
    return this._status
  }

  set status(value: string) {
    this._status = value
  }

  get actors(): Actor[] {
    return this._actors
  }

  set actors(value: Actor[]) {
    this._actors = value
  }
}
