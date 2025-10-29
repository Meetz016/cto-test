import { env } from '../config/env'

const ensureLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`)

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url)

export class ApiError<T = unknown> extends Error {
  public readonly status: number
  public readonly data: T

  constructor(status: number, data: T, message?: string) {
    super(message ?? 'Request failed')
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

type RequestOptions = RequestInit & {
  skipDefaultHeaders?: boolean
}

const buildUrl = (endpoint: string) =>
  isAbsoluteUrl(endpoint) ? endpoint : `${env.apiBaseUrl}${ensureLeadingSlash(endpoint)}`

export const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { skipDefaultHeaders, headers, body, ...rest } = options

  const requestHeaders = new Headers(headers)

  if (!skipDefaultHeaders) {
    if (!requestHeaders.has('Accept')) {
      requestHeaders.set('Accept', 'application/json')
    }

    const shouldSetContentType =
      !!body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')

    if (shouldSetContentType) {
      requestHeaders.set('Content-Type', 'application/json')
    }
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const isBlob = typeof Blob !== 'undefined' && body instanceof Blob
  const isArrayBuffer = typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer
  const isUrlSearchParams = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams

  const shouldSerialiseBody =
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    !isFormData &&
    !isBlob &&
    !isArrayBuffer &&
    !isUrlSearchParams

  const response = await fetch(buildUrl(endpoint), {
    ...rest,
    headers: requestHeaders,
    body: shouldSerialiseBody && typeof body !== 'string'
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined),
  })

  const text = await response.text()

  let data: unknown = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch (error) {
      console.warn('[api] Failed to parse response as JSON', error)
      data = text
    }
  }

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data && 'message' in data && typeof (data as any).message === 'string'
        ? (data as any).message
        : undefined) ?? response.statusText ?? 'Request failed'

    throw new ApiError(response.status, data, message)
  }

  return data as T
}
