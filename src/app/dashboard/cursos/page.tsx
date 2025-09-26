'use client';

import React from 'react';
import Button from '@/components/Button';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heading } from '@/components/Typography/Heading';
import { ModalCreateCourse } from '@/components/Modals/ModalCreateCourse';
import { CardSession } from '@/components/Cards/card-session';
import { formatMinutes } from '@/app/utils/format-minutes';
import {
  useAdminCourses,
  useMyCourses,
  useRecommendedCourses,
} from '@/@core/course/service/course.service';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [modalCreateCourse, setModalCreateCourse] =
    React.useState<boolean>(false);

  const { items: myCourses } = useMyCourses();

  const { items: recommendedCourses } = useRecommendedCourses();

  const { items: adminCourses } = useAdminCourses('DRAFT', session?.role);

  if (status === 'loading') return <div className="p-4">Carregando...</div>;
  if (!session) return <div className="p-4">Não autenticado</div>;

  return (
    <>
      <div className="flex w-full flex-col gap-12">
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <Heading type="H1">O que você quer aprender hoje?</Heading>
            <Heading type="H2" className="text-black-80">
              Tem sempre algo novo esperando por você
            </Heading>
          </div>

          {session.role === 'ADMIN' && (
            <Button
              withIcon
              leftIcon="tabler:plus"
              className="tablet:w-[220px] w-[190px]"
              onClick={() => setModalCreateCourse(() => true)}
            >
              Novo curso
            </Button>
          )}
        </div>

        {!!adminCourses.length && session?.role === 'ADMIN' && (
          <CardSession
            title="Cursos pendentes de publicação"
            more
            items={adminCourses.map((i) => ({
              imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/upload/${i.cover_key}`,
              imageAlt: i.name,
              title: i.name,
              courseName: `${i.totalLessons} aulas - ${formatMinutes(Number(i.minutes))}`,
              onClick: () => router.push(`/dashboard/cursos/novo/${i.id}`),
              buttonText: 'Revisar curso',
              leftIcon: 'fluent:edit-24-regular',
            }))}
          />
        )}

        {!!myCourses.length && (
          <CardSession
            title="Seus cursos"
            more
            items={myCourses.map((i) => ({
              imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/upload/${i.cover_key}`,
              imageAlt: i.name,
              title: i.name,
              courseName: `${i.totalLessons} aulas - ${formatMinutes(Number(i.minutes))}`,
              onClick: () => router.push(`/dashboard/cursos/${i.id}`),
              buttonText: 'Ver curso',
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

      <ModalCreateCourse
        visible={modalCreateCourse}
        onClose={() => setModalCreateCourse(() => false)}
      />
    </>
  );
}
