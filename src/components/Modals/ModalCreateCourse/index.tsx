import React from 'react';
import Button from '@/components/Button';

import { ModalDefault } from '../ModalDefault';
import { DragAndDropImage } from '@/components/Form/DragAndDropImage';
import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/service/index.service';
import { useRouter } from 'next/navigation';
import {
  CreateCourseForm,
  CreateCourseFormSchema,
} from './create-course.validation';

interface ModalCreateCourseProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalCreateCourse: React.FC<ModalCreateCourseProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { isValid, errors },
  } = useForm<CreateCourseFormSchema>({
    mode: 'onChange',
    resolver: zodResolver(CreateCourseForm),
  });

  const postCreateCourse = async () => {
    try {
      const formData = new FormData();

      formData.append('file', watch().file);
      formData.append('type', 'COVER');

      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data) {
        const { data: res } = await api.post('/course', {
          name: watch().course_name,
          cover_key: data.key,
        });

        if (res) {
          onClose();
          router.push('/dashboard/cursos/novo/' + res.id);
        }
      }
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <ModalDefault visible={visible} onClose={onClose} title="Novo curso">
      <form
        className="flex w-full flex-col gap-6 md:max-w-[380px]"
        onSubmit={handleSubmit(postCreateCourse)}
      >
        <InputDefault
          id="course_name"
          label="Nome do curso:"
          placeholder="Digite o nome do curso..."
          register={register}
          icon="tabler:note"
          hasValue={!!watch().course_name}
          errorMessage={errors.course_name?.message}
        />

        <DragAndDropImage
          file={watch().file}
          setFile={(newFile) =>
            newFile && setValue('file', newFile, { shouldValidate: true })
          }
        />

        <Button
          withIcon
          leftIcon="tabler:plus"
          width="fill"
          disabled={!isValid}
        >
          Cadastrar curso
        </Button>
      </form>
    </ModalDefault>
  );
};
