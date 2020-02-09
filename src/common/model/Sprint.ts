import {Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Actor } from './Actor'
import { BaseEntity } from './BaseEntity'
import { Task } from './Task'

@Entity()
export class Sprint extends BaseEntity {

  @Column()
  private _number: string

  @Column()
  private _status: string

  @ManyToMany(type => Actor, actor => actor.sprint)
  private _actors: Actor[]

  @ManyToMany(type => Task, task => task.sprints)
  @JoinTable()
  private _tasks: Task[]

  get number(): string {
    return this._number
  }

  set number(value: string) {
    this._number = value
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

  get tasks(): Task[] {
    return this._tasks
  }

  set tasks(value: Task[]) {
    this._tasks = value
  }
}
