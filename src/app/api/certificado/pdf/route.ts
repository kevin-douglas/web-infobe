import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const token = searchParams.get('token');
  const customUrl = searchParams.get('url');

  if (!id) {
    return NextResponse.json(
      { error: 'ID do certificado é obrigatório' },
      { status: 400 },
    );
  }

  // VERIFICA SE EXISTE O CERTIFICADO COM ESSE ID
  const checkCertificate = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/certificate/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (checkCertificate.status !== 200) {
    return NextResponse.json(
      { error: 'Certificado não encontrado ou acesso negado' },
      { status: 404 },
    );
  }

  let browser;

  try {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_PUBLIC_BROWSER_URL) {
        browser = await puppeteer.connect({
          browserWSEndpoint: process.env.NEXT_PUBLIC_BROWSER_URL,
        });
      } else {
        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
          ],
        });
      }
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-default-apps',
          '--no-first-run',
          '--disable-background-timer-throttling',
          '--disable-renderer-backgrounding',
        ],
      });
    }

    const page = await browser.newPage();

    if (token) {
      await page.evaluateOnNewDocument((token) => {
        localStorage.setItem('accessToken', token);
      }, token);
    }

    const certificateUrl =
      customUrl ||
      `${process.env.NEXT_PUBLIC_BASE_URL}/certificado/${id}?token=${token}`;

    try {
      await page.setViewport({ width: 1200, height: 800 });

      await page.goto(certificateUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Erro ao definir viewport ou navegar:', error);
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await page.waitForSelector('#pdf-element', { timeout: 10000 });
    } catch (error) {
      throw error;
    }

    await page.waitForFunction(
      () => {
        const element = document.querySelector('#pdf-element');
        if (!element) return false;

        const text = element.textContent || '';
        return text.length > 50 && !text.includes('Carregando...');
      },
      { timeout: 8000, polling: 500 },
    );

    const element = await page.$('#pdf-element');
    if (!element) {
      const url = await page.url();
      throw new Error(`Elemento #pdf-element não encontrado. URL: ${url}`);
    }

    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      preferCSSPageSize: false,
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    await browser.close();

    // @ts-expect-error
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=certificado-${id}.pdf`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Erro ao fechar browser:', closeError);
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar PDF' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, token } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do certificado é obrigatório' },
        { status: 400 },
      );
    }

    const url = new URL('/api/certificado/pdf', request.url);
    url.searchParams.set('id', id);
    if (token) {
      url.searchParams.set('token', token);
    }

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Erro ao processar requisição POST:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 400 },
    );
  }
}
