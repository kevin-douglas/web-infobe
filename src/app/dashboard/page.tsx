'use client';

import { useSession } from 'next-auth/react';
import { CardSession } from '@/components/Cards/card-session';
import { Heading } from '@/components/Typography/Heading';

export const dynamic = 'force-dynamic';

export default function Page() {
  const { data: session, status } = useSession();
  console.log(session);
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
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Heading type="H1">
          👋 Olá, <span className="text-primary-200">{session.user.name}</span>!
          Vamos continuar aprendendo?
        </Heading>
        <Heading type="H2" className="text-black-80">
          Você está indo muito bem!
        </Heading>
      </div>
      <CardSession items={items} title="Últimas aulas vistas" more />
      <CardSession items={items} title="Cursos recomendados" />
    </div>
  );
}
