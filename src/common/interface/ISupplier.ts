export default interface ISupplier<T> {
  get(options?: any): Promise<T>
}
