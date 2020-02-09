import {Column, Entity, ManyToMany} from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Sprint } from './Sprint'

@Entity()
export class Task extends BaseEntity {

  @Column()
  private _name: string

  @Column()
  private _status: string

  @ManyToMany(type => Sprint, sprint => sprint.tasks)
  private _sprints: Sprint[]

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get status(): string {
    return this._status
  }

  set status(value: string) {
    this._status = value
  }

  get sprints(): Sprint[] {
    return this._sprints
  }

  set sprints(value: Sprint[]) {
    this._sprints = value
  }
}
