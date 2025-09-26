export interface MyCertificateItem {
  id: string;
  course_name: string;
  issued_at: string;
  certificate_key: string;
  total_duration_minutes: string;
  cover_key: string;
}

export type MyCertificatesResponse = MyCertificateItem[];
