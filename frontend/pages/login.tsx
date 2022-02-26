import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import AuthLayout from '~/auth/AuthLayout'
import { useAuth } from '~/auth/hooks'
import { login } from '~/auth/services'
import { toastAPIError } from '~/utils'
import FormInput from '~/ui/form/FormInput'

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
  const { push, query } = useRouter()
  const { register, formState, handleSubmit } = useForm<ILoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const redirect = () => {
    if (query.from) {
      push(decodeURIComponent(query.from as string))
    } else {
      push('/')
    }
  }

  const onSubmit = async ({ email, password }: ILoginForm) => {
    try {
      const user = await login(email as string, password as string)
      setUser(user)
      redirect()
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
