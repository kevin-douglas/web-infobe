import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'ID do certificado é obrigatório' },
      { status: 400 },
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Token de autorização é obrigatório' },
      { status: 401 },
    );
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/certificate/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const certificateData = response.data;

    if (
      !certificateData.user_name ||
      !certificateData.user_cpf ||
      !certificateData.course_name ||
      !certificateData.issued_at
    ) {
      return NextResponse.json(
        { error: 'Dados do certificado incompletos' },
        { status: 422 },
      );
    }

    return NextResponse.json(certificateData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: 'Token inválido ou expirado' },
          { status: 401 },
        );
      }

      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Certificado não encontrado' },
          { status: 404 },
        );
      }

      if (error.response?.status === 403) {
        return NextResponse.json(
          { error: 'Acesso negado ao certificado' },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
