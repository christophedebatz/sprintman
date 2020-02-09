export interface IRouter {
  exposeHttpRoutes(): void
  exposeWebSockets(): void
  getName(): string
}
