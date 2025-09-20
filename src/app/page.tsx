"use client";

import { Heading } from "@/components/Typography/Heading";
import { Paragraph } from "@/components/Typography/Paragraph";
import { Icon } from "@iconify/react";
import { InputDefault } from "@/components/Form/Inputs/InputDefault";
import { useForm } from "react-hook-form";
import { InputMask } from "@/components/Form/Inputs/InputMask";
import Button from "@/components/Button";

interface FormDTO {
  name: string;
  taxIdentifier: string;
}

export default function Home() {
  const { register, watch } = useForm<FormDTO>();

  return (
    <>
      <Heading type="H1">H1</Heading>
      <Heading type="H2">H2</Heading>
      <Heading type="H3">H3</Heading>

      <Paragraph type="P1">P1</Paragraph>
      <Paragraph type="P2">P2</Paragraph>

      <Icon icon="tabler:home" />

      <InputDefault<FormDTO>
        id="name"
        label="Nome"
        icon="tabler:home"
        type="password"
        register={register}
        hasValue={!!watch().name}
        errorMessage="teste"
      />

      <InputMask<FormDTO>
        id="taxIdentifier"
        label="Nome"
        icon="tabler:home"
        mask="a999.999.999-99"
        register={register}
        errorMessage="teste"
      />

      <Button>Continuar</Button>

      <Button width='fill' withIcon leftIcon="tabler:home">
        Entrar
      </Button>

      <Button withIcon loading>
        Processando
      </Button>
    </>
  );
}
