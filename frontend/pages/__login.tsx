import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import AuthLayout from "~/auth/AuthLayout";
import { useAuth } from "~/auth/hooks";
import { login } from "~/auth/services";
import { toastAPIError } from "~/utils";
import FormInput from "~/ui/form/FormInput";
import Button from "~/ui/button/Button";
import { AppLink, Title, ParagraphItalic, Paragraph } from "~/ui";

interface ILoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { setUser } = useAuth();
  const { push, query } = useRouter();
  const { register, formState, handleSubmit } = useForm<ILoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirect = () => {
    if (query.from) {
      push(decodeURIComponent(query.from as string));
    } else {
      push("/");
    }
  };

  const onSubmit = async ({ email, password }: ILoginForm) => {
    try {
      const user = await login(email as string, password as string);
      setUser(user);
      redirect();
    } catch (e) {
      toastAPIError(e as any);
    }
  };

  return (
    <AuthLayout direction="row">
      <TitleDiv>
        <h1>Login</h1>

        <Paragraph>Its good to see you again!</Paragraph>
      </TitleDiv>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          name="email"
          type="text"
          color="primary"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["email"]}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          color="primary"
          registerOptions={{ required: true }}
          register={register}
          error={formState.errors["password"]}
        />
        <Button type="submit" color="primary" icon="login" width="100%">
          Login
        </Button>
        <RegisterDiv>
          <ParagraphItalic>Havent registered? </ParagraphItalic>
          <AppLink href="/register" color="primary">
            Register
          </AppLink>
        </RegisterDiv>
      </LoginForm>
    </AuthLayout>
  );
};

const RegisterDiv = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const TitleDiv = styled.div`
  text-align: start;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  gap: 1.5rem;
`;

export default LoginPage;
