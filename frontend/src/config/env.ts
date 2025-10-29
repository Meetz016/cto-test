const sanitizeUrl = (value: string) => value.replace(/\/+$/, '')

const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
const DEFAULT_API_BASE_URL = 'http://localhost:3000'

const apiBaseUrl = RAW_API_BASE_URL
  ? sanitizeUrl(RAW_API_BASE_URL)
  : DEFAULT_API_BASE_URL

if (!RAW_API_BASE_URL) {
  console.warn(
    '[env] VITE_API_BASE_URL is not defined. Falling back to http://localhost:3000. Set the variable in your environment to point to the backend API.'
  )
}

export const env = {
  apiBaseUrl,
}

export type Env = typeof env
