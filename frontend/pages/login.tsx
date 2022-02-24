import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useAuth } from '~/auth/hooks'
import { login } from '~/auth/services'

const LoginPage = () => {
  const { setUser } = useAuth()
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const onSubmit = async () => {
    const { value: email } = emailRef.current!
    const { value: password } = passwordRef.current!

    const user = await login(email as string, password as string)
    setUser(user)
    router.push('/')
  }

  return (
    <>
      <form>
        <div>
          <label>Email</label>
          <input type="text" ref={emailRef} />
        </div>

        <div>
          <label>Password</label>
          <input type="password" ref={passwordRef} />
        </div>
        <button type="button" onClick={onSubmit}>
          Login
        </button>
      </form>
      <Link href="/register">
        <a>Register</a>
      </Link>
    </>
  )
}

export default LoginPage
