import {Connection} from 'typeorm'
import { EntitySchema, FindConditions, FindManyOptions, ObjectType, Repository } from 'typeorm'
import IRepository from './IRepository'

export default abstract class AbstractRepository<T, K> implements IRepository<T, K> {

  private readonly repository: Repository<T>

  protected constructor(connection: Connection, type: ObjectType<T> | EntitySchema<T> | string) {
    this.repository = connection.getRepository(type)
  }

  public async save(entity: T): Promise<T> {
    return await this.repository.save(entity)
  }

  public async findById(id: K): Promise<T> {
    return await this.repository.findOne(id)
  }

  public async findAll(): Promise<T[]> {
    return await this.repository.find()
  }

  public async delete(condition: FindConditions<T>): Promise<number|null> {
    return (await this.repository.delete(condition)).affected
  }

  public async findBy(condition: FindManyOptions<T>): Promise<{ rows: T[], count: number}> {
    const [rows, count] = await this.repository.findAndCount(condition)
    return { rows, count}
  }

}
