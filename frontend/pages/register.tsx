import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import AuthLayout from '~/auth/AuthLayout'
import { useAuth } from '~/auth/hooks'
import { signup } from '~/auth/services'
import styled from 'styled-components'
import FormInput from '~/ui/form/FormInput'
import { toast } from 'react-toastify'
import { toastAPIError } from '~/utils'

interface IRegisterForm {
  email: string
  password: string
  confirmPassword: string
}

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 30%;
  justify-content: space-evenly;
  align-items: center;
`

const RegisterPage = () => {
  const { setUser } = useAuth()
  const { push } = useRouter()

  const { register, formState, handleSubmit } = useForm<IRegisterForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async ({
    email,
    password,
    confirmPassword,
  }: IRegisterForm) => {
    if (password !== confirmPassword) {
      toast('Password not matching', { type: 'error' })
      return
    }

    try {
      const user = await signup(email as string, password as string)
      setUser(user)
      push('/')
    } catch (e) {
      toastAPIError(e as any)
    }
  }

  return (
    <AuthLayout>
      <RegisterForm onSubmit={handleSubmit(onSubmit)}>
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

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors['password']}
        />
        <button type="submit">Register</button>
      </RegisterForm>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </AuthLayout>
  )
}

export default RegisterPage
