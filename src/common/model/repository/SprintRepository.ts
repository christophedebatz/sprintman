import {Connection} from 'typeorm'
import { Sprint } from '../Sprint'
import AbstractRepository from './AbstractRepository'

export default class SprintRepository extends AbstractRepository<Sprint, number> {

  constructor(connection: Connection) {
    super(connection, Sprint)
  }

}
