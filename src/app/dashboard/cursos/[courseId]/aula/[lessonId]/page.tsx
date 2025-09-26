'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Heading } from '@/components/Typography/Heading';
import { Icon } from '@iconify/react';
import ModuleAccordion from '@/components/Accordion/module-accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import Button from '@/components/Button';
import * as React from 'react';
import {
  markLessonCompleted,
  markLessonViewed,
  useCourseById,
  useLessonById,
} from '@/@core/course/service/course.service';

export const dynamic = 'force-dynamic';

type FlatLesson = {
  id: string;
  name: string;
  status?: string;
  moduleId?: string;
  moduleName?: string;
};

export default function Page() {
  const { data: session, status } = useSession();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const router = useRouter();

  const {
    data: courseData,
    isLoading: loadingCourse,
    error: errorCourse,
    mutate: mutateCourse,
  } = useCourseById(courseId, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const {
    data: lessonData,
    isLoading: loadingLesson,
    error: errorLesson,
  } = useLessonById(lessonId, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const modules = courseData?.modules ?? [];

  const flatLessons = React.useMemo<FlatLesson[]>(() => {
    return modules.flatMap((m: any) =>
      (m.lessons ?? []).map((l: any) => ({
        id: l.id,
        name: l.name,
        status: l.status,
        moduleId: m.id,
        moduleName: m.name,
      })),
    );
  }, [modules]);

  const currentIndex = React.useMemo(
    () => flatLessons.findIndex((l) => l.id === lessonId),
    [flatLessons, lessonId],
  );

  const isFirst = currentIndex <= 0;
  const isLast =
    currentIndex === -1 ? true : currentIndex >= flatLessons.length - 1;

  const prevLesson =
    !isFirst && currentIndex > 0 ? flatLessons[currentIndex - 1] : undefined;
  const nextLesson =
    !isLast && currentIndex >= 0 ? flatLessons[currentIndex + 1] : undefined;

  // Navegação
  const goToCourse = () => router.push(`/dashboard/cursos/${courseId}`);
  const goToLesson = (id: string) =>
    router.push(`/dashboard/cursos/${courseId}/aula/${id}`);

  if (status === 'loading' || loadingCourse || loadingLesson) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!session) {
    return <div className="p-4">Não autenticado</div>;
  }

  if (errorCourse || errorLesson) {
    return (
      <div className="p-4 text-red-500">
        {errorCourse
          ? 'Erro ao carregar dados do curso'
          : 'Erro ao carregar dados da aula'}
      </div>
    );
  }

  if (!courseData) {
    return <div className="p-4">Curso não encontrado</div>;
  }

  const { course } = courseData;

  const verifyLessonCompleteOrView = (lessonId: string) => {
    return courseData?.modules.some((module) =>
      module.lessons.some(
        (lesson: any) =>
          lesson.id === lessonId &&
          (lesson.status === 'view' || lesson.status === 'finished'),
      ),
    );
  };

  const NavBar = (
    <div className="mt-4 flex items-center justify-between gap-3">
      <Button
        variant="outlined"
        tone="primary"
        width="hug"
        disabled={isFirst}
        onClick={async () => {
          if (!prevLesson) return;
          if (!verifyLessonCompleteOrView(prevLesson.id)) {
            await markLessonViewed(prevLesson.id);
          }
          goToLesson(prevLesson.id);
        }}
      >
        Voltar aula
      </Button>

      {isLast ? (
        <Button
          tone="primary"
          width="hug"
          onClick={async () => {
            await markLessonCompleted(lessonId);
            await mutateCourse();
            goToCourse();
          }}
        >
          Concluir curso
        </Button>
      ) : (
        <Button
          tone="primary"
          width="hug"
          disabled={!nextLesson}
          onClick={async () => {
            await markLessonCompleted(lessonId);
            await mutateCourse();
            if (nextLesson) goToLesson(nextLesson.id);
          }}
        >
          Avançar aula
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Icon icon="hugeicons:course" className="h-6 w-6 text-primary-200" />
          <Heading type="H1">
            Curso <span className="text-primary-200">{course.name}</span>
          </Heading>
        </div>
        <Heading type="H2" className="text-black-80">
          Confira seu <span className="text-primary-200">progresso</span> e
          continue <span className="text-primary-200">aprendendo</span>!
        </Heading>
      </div>

      <div className="flex flex-col justify-between gap-12 lg:flex-row">
        <div className="w-full max-w-[380px]">
          <div className="flex w-full flex-col gap-3">
            <Button
              withIcon
              leftIcon="tabler:arrow-back-up"
              width="hug"
              variant="outlined"
              className="w-[131px]"
              tone="primary"
              onClick={goToCourse}
            >
              Voltar
            </Button>

            {modules.map((module: any) => (
              <ModuleAccordion
                key={module.id}
                title={module.name}
                lessons={(module.lessons ?? []).map((lesson: any) => ({
                  id: lesson.id,
                  title: lesson.name,
                  status: lesson.status,
                }))}
                lessonSelectedId={lessonId}
                onLessonClick={async (l) => {
                  if (!verifyLessonCompleteOrView(l.id)) {
                    await markLessonViewed(l.id);
                  }
                  router.push(`/dashboard/cursos/${courseId}/aula/${l.id}`);
                }}
                mode="view"
                defaultOpen={(module.lessons ?? []).some(
                  (l: any) => l.id === lessonId,
                )}
                moduleId={module.id}
              />
            ))}
          </div>
        </div>

        <div className="w-full border-l-[1px] border-primary-10 px-6">
          <ScrollArea className="h-[calc(100dvh-180px)] w-full pr-2">
            <Heading type="H1" className="mb-2">
              {(lessonData as any)?.lesson?.name ??
                (lessonData as any)?.name ??
                ''}
            </Heading>

            <div
              className="prose mt-4"
              dangerouslySetInnerHTML={{
                __html:
                  (lessonData as any)?.lesson?.content ??
                  (lessonData as any)?.content ??
                  '',
              }}
            />

            {NavBar}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
