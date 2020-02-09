export default interface ICacheService<T> {
  get(key: string): Promise<T>
  set(key: string, value?: T, ttl?: number): Promise<void>
  has(key: string): Promise<boolean>
  refresh(key: string): Promise<boolean>
  remove(...keys: string[]): Promise<boolean>
  gc(): number
}
