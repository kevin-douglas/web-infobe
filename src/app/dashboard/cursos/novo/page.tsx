'use client';

import Button from '@/components/Button';
import { DragAndDropImage } from '@/components/Form/DragAndDropImage';
import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { Heading } from '@/components/Typography/Heading';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';

export default function NovoCursoPage() {
  const { register } = useForm();
  return (
    <section className="flex h-full w-full flex-col gap-12">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <Icon
            icon="hugeicons:course"
            className="min-h-6 min-w-6 text-primary-200"
          />

          <Heading type="H1" className="text-black-100">
            Novo curso
          </Heading>
        </div>

        <Heading type="H2" className="text-black-80">
          Adicione novos cursos à plataforma
        </Heading>
      </div>

      <form className="flex h-full w-full flex-col gap-12 md:flex-row-reverse">
        <div className="flex w-full flex-col gap-6 md:max-w-[380px]">
          <InputDefault
            id="course_name"
            label="Nome do curso:"
            placeholder="Digite o nome do curso..."
            register={register}
            icon="hugeicons:course"
          />

          <DragAndDropImage />

          <Button withIcon leftIcon="material-symbols:check" width="fill">
            Cadastrar curso
          </Button>
        </div>

        <div className="flex h-full w-full flex-col bg-red-400">
          <p>21</p>
        </div>
      </form>
    </section>
  );
}
