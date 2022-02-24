import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import AuthLayout from '~/auth/AuthLayout'
import { useAuth } from '~/auth/hooks'
import { login } from '~/auth/services'
import FormInput from '~/ui/form/FormInput'
import { toastAPIError } from '~/utils'

interface ILoginForm {
  email: string
  password: string
}

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 30%;
  justify-content: space-evenly;
  align-items: center;
`

const LoginPage = () => {
  const { setUser } = useAuth()
  const router = useRouter()
  const { register, formState, handleSubmit } = useForm<ILoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async ({ email, password }: ILoginForm) => {
    try {
      const user = await login(email as string, password as string)
      setUser(user)
      router.push('/')
    } catch (e) {
      toastAPIError(e as any)
    }
  }

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          name="email"
          type="text"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors['email']}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors['password']}
        />

        <button type="submit">Login</button>
      </LoginForm>
      <Link href="/register">
        <a>Register</a>
      </Link>
    </AuthLayout>
  )
}

export default LoginPage
