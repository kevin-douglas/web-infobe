'use client';

import React from 'react';
import Button from '@/components/Button';
import Link from 'next/link';

import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { Heading } from '@/components/Typography/Heading';
import { useForm } from 'react-hook-form';
import { SignUpForm, SignUpFormSchema } from './sign-up.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthService } from '../../service/auth.service';
import { Paragraph } from '@/components/Typography/Paragraph';
import { InputMask } from '@/components/Form/Inputs/InputMask';

export const SignUpPage: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(SignUpForm),
    mode: 'onChange',
  });

  const servicePostSignUp = async (form: SignUpFormSchema) => {
    try {
      setLoading(() => true);
      await AuthService.postSignUp(form);
      window.location.href = '/dashboard';
    } catch (err: any) {
      if (err.response?.data.message === 'Email already exists')
        setError('email', { message: 'E-mail já em uso' });
      else setError('password', { message: 'Erro ao cadastar' });
    } finally {
      setLoading(() => false);
    }
  };

  return (
    <section className="flex h-full w-full">
      <div className="flex h-dvh w-full flex-col gap-12 place-self-center px-6 py-8 lg:px-0 lg:pt-16">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(servicePostSignUp)}
          className="flex h-full w-full max-w-[720px] flex-col gap-12 md:md:h-fit md:place-self-center lg:max-w-[468px]"
        >
          <Heading type="H1" className="text-[32px] text-primary-200">
            InfoBe
          </Heading>

          <div className="flex h-full w-full flex-col gap-6">
            <Heading type="H1">Cadastre-se</Heading>

            <div className="flex h-full w-full flex-col gap-6">
              <InputDefault<SignUpFormSchema>
                id="name"
                type="text"
                label="Nome completo:"
                placeholder="Digite seu nome"
                register={register}
                icon="tabler:user"
                errorMessage={errors.name?.message}
                hasValue={!!watch().name}
              />

              <InputDefault<SignUpFormSchema>
                id="email"
                type="email"
                label="E-mail:"
                placeholder="Digite seu e-mail"
                register={register}
                icon="tabler:mail"
                errorMessage={errors.email?.message}
                hasValue={!!watch().email}
              />

              <InputMask<SignUpFormSchema>
                id="tax_identifier"
                label="CPF:"
                type="text"
                placeholder="Digite seu CPF"
                control={control}
                icon="tabler:id"
                mask="999.999.999-99"
                errorMessage={errors.tax_identifier?.message}
              />

              <InputDefault<SignUpFormSchema>
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

            <Link
              href="/login"
              className="w-fit place-self-end text-primary-100 underline"
            >
              <Paragraph type="P2">Já tenho conta</Paragraph>
            </Link>
          </div>

          <Button
            withIcon
            leftIcon="tabler:logout"
            width="fill"
            disabled={!isValid}
            loading={loading}
          >
            Cadastrar
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
