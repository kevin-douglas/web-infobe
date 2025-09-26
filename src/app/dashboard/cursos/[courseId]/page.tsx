'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Heading } from '@/components/Typography/Heading';
import { Paragraph } from '@/components/Typography/Paragraph';
import ProgressAnimation from '@/components/Progress/progress-animation';
import { Icon } from '@iconify/react';
import ModuleAccordion from '@/components/Accordion/module-accordion';
import {
  markLessonViewed,
  useCourseById,
} from '@/@core/course/service/course.service';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { data: session, status } = useSession();
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const {
    data: courseData,
    isLoading,
    error,
  } = useCourseById(courseId, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (status === 'loading' || isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!session) {
    return <div className="p-4">Não autenticado</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Erro ao carregar dados do curso</div>
    );
  }

  if (!courseData) {
    return <div className="p-4">Curso não encontrado</div>;
  }

  const { course, modules, summary } = courseData;

  const firstViewingLessonId = modules?.[0]?.lessons.find(
    (l) => l.status === 'view',
  )?.id;

  const verifyHasLessonCompleted = (modId: string) => {
    const mod = modules.find((m) => m.id === modId);
    if (!mod) return false;
    return mod.lessons.some(
      (lesson) => lesson.status === 'view' || lesson.status === 'finished',
    );
  };

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
        <div className="flex w-full flex-col gap-3 lg:max-w-[830px]">
          {modules.map((module) => (
            <ModuleAccordion
              key={module.id}
              title={module.name}
              statusLabel={
                module.finished
                  ? 'Finalizado'
                  : verifyHasLessonCompleted(module.id)
                    ? 'Em progresso'
                    : 'Não iniciado'
              }
              lessons={module.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.name,
                status: lesson.status,
              }))}
              onLessonClick={async (l) => {
                await markLessonViewed(l.id);
                router.push(`/dashboard/cursos/${courseId}/aula/${l.id}`);
              }}
              mode="view"
              moduleId={module.id}
            />
          ))}
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="w-full rounded-[12px] border-[3px] border-dashed p-6 lg:max-w-[380px] lg:self-start">
            <div className="flex flex-col gap-3">
              <Heading type="H3" className="text-center">
                Progresso
              </Heading>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <Paragraph type="P2" className="text-primary-200">
                      {summary.completedLessons}/{summary.totalLessons} aulas
                    </Paragraph>
                    <Paragraph type="P2" className="text-black-80">
                      {summary.completedLessons === summary.totalLessons
                        ? 'Concluído'
                        : 'Em progresso'}
                    </Paragraph>
                  </div>

                  <ProgressAnimation
                    value={Math.round(
                      (summary.completedLessons / summary.totalLessons) * 100,
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-[12px] border-[3px] border-dashed p-6 lg:max-w-[380px] lg:self-start">
            <div className="flex flex-col gap-3">
              <Heading type="H3" className="text-center">
                Últimas aulas
              </Heading>

              <div className="flex flex-col gap-3">
                {courseData.recentLessons.map((lesson) => (
                  <div className="flex flex-col gap-2" key={lesson.id}>
                    <div className="flex items-center justify-between gap-2">
                      <Paragraph type="P2" className="text-primary-200">
                        {lesson.name}
                      </Paragraph>
                      <Paragraph type="P2" className="text-black-80">
                        {lesson.percent}%
                      </Paragraph>
                    </div>

                    <ProgressAnimation value={lesson.percent} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
