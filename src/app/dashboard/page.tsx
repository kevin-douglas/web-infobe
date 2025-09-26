'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/Typography/Heading';
import { CardSession } from '@/components/Cards/card-session';
import {
  useRecentLessons,
  useRecommendedCourses,
} from '@/@core/course/service/course.service';
import { NoContent } from '@/components/NoContent/no-content';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { items: recentLessons, isLoading: isLoadingRecenteLessons } =
    useRecentLessons();

  const { items: recommendedCourses, isLoading: isLoadingRecommendedCourses } =
    useRecommendedCourses();

  if (status === 'loading') return <div className="p-4">Carregando...</div>;
  if (!session) return <div className="p-4">Não autenticado</div>;

  const notHaveContent =
    !recentLessons.length &&
    !recommendedCourses.length &&
    !isLoadingRecenteLessons &&
    !isLoadingRecommendedCourses;

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Heading type="H1">
          👋 Olá, <span className="text-primary-200">{session.user?.name}</span>
          ! Vamos continuar aprendendo?
        </Heading>
        <Heading type="H2" className="text-black-80">
          Você está indo muito bem!
        </Heading>
      </div>

      {notHaveContent && (
        <NoContent message="Estamos preparando novos cursos para você!" />
      )}

      {!!recentLessons.length && (
        <CardSession
          title="Últimas aulas vistas"
          items={recentLessons.map((i) => ({
            imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/upload/${i.cover_key}`,
            imageAlt: i.lesson_name,
            title: i.lesson_name,
            courseName: i.course_name,
            onClick: () =>
              router.push(
                `/dashboard/cursos/${i.course_id}/aula/${i.lesson_id}`,
              ),
          }))}
        />
      )}

      {!!recommendedCourses.length && (
        <CardSession
          title="Cursos recomendados"
          more
          items={recommendedCourses.map((i) => ({
            imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/upload/${i.cover_key}`,
            imageAlt: i.name,
            title: i.name,
            courseName: `${i.totalLessons} aulas`,
            onClick: () => router.push(`/dashboard/cursos/${i.id}`),
            buttonText: 'Ver curso',
          }))}
        />
      )}
    </div>
  );
}
