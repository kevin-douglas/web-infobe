'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface CertificateApiResponse {
  id: string;
  user_name: string;
  user_cpf: string;
  course_name: string;
  cover_key: string;
  issued_at: string;
  certificate_key: string;
  total_duration_minutes: string;
}

interface CertificateData {
  studentName: string;
  cpf: string;
  courseName: string;
  issueDate: string;
}

export default function CertificatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  const tokenFromUrl = searchParams.get('token');
  const accessToken = tokenFromUrl || session?.accessToken;

  const [dataLoaded, setDataLoaded] = useState(false);

  const formatCPF = (cpf: string): string => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        if (!accessToken) {
          setCertificateData({
            studentName: 'João da Silva',
            cpf: '123.456.789-00',
            courseName: 'Curso de Teste',
            issueDate: formatDate(new Date().toISOString()),
          });
          setDataLoaded(true);
          return;
        }

        const response = await fetch(`/api/certificado/${params.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Certificado não encontrado');
        }

        const apiData: CertificateApiResponse = await response.json();

        const formattedData: CertificateData = {
          studentName: apiData.user_name,
          cpf: formatCPF(apiData.user_cpf),
          courseName: apiData.course_name,
          issueDate: formatDate(apiData.issued_at),
        };

        setCertificateData(formattedData);
        setDataLoaded(true);
      } catch (error) {
        setCertificateData({
          studentName: 'João da Silva',
          cpf: '123.456.789-00',
          courseName: 'Curso de Teste',
          issueDate: formatDate(new Date().toISOString()),
        });
        setDataLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCertificateData();
    }
  }, [params.id, accessToken, tokenFromUrl, session]);

  useEffect(() => {
    if (dataLoaded && certificateData) {
      setTimeout(() => {
        const element = document.getElementById('pdf-element');
      }, 100);
    }
  }, [dataLoaded, certificateData]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!certificateData) {
    return <div>Certificado não encontrado</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="pdf-element"
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: '#d6d7ff',
          padding: '24px',
          boxSizing: 'border-box',
          display: 'flex',
          margin: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            flexGrow: 1,
            background: '#ffffff',
            backgroundImage: 'url(/images/bg-pattern.png)',
            backgroundPosition: 'left top',
            backgroundSize: '408px 204px',
            backgroundRepeat: 'repeat',
            padding: '48px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '48px',
              right: '48px',
              padding: '0px 0px 0px 597px',
              width: '698px',
              color: '#5b5dff',
              fontFamily:
                '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            InfoBe
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              width: '600px',
            }}
          >
            <p
              style={{
                flexShrink: 0,
                lineHeight: '22px',
                letterSpacing: '0',
                color: '#474747',
                fontFamily:
                  '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                margin: 0,
              }}
            >
              Certificamos que o aluno
            </p>

            <p
              style={{
                flexShrink: 0,
                lineHeight: '27px',
                letterSpacing: '0',
                color: '#5b5dff',
                fontFamily:
                  '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                margin: 0,
              }}
            >
              {certificateData.studentName}
            </p>

            <p
              style={{
                flexShrink: 0,
                alignSelf: 'stretch',
                textAlign: 'center',
                letterSpacing: '0',
                color: '#000000',
                fontSize: '14px',
                margin: 0,
              }}
            >
              <span
                style={{
                  letterSpacing: '0',
                  color: '#474747',
                  fontFamily:
                    '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                  fontSize: '14px',
                }}
              >
                portador do CPF{' '}
              </span>
              <span
                style={{
                  letterSpacing: '0',
                  color: '#2e2e2e',
                  fontFamily:
                    '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {certificateData.cpf}
                <br />
              </span>
              <span
                style={{
                  letterSpacing: '0',
                  color: '#474747',
                  fontFamily:
                    '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                  fontSize: '14px',
                }}
              >
                concluiu com êxito o curso{' '}
              </span>
              <span
                style={{
                  letterSpacing: '0',
                  color: '#2e2e2e',
                  fontFamily:
                    '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {certificateData.courseName}
              </span>
            </p>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '48px',
              left: '48px',
              color: '#474747',
              fontFamily:
                '"Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimHei, Arial, Helvetica, sans-serif',
              fontSize: '12px',
            }}
          >
            Emitido em: {certificateData.issueDate}
          </div>
        </div>
      </div>
    </div>
  );
}
