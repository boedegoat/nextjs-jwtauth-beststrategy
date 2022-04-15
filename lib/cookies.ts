// taken from https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript

import { serialize, CookieSerializeOptions } from 'cookie'
import { NextApiResponse } from 'next'

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options?: CookieSerializeOptions
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (options?.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge) // ms
    options.maxAge /= 1000 // seconds
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options))
}

/**
 * This sets multiple `cookies` using the `res` object
 */

export const setCookies = (
  res: NextApiResponse,
  cookies: { name: string; value: unknown; options?: CookieSerializeOptions }[]
) => {
  const cookiesSerialized = cookies.map(({ name, value, options }) => {
    const stringValue =
      typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

    if (options?.maxAge) {
      options.expires = new Date(Date.now() + options.maxAge) // ms
      options.maxAge /= 1000 // seconds
    }

    return serialize(name, stringValue, options)
  })

  res.setHeader('Set-Cookie', cookiesSerialized)
}

// taken from https://www.geekstrick.com/snippets/how-to-parse-cookies-in-javascript/

/**
 * Parse `document.cookie`
 */

export const parseCookie = (): { [key: string]: string } => {
  if (!document.cookie) return {}
  return document.cookie
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      // @ts-ignore
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim())
      return acc
    }, {})
}
