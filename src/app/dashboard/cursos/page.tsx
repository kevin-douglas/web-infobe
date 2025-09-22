'use client';

import Button from '@/components/Button';
import ModuleAccordion from '@/components/Accordion/module-accordion';

import { useSession } from 'next-auth/react';
import { CardSession } from '@/components/Cards/card-session';
import { Heading } from '@/components/Typography/Heading';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === 'loading') {
    return <div className="p-4">Carregando...</div>;
  }

  if (!session) {
    return <div className="p-4">Não autenticado</div>;
  }

  const items = [
    {
      imageUrl: 'https://placehold.co/600x400.png',
      imageAlt: 'Planilha de Excel aberta em um notebook',
      title: 'Aula 04 - Como utilizar fórmulas',
      courseName: 'Curso de Excel básico',
    },
    {
      imageUrl: 'https://placehold.co/600x400.png',
      imageAlt: 'Planilha de Excel aberta em um notebook',
      title: 'Aula 04 - Como utilizar fórmulas',
      courseName: 'Curso de Excel básico',
    },
    {
      imageUrl: 'https://placehold.co/600x400.png',
      imageAlt: 'Planilha de Excel aberta em um notebook',
      title: 'Aula 04 - Como utilizar fórmulas',
      courseName: 'Curso de Excel básico',
    },
  ];

  return (
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
            onClick={() => router.push('/dashboard/cursos/novo')}
          >
            Novo curso
          </Button>
        )}
      </div>
      <CardSession items={items} title="Seus cursos" more />
      <CardSession items={items} title="Cursos recomendados" more />
      <div className="mx-auto w-full p-6">
        <ModuleAccordion
          title="Módulo 2 - Excel básico"
          statusLabel="Finalizado"
          lessons={[
            {
              id: '1',
              title: 'Aula #01 - O que são planilhas',
              status: 'finished',
            },
            {
              id: '2',
              title: 'Aula #02 - O que são planilhas',
              status: 'finished',
            },
            {
              id: '3',
              title: 'Aula #03 - O que são planilhas',
              status: 'view',
            },
          ]}
          lessonSelectedId="3"
          onLessonClick={(l) => console.log('Abrir aula: ', l)}
          mode="edit"
          moduleId="module-1"
        />
      </div>
    </div>
  );
}
