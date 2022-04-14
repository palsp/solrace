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
import Button from "~/ui/button/Button";
import { AppLink, ParagraphItalic, Paragraph } from "~/ui";

interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

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
      <TitleDiv>
        <h1>Register</h1>
        <Paragraph>Join the world of Solracer!</Paragraph>
      </TitleDiv>
      <RegisterForm onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          name="email"
          type="text"
          color="secondary"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["email"]}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          color="secondary"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["password"]}
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          color="secondary"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["password"]}
        />
        <Button type="submit" color="secondary" width="100%" icon="register">
          Register
        </Button>
        <LoginDiv>
          <ParagraphItalic>Already registered?</ParagraphItalic>
          <AppLink href="/login">Login</AppLink>
        </LoginDiv>
      </RegisterForm>
    </AuthLayout>
  );
};

const WrapperButton = styled.div`
  width: 100%;
`;

const LoginDiv = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const TitleDiv = styled.div`
  text-align: start;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 1.5rem;
`;
export default RegisterPage;
