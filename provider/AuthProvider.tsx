import { parseCookie } from 'lib/cookies'
import { publicRequest } from 'lib/request'
import { createContext, FC, useContext, useEffect, useState } from 'react'

interface IAuth {
  user: any
  login: (
    name: string,
    password: string
  ) => Promise<
    Response & {
      data: any
    }
  >
}
const AuthContext = createContext<IAuth>({} as IAuth)

let accessToken = ''

export const getToken = async () => {
  // check cookie.lifespan
  // if exist, return accessToken
  // if not, run refreshToken(), then return accessToken
  const { accessTokenLife } = parseCookie()

  if (!accessTokenLife) {
    const res = await publicRequest('/api/refreshToken')
    if (res.data.accessToken) {
      setToken(res.data.accessToken)
    } else {
      return ''
    }
  }

  return accessToken
}

export const setToken = (value: string) => {
  accessToken = value
}

const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (name: string, password: string) => {
    // fetch to api
    const res = await publicRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    })

    // then store accessToken and user to memory
    accessToken = res.data.accessToken
    setUser(res.data)
    return res
  }

  const refreshToken = async () => {
    // if refresh token exist => get new accessToken
    // otherwise => redirect user to login page again
    const res = await publicRequest('/api/refreshToken')
    //
    // if success, store accessToken and user to memory
    accessToken = res.data.accessToken
    setUser(res.data)
  }

  useEffect(() => {
    refreshToken()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext)
