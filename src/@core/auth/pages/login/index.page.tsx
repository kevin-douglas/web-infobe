'use client';

import Button from '@/components/Button';

import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { Heading } from '@/components/Typography/Heading';
import { useForm } from 'react-hook-form';
import { LoginForm, LoginFormSchema } from './login.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../../service/auth.service';

export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginForm),
    mode: 'onChange',
  });

  const servicePostLogin = async (form: LoginFormSchema) => {
    try {
      const { data } = await AuthService.postLogin(form);

      if (data) {
        const response = await fetch('/api/auth/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: form.email,
            role: data.role,
            accessToken: data.accessToken,
          }),
        });

        if (response.ok) {
          window.location.href = '/dashboard';
        } else {
          throw new Error('Erro ao criar sessão');
        }
      }
    } catch (err) {
      console.log({ err });
      setError('password', { message: 'E-mail/senha incorretos' });
    }
  };

  return (
    <section className="flex h-full w-full">
      <div className="flex h-dvh w-full flex-col gap-12 place-self-center px-6 py-8 lg:px-0 lg:pt-16">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(servicePostLogin)}
          className="flex h-full w-full max-w-[720px] flex-col gap-12 md:md:h-fit md:place-self-center lg:max-w-[468px]"
        >
          <div className="flex h-full w-full flex-col gap-12">
            <Heading type="H1">Acessar conta</Heading>

            <div className="flex h-full w-full flex-col gap-6">
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
        className="hidden h-full w-full lg:flex"
        style={{
          backgroundImage: 'url(./images/bg-login.png)',
        }}
      />
    </section>
  );
};
