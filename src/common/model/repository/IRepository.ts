import { FindConditions, FindManyOptions } from 'typeorm'

export default interface IRepository<T, K> {
  save(entity: T): Promise<T>
  findById(id: K): Promise<T>
  findAll(): Promise<T[]>
  findBy(condition: FindManyOptions<T>): Promise<{ rows: T[], count: number }>
  delete(condition: FindConditions<T>): Promise<number|null>
}
