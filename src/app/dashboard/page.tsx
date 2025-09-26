'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/Typography/Heading';
import { CardSession } from '@/components/Cards/card-session';
import { formatMinutes } from '@/app/utils/format-minutes';
import {
  useRecentLessons,
  useRecommendedCourses,
} from '@/@core/course/service/course.service';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { items: recentLessons } = useRecentLessons();

  const { items: recommendedCourses } = useRecommendedCourses();

  if (status === 'loading') return <div className="p-4">Carregando...</div>;
  if (!session) return <div className="p-4">Não autenticado</div>;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Heading type="H1">
          👋 Olá, <span className="text-primary-200">{session.user?.name}</span>
          ! Vamos continuar aprendendo?
        </Heading>
        <Heading type="H2" className="text-black-80">
          Você está indo muito bem!
        </Heading>
      </div>

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
            courseName: `${i.totalLessons} aulas - ${formatMinutes(Number(i.minutes))}`,
            onClick: () => router.push(`/dashboard/cursos/${i.id}`),
            buttonText: 'Ver curso',
          }))}
        />
      )}
    </div>
  );
}
