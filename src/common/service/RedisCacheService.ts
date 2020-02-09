import redis, { RedisClient } from 'redis'
import ICacheService from './ICacheService'

export default class RedisCacheService<T> implements ICacheService<T> {

  private static readonly MAX_TTL: number = 3600 * 12
  private static readonly client: RedisClient = redis.createClient(6379, process.env.REDIS_HOST)

  public get(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) =>
      RedisCacheService.client.get(key, ((err, reply) => err ? reject(err) : resolve(JSON.parse(reply) as T) ))
    )
  }

  public set(key: string, value?: T, ttl?: number): Promise<void> {
    return new Promise<void>((resolve, reject) =>
      RedisCacheService.client.set(key,
        JSON.stringify(value || {}),
        'EX',
        ttl ? ttl : RedisCacheService.MAX_TTL, (err => err ? reject(err) : resolve())
      )
    )
  }

  public async has(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      RedisCacheService.client.exists(key, (err => err ? reject(false) : resolve(true)))
    )
  }

  public remove(...keys: string[]): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      RedisCacheService.client.del(keys, (err, result) =>
        err ? reject(err) : result === 1 ? resolve() : reject()
      )
    )
  }

  public gc(): number {
    throw new Error('Not implemented yet.')
  }

  public refresh(key: string): Promise<boolean> {
    throw new Error('Not implemented yet.')
  }

}
