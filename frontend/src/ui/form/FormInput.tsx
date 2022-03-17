import {
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";
import styled from "styled-components";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  register: UseFormRegister<any>;
  className?: string;
  label?: React.ReactNode;
  name: string;
  error?: any;
  registerOptions?: RegisterOptions;
  errorMessage?: Record<string, React.ReactNode>;
  color?: string;
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
    <Label>
      {label && <div>{label}</div>}
      <Input {...register(name, registerOptions)} {...rest} />
      <div>{error && error.message}</div>
    </Label>
  );
};

interface InputProps extends UseFormRegisterReturn {
  [key: string]: any;
}
const Input = styled.input`
  width: 100%;
  border: none;
  border: 0.05rem solid lightgray;
  border-radius: 0.175rem;

  &:focus {
    outline: 1px solid
      ${(props: InputProps) => `var(--color-${props.color}-dark)`};
  }
`;

const Label = styled.label`
  width: 100%;
`;
export default FormInput;
