"use client";

import Button from "@/components/Button";

import { InputDefault } from "@/components/Form/Inputs/InputDefault";
import { Heading } from "@/components/Typography/Heading";
import { useForm } from "react-hook-form";
import { LoginForm, LoginFormSchema } from "./login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "../../service/auth.service";
import { useRouter } from "next/navigation";

export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginForm),
    mode: "onChange",
  });

  const router = useRouter();

  const servicePostLogin = async (form: LoginFormSchema) => {
    try {
      const { data } = await AuthService.postLogin(form);

      if (data) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log({ err });
      setError("password", { message: "E-mail/senha incorretos" });
    }
  };

  return (
    <section className="flex w-full h-full">
      <div className="flex flex-col w-full h-dvh py-8 px-6 gap-12 place-self-center lg:pt-16 lg:px-0">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(servicePostLogin)}
          className="flex flex-col w-full h-full gap-12 max-w-[720px] lg:max-w-[468px] md:place-self-center md:md:h-fit"
        >
          <div className="flex flex-col w-full h-full gap-12">
            <Heading type="H1">Acessar conta</Heading>

            <div className="flex flex-col w-full h-full gap-6">
              <InputDefault<LoginFormSchema>
                id="email"
                type="email"
                label="E-mail:"
                placeholder="Digite seu e-mail"
                register={register}
                icon="tabler:mail"
                errorMessage={errors.email?.message}
                hasValue={!!watch().email}
              />

              <InputDefault<LoginFormSchema>
                id="password"
                type="password"
                label="Senha:"
                placeholder="Digite sua senha"
                register={register}
                icon="tabler:lock-password"
                errorMessage={errors.password?.message}
                hasValue={!!watch().password}
              />
            </div>
          </div>

          <Button
            withIcon
            leftIcon="tabler:logout"
            width="fill"
            disabled={!isValid}
          >
            Entrar
          </Button>
        </form>
      </div>

      <div
        className="hidden lg:flex w-full h-full"
        style={{
          backgroundImage: "url(./images/bg-login.png)",
        }}
      />
    </section>
  );
};
