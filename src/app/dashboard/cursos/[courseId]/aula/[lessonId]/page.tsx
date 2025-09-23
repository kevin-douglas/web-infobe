'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Heading } from '@/components/Typography/Heading';
import { Icon } from '@iconify/react';
import ModuleAccordion from '@/components/Accordion/module-accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import Button from '@/components/Button';
import {
  useCourseById,
  useLessonById,
} from '@/@core/course/service/course.service';

export const dynamic = 'force-dynamic';

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

  const { course, modules } = courseData;

  const firstViewingLessonId = modules?.[0]?.lessons.find(
    (l) => l.status === 'view',
  )?.id;

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
        {/* Sidebar de módulos/lessons */}
        <div className="w-full max-w-[380px]">
          <div className="flex w-full flex-col gap-3">
            <Button
              withIcon
              leftIcon="tabler:arrow-back-up"
              width="hug"
              variant="outlined"
              className="w-[131px]"
              tone="primary"
              onClick={() => router.push(`/dashboard/cursos/${courseId}`)}
            >
              Voltar
            </Button>

            {modules.map((module) => (
              <ModuleAccordion
                key={module.id}
                title={module.name}
                lessons={module.lessons.map((lesson) => ({
                  id: lesson.id,
                  title: lesson.name,
                  status: lesson.status,
                }))}
                lessonSelectedId={firstViewingLessonId}
                onLessonClick={(l) =>
                  router.push(`/dashboard/cursos/${courseId}/aula/${l.id}`)
                }
                mode="view"
                moduleId={module.id}
              />
            ))}
          </div>
        </div>

        <div className="w-full border-l-[1px] border-primary-10 px-6">
          <ScrollArea className="h-[calc(100dvh-180px)] w-full">
            <Heading type="H1" className="mb-4">
              {lessonData?.name ?? lessonData?.name}
            </Heading>

            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html:
                  (lessonData as any)?.lesson?.content ??
                  lessonData?.content ??
                  '',
              }}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
