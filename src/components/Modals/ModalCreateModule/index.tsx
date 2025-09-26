import React from 'react';
import Button from '@/components/Button';

import { ModalDefault } from '../ModalDefault';
import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/service/index.service';
import { useParams } from 'next/navigation';
import {
  CreateModuleForm,
  CreateModuleFormSchema,
} from './create-module.validation';

interface ModalCreateModuleProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (module: { id: string; name: string }) => void;
}

export const ModalCreateModule: React.FC<ModalCreateModuleProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { id } = useParams();
  const {
    handleSubmit,
    register,
    watch,

    formState: { isValid, errors },
  } = useForm<CreateModuleFormSchema>({
    mode: 'onChange',
    resolver: zodResolver(CreateModuleForm),
  });

  const postCreateModule = async () => {
    try {
      const { data } = await api.post('/module', {
        name: watch().name,
        course_id: id,
      });

      if (data) {
        onSuccess({
          id: data.id,
          name: data.name,
        });
      }
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <ModalDefault visible={visible} onClose={onClose} title="Novo módulo">
      <form
        className="flex w-full flex-col gap-6 md:max-w-[380px]"
        onSubmit={handleSubmit(postCreateModule)}
      >
        <InputDefault
          id="name"
          label="Nome do módulo:"
          placeholder="Ex: Excel básico"
          register={register}
          icon="tabler:note"
          hasValue={!!watch().name}
          errorMessage={errors.name?.message}
        />

        <Button
          withIcon
          leftIcon="tabler:plus"
          width="fill"
          disabled={!isValid}
        >
          Adicionar
        </Button>
      </form>
    </ModalDefault>
  );
};
