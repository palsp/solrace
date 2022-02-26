import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import styled from 'styled-components'

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  register: UseFormRegister<any>
  className?: string
  label?: React.ReactNode
  name: string
  error?: any
  registerOptions?: RegisterOptions
  errorMessage?: Record<string, React.ReactNode>
}

const FormInput: React.FC<Props> = ({
  label,
  register,
  registerOptions,
  name,
  error,
  className,
  ...rest
}) => {
  return (
    <label>
      {label && <div>{label}</div>}
      <input {...register(name, registerOptions)} {...rest} />
      <div>{error && error.message}</div>
    </label>
  )
}
export default FormInput
