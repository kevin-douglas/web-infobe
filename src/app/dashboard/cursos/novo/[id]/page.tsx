'use client';

import React from 'react';
import Button from '@/components/Button';

import { InputDefault } from '@/components/Form/Inputs/InputDefault';
import { ModalCreateLesson } from '@/components/Modals/ModalCreateLesson';
import { Heading } from '@/components/Typography/Heading';
import { api } from '@/service/index.service';
import { Icon } from '@iconify/react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ModalCreateModule } from '@/components/Modals/ModalCreateModule';

import ModuleAccordion, {
  Lesson,
} from '@/components/Accordion/module-accordion';

interface CourseId {
  course: {
    id: string;
    name: string;
    cover_key: string;
    created_at: string;
    updated_at: string;
    cover_url: string;
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

export default function NovoCursoPage() {
  const { id } = useParams();
  const { register } = useForm();

  const [modalCreateClassroom, setModalCreateClassroom] =
    React.useState<boolean>(false);
  const [modalCreateModule, setModalCreateModule] =
    React.useState<boolean>(false);

  const [course, setCourse] = React.useState<CourseId>();
  const [modules, setModules] = React.useState<CourseId['modules']>([]);

  const [lessonModule, setLessonModule] = React.useState<LessonModule>();

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
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const patchCourseStatus = async () => {
    try {
      await api.patch('/course/' + id + '/publish');
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
                Novo curso
              </Heading>
            </div>

            <Heading type="H2" className="text-black-80">
              Adicione novos cursos à plataforma
            </Heading>
          </div>

          <Button
            withIcon
            leftIcon="material-symbols:check"
            className="tablet:w-[220px] w-[190px]"
            onClick={() => patchCourseStatus()}
          >
            Publicar
          </Button>
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

            {/* <DragAndDropImage /> */}

            <Button withIcon leftIcon="fluent:edit-24-regular" width="fill">
              Atualizar curso
            </Button>
          </div>

          <div className="flex h-full w-full flex-col gap-4">
            {modules.length === 0 && (
              <div className="flex h-[363px] w-full items-center justify-center gap-6 rounded-2xl border border-dashed border-primary-20 bg-alpha-primary-100">
                <Heading type="H2" className="text-primary-100">
                  Os módulos aparecerão aqui
                </Heading>
              </div>
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
