export interface IListResponse<T> {
  success: boolean,
  queryAt: string,
  payload: T[]
}

export interface ISingleResponse<T> {
  success: boolean,
  queryAt: string,
  payload: T
}

export interface IErrorResponse {
  success: false,
  queryAt: string,
  code: string,
  message?: string
}

export default class BunkerResponse<T> {

  public static list<T>(payload: T[], withContainer = true): IListResponse<T> | any {
    payload.forEach((data) => BunkerResponse.removeProps(data))
    const defaultObj = {
      queryAt: new Date().toISOString(),
      success: true,
      payload
    }
    if (withContainer) {
      return defaultObj
    }
    delete defaultObj.payload
    return { ...payload, ...defaultObj }
  }

  public static single<T>(payload: T, withContainer = true): ISingleResponse<T> | any {
    BunkerResponse.removeProps(payload)
    const defaultObj = {
      queryAt: new Date().toISOString(),
      success: true,
      payload
    }
    if (withContainer) {
      return defaultObj
    }
    delete defaultObj.payload
    return { ...payload, ...defaultObj }
  }

  public static error(code: string, message?: string): IErrorResponse {
    return {
      code,
      message,
      queryAt: new Date().toISOString(),
      success: false
    }
  }

  private static propsToRemove = [
    '__v'
  ]

  private static removeProps<T>(payload: T | any) {
    if (!payload) {
      return
    }
    BunkerResponse.propsToRemove.forEach((prop) => {
      if (payload[prop] !== undefined) {
        delete payload[prop]
      }
    })
  }
}
