'use client';

import React from 'react';
import Button from '@/components/Button';

import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { ModalCreateLesson } from '@/components/Modals/ModalCreateLesson';
import { Heading } from '@/components/Typography/Heading';
import { api } from '@/service/index.service';
import { Icon } from '@iconify/react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ModalCreateModule } from '@/components/Modals/ModalCreateModule';
import { DragAndDropImage } from '@/components/Form/DragAndDropImage';
import { CreateCourseForm } from '@/components/Modals/ModalCreateCourse/create-course.validation';
import { zodResolver } from '@hookform/resolvers/zod';

import ModuleAccordion, {
  Lesson,
} from '@/components/Accordion/module-accordion';
import { NoContent } from '@/components/NoContent/no-content';

interface CourseId {
  course: {
    id: string;
    name: string;
    cover_key: string;
    created_at: string;
    updated_at: string;
    cover_url: string;
    status: 'DRAFT' | 'PUBLISHED';
  };
  modules: {
    name: string;
    id: string;
    lessons: { id: string; status: Lesson['status']; name: string }[];
  }[];
  summary: {
    totalLessons: number;
    viewedLessons: number;
    completedLessons: number;
  };
  recentLessons: [];
}

interface LessonModule {
  module_id: string;
  lesson?: Lesson;
}

async function urlToFile(url: string, filename?: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  const mimeType = blob.type;
  const extension = mimeType.split('/')[1] || 'png';

  return new File([blob], filename ?? `file.${extension}`, { type: mimeType });
}

export default function NovoCursoPage() {
  const { id } = useParams();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(CreateCourseForm),
  });

  const router = useRouter();

  const lastSubmitted = React.useRef(getValues());

  const values = watch();

  const hasChangedSinceSubmit =
    JSON.stringify(values) !== JSON.stringify(lastSubmitted.current);

  const [modalCreateClassroom, setModalCreateClassroom] =
    React.useState<boolean>(false);
  const [modalCreateModule, setModalCreateModule] =
    React.useState<boolean>(false);

  const [course, setCourse] = React.useState<CourseId>();
  const [modules, setModules] = React.useState<CourseId['modules']>([]);

  const [lessonModule, setLessonModule] = React.useState<LessonModule>();

  const isPublished = course?.course.status === 'PUBLISHED';

  const openModalCreateLesson = (module_id: string, lesson?: Lesson) => {
    setLessonModule(() => ({
      module_id: module_id,
      lesson: lesson,
    }));
    setModalCreateClassroom(() => true);
  };

  const updateLesson = (isAdd: boolean, lesson: Lesson, moduleId: string) => {
    const newLesson = { ...lesson, name: lesson.title };

    setModules((prevModules) =>
      prevModules.map((module) => {
        if (module.id !== moduleId) return module;

        const exists = module.lessons.some((l) => l.id === lesson.id);

        return {
          ...module,
          lessons: isAdd
            ? exists
              ? module.lessons.map((l) => (l.id === lesson.id ? newLesson : l))
              : [...module.lessons, newLesson]
            : module.lessons.filter((l) => l.id !== lesson.id),
        };
      }),
    );

    if (!isAdd) {
      setLessonModule(undefined);
    }

    setModalCreateClassroom(false);
  };

  const getCourseById = async () => {
    try {
      const { data } = await api.get('/course/' + id);

      if (data) {
        setCourse(() => data);
        setModules(() => data.modules);

        setValue('course_name', data.course.name);

        const getFile = await urlToFile(
          process.env.NEXT_PUBLIC_API_URL + '/upload/' + data.course.cover_key,
        );

        if (getFile) setValue('file', getFile);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const patchCourse = async () => {
    try {
      lastSubmitted.current = watch();

      let cover_key = course?.course.cover_key || '';

      if (watch().editable) {
        const formData = new FormData();

        formData.append('file', watch().file);
        formData.append('type', 'COVER');

        const { data } = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        cover_key = data.key;
      }

      await api.patch('/course/' + id, {
        name: watch().course_name,
        cover_key,
      });
    } catch (err) {
      console.log({ err });
    }
  };

  const patchCourseStatus = async () => {
    try {
      await api.patch('/course/' + id + '/publish');
      router.push('/dashboard/cursos/' + id);
    } catch (err) {
      console.log({ err });
    }
  };

  React.useEffect(() => {
    getCourseById();
  }, []);

  return (
    <>
      <section className="flex h-full w-full flex-col gap-12">
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row md:items-center">
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center gap-2">
              <Icon
                icon="hugeicons:course"
                className="min-h-6 min-w-6 text-primary-200"
              />

              <Heading type="H1" className="text-black-100">
                {isPublished ? 'Editando' : 'Novo'}{' '}
                <span className="text-primary-200">curso</span>
              </Heading>
            </div>

            <Heading type="H2" className="text-black-80">
              {isPublished
                ? 'Modifique os detalhes deste curso'
                : 'Adicione novos cursos à plataforma'}
            </Heading>
          </div>

          {!isPublished && (
            <Button
              withIcon
              leftIcon="material-symbols:check"
              className="tablet:w-[220px] w-[190px]"
              onClick={() => patchCourseStatus()}
            >
              Publicar
            </Button>
          )}
        </div>

        <form
          className="flex h-full w-full flex-col gap-12 md:flex-row-reverse"
          onSubmit={handleSubmit(patchCourse)}
        >
          <div className="flex w-full flex-col gap-6 md:max-w-[380px]">
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
              setFile={(newFile) => {
                if (newFile)
                  setValue('file', newFile, { shouldValidate: true });

                setValue('editable', true);
              }}
            />

            <Button
              withIcon
              leftIcon="fluent:edit-24-regular"
              width="fill"
              disabled={!isValid || !hasChangedSinceSubmit}
            >
              Atualizar curso
            </Button>
          </div>

          <div className="flex h-full w-full flex-col gap-4">
            {modules.length === 0 && (
              <NoContent message="Os módulos aparecerão aqui" />
            )}
            {modules.map((module) => (
              <ModuleAccordion
                key={module.id}
                title={module.name}
                lessons={module.lessons.map((lesson) => ({
                  ...lesson,
                  title: lesson.name,
                }))}
                onAddLessonClick={() => openModalCreateLesson(module.id)}
                // onDeleteClick={() => }
                onEditClick={(lesson) =>
                  openModalCreateLesson(module.id, lesson)
                }
                mode="edit"
                moduleId={module.id}
              />
            ))}

            <Button
              tone="neutral"
              variant="outlined"
              width="fill"
              leftIcon="tabler:plus"
              withIcon
              type="button"
              onClick={() => setModalCreateModule(() => true)}
            >
              Novo módulo
            </Button>
          </div>
        </form>
      </section>

      <ModalCreateLesson
        visible={modalCreateClassroom}
        onClose={() => {
          setModalCreateClassroom(() => false);
          setLessonModule(() => undefined);
        }}
        lesson={lessonModule?.lesson}
        onSuccess={updateLesson}
        module_id={lessonModule?.module_id || ''}
      />

      <ModalCreateModule
        visible={modalCreateModule}
        onClose={() => setModalCreateModule(() => false)}
        onSuccess={(module) => {
          if (course) setModules((old) => [...old, { ...module, lessons: [] }]);
          setModalCreateModule(() => false);
        }}
      />
    </>
  );
}
