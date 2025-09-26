import { NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';

interface CreateSessionData {
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  accessToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateSessionData = await request.json();

    const secret = process.env.NEXTAUTH_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: 'NEXTAUTH_SECRET não configurado' },
        { status: 500 },
      );
    }

    // Criar o token JWT manualmente
    const token = await encode({
      token: {
        sub: data.email, // subject (identificador único)
        name: data.name,
        email: data.email,
        role: data.role,
        accessToken: data.accessToken,
        iat: Math.floor(Date.now() / 1000), // issued at
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2, // expires in 2 days
      },
      secret,
    });

    // Criar resposta com cookie da sessão
    const response = NextResponse.json({ success: true });

    response.cookies.set(
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 2, // 2 dias
        path: '/',
      },
    );

    return response;
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
