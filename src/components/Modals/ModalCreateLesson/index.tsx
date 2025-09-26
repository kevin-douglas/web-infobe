import React from 'react';
import Button from '@/components/Button';

import { ModalDefault } from '../ModalDefault';
import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/service/index.service';
import {
  CreateLessonForm,
  CreateLessonFormSchema,
} from './create-lesson.validation';
import { Lesson } from '@/components/Accordion/module-accordion';
import { EditorCustom } from '@/components/Form/EditorCustom';
import { useLexicalToHtml } from '@/hooks/use-lexical-to-html';

interface ModalCreateLessonProps {
  visible: boolean;
  onClose: () => void;

  module_id: string;

  lesson?: Lesson;
  onSuccess: (isAdd: boolean, lesson: Lesson, module_id: string) => void;
}

export const ModalCreateLesson: React.FC<ModalCreateLessonProps> = ({
  visible,
  onClose,
  module_id,
  lesson,
  onSuccess,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,

    formState: { isValid, errors },
  } = useForm<CreateLessonFormSchema>({
    mode: 'onChange',
    resolver: zodResolver(CreateLessonForm),
  });

  const content = useLexicalToHtml(watch().description);

  const postCreateClassroom = async () => {
    try {
      if (lesson) {
        await api.patch('/lesson/' + lesson.id, {
          name: watch().name,
          module_id: module_id,
          content: content,
        });

        onSuccess(
          true,
          { id: lesson.id, title: watch().name, status: 'not_started' },
          module_id,
        );
      } else {
        const { data } = await api.post('/lesson', {
          name: watch().name,
          module_id: module_id,
          content: content,
        });

        onSuccess(
          true,
          { id: data.id, title: watch().name, status: 'not_started' },
          module_id,
        );
      }
    } catch (err) {
      console.log({ err });
    }
  };

  React.useEffect(() => {
    if (visible && lesson) {
      setValue('name', lesson.title, { shouldValidate: true });
    } else
      reset({
        name: '',
        description: undefined,
      });
  }, [visible]);

  return (
    <ModalDefault
      visible={visible}
      onClose={onClose}
      title="Nova aula"
      className="sm:max-w-[780px]"
    >
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(postCreateClassroom)}
      >
        <InputDefault
          id="name"
          label="Nome da aula:"
          placeholder="Ex: Como utilizar fórmulas"
          register={register}
          icon="tabler:note"
          hasValue={!!watch().name}
          errorMessage={errors.name?.message}
        />

        <EditorCustom
          onChangeValue={(value) =>
            setValue('description', value, { shouldValidate: true })
          }
        />

        <Button
          withIcon
          leftIcon={lesson ? 'fluent:edit-24-regular' : 'tabler:plus'}
          width="fill"
          disabled={!isValid}
        >
          {lesson ? 'Atualizar' : 'Adicionar'}
        </Button>
      </form>
    </ModalDefault>
  );
};
