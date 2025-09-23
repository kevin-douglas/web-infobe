'use client';

import { useSession } from 'next-auth/react';
import { Heading } from '@/components/Typography/Heading';
import { CardSession } from '@/components/Cards/card-session';
import { useMyCertificates } from '@/@core/course/service/course.service';

export const dynamic = 'force-dynamic';

function formatPtBRDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR');
  } catch {
    return iso;
  }
}

export default function Page() {
  const { data: session, status } = useSession();

  const {
    items: certificates,
    isLoading,
    error,
  } = useMyCertificates({
    revalidateOnFocus: false,
  });

  if (status === 'loading') return <div className="p-4">Carregando...</div>;
  if (!session) return <div className="p-4">Não autenticado</div>;

  const items = (certificates ?? []).map((c) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/upload/${c.cover_key}`;
    return {
      imageUrl: url,
      imageAlt: `Certificado - ${c.course_name}`,
      title: c.course_name,
      courseName: `Emitido em ${formatPtBRDate(c.issued_at)}`,
      onClick: () => window.open(url, '_blank'),
      buttonText: 'Ver certificado',
    };
  });

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <Heading type="H1">Meus certificados</Heading>
        <Heading type="H2" className="text-black-80">
          Tudo explicadinho, do seu jeito
        </Heading>
      </div>

      {/* feedbacks (opcionais) */}
      {isLoading && (
        <div className="grid gap-6">
          <div className="h-6 w-64 animate-pulse rounded bg-black/10" />
          <div className="h-40 w-full animate-pulse rounded-xl bg-black/10" />
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500">
          Não foi possível carregar seus certificados.
        </div>
      )}

      {!!items.length && <CardSession items={items} loadAll />}

      {!isLoading && !items.length && (
        <div className="text-sm text-black-80">
          Você ainda não possui certificados.
        </div>
      )}
    </div>
  );
}
