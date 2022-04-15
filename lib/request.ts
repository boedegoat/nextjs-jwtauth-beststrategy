import { getToken } from 'provider/AuthProvider'

const defaultConfig: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
}

export const publicRequest = async (
  url: string,
  config?: RequestInit
): Promise<Response & { data: any }> => {
  const res = await fetch(url, { ...defaultConfig, ...config })
  return { data: await res.json(), ...res }
}

export const userRequest = async (url: string, config?: RequestInit) => {
  const accessToken = await getToken()

  // if accessToken not exist, redirect user to login
  if (!accessToken)
    return {
      data: 'You are not logged in',
    }

  const res = await publicRequest(url, {
    ...config,
    headers: {
      ...defaultConfig.headers,
      ...config?.headers,
      authorization: `Bearer ${accessToken}`,
    },
  })
  return res
}
