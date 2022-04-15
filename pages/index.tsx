import { userRequest } from 'lib/request'
import Link from 'next/link'
import { useAuth } from 'provider/AuthProvider'

const Home = () => {
  const { user, login } = useAuth()

  const handleLogin = () => {
    login('tebo', 'secret')
  }

  const getTsarbomba = async () => {
    const res = await userRequest('/api/tsarbomba')
    console.log(res.data)
  }

  return (
    <main>
      <h1>Home</h1>
      <Link href="/about">go to about</Link>
      <button onClick={handleLogin}>login</button>
      {user && (
        <div>
          <p>name: {user.name}</p>
        </div>
      )}
      <button onClick={getTsarbomba}>get tsarbomba</button>
    </main>
  )
}

export default Home
