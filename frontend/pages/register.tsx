import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useAuth } from '~/auth/hooks'
import { login, signup } from '~/auth/services'

const RegisterPage = () => {
  const { setUser } = useAuth()
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const onSubmit = async () => {
    const { value: email } = emailRef.current!
    const { value: password } = passwordRef.current!
    const { value: confirmPassword } = confirmPasswordRef.current!

    if (password !== confirmPassword) {
      alert('Password mismatch')
      return
    }

    const user = await signup(email as string, password as string)
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

        <div>
          <label>Confirm Password</label>
          <input type="password" ref={confirmPasswordRef} />
        </div>
        <button type="button" onClick={onSubmit}>
          Register
        </button>
      </form>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </>
  )
}

export default RegisterPage
