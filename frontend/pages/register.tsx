import Link from "next/link";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import AuthLayout from "~/auth/AuthLayout";
import { useAuth } from "~/auth/hooks";
import { signup } from "~/auth/services";
import { toastAPIError } from "~/utils";

import FormInput from "~/ui/form/FormInput";
import StyledButton from "~/ui/button/Button";
import { AppLink } from "~/ui";

interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  /* height: 30%; */
  justify-content: space-evenly;
  gap: 1rem;
  align-items: center;
`;

const RegisterPage = () => {
  const { setUser } = useAuth();
  const { push } = useRouter();

  const { register, formState, handleSubmit } = useForm<IRegisterForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({
    email,
    password,
    confirmPassword,
  }: IRegisterForm) => {
    if (password !== confirmPassword) {
      toast("Password not matching", { type: "error" });
      return;
    }

    try {
      const user = await signup(email as string, password as string);
      setUser(user);
      push("/");
    } catch (e) {
      toastAPIError(e as any);
    }
  };

  return (
    <AuthLayout direction="row-reverse">
      <RegisterForm onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          name="email"
          type="text"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["email"]}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["password"]}
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["password"]}
        />
        <WrapperButton>
          <StyledButton type="submit" color="secondary" width="100%">
            Register
          </StyledButton>
        </WrapperButton>
        <AppLink href="/login">Login</AppLink>
      </RegisterForm>
    </AuthLayout>
  );
};

const WrapperButton = styled.div`
  width: 300px;
`;

export default RegisterPage;
