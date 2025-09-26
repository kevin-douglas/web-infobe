// @/core/course/service/course.swr.ts
'use client';

import useSWR, { type SWRConfiguration } from 'swr';
import { api } from '@/service/index.service';

import type { CourseResponse } from '@/@core/course/interfaces/responses/course-detail';
import type { LessonResponse } from '@/@core/course/interfaces/responses/lesson';
import type {
  RecenteLessonsItem,
  RecenteLessonsResponse,
} from '@/@core/course/interfaces/responses/recent-lesson';
import type {
  RecommendedCourseItem,
  RecommendedCourseResponse,
} from '@/@core/course/interfaces/responses/recommended-course';
import type {
  MyCertificateItem,
  MyCertificatesResponse,
} from '@/@core/course/interfaces/responses/certificates';
import type { AxiosRequestConfig } from 'axios';

const swrApiFetcher = async <T>(url: string): Promise<T> => {
  const res = await api.get<T>(url);
  return res.data;
};

export const swrApiPost = async <T = never, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const res = await api.post<T>(url, body, config);
  return res.data;
};

const keys = {
  course: (id: string) => ['course', id] as const,
  lesson: (id: string) => ['lesson', id] as const,
  recentLessons: ['course', 'user', 'recent-lessons'] as const,
  recommendedCourses: ['course', 'user', 'recommended'] as const,
  myCourses: ['course', 'user', 'my-courses'] as const,
  myCertificates: ['course', 'user', 'my-certificates'] as const,
  adminCoureses: ['course', 'admin', 'all'] as const,
};

export function useCourseById(
  id?: string,
  config?: SWRConfiguration<CourseResponse>,
) {
  const key = id ? keys.course(id) : null;
  const { data, error, isLoading, mutate } = useSWR<CourseResponse>(
    key,
    () => swrApiFetcher<CourseResponse>(`/course/${id}`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );
  return { data, error, isLoading, mutate };
}

export function useLessonById(
  id?: string,
  config?: SWRConfiguration<LessonResponse>,
) {
  const key = id ? keys.lesson(id) : null;
  const { data, error, isLoading, mutate } = useSWR<LessonResponse>(
    key,
    () => swrApiFetcher<LessonResponse>(`/lesson/${id}`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );
  return { data, error, isLoading, mutate };
}

export function useRecentLessons(
  config?: SWRConfiguration<RecenteLessonsResponse>,
) {
  const { data, error, isLoading, mutate } = useSWR<RecenteLessonsResponse>(
    keys.recentLessons,
    () => swrApiFetcher<RecenteLessonsResponse>(`/course/user/recent-lessons`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );

  const items = (data ?? []) as RecenteLessonsItem[];
  return { data, items, error, isLoading, mutate };
}

export function useRecommendedCourses(
  config?: SWRConfiguration<RecommendedCourseResponse>,
) {
  const { data, error, isLoading, mutate } = useSWR<RecommendedCourseResponse>(
    keys.recommendedCourses,
    () => swrApiFetcher<RecommendedCourseResponse>(`/course/user/recommended`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );

  const items = (data ?? []) as RecommendedCourseItem[];
  return { data, items, error, isLoading, mutate };
}

export function useMyCourses(
  config?: SWRConfiguration<RecommendedCourseResponse>,
) {
  const { data, error, isLoading, mutate } = useSWR<RecommendedCourseResponse>(
    keys.myCourses,
    () => swrApiFetcher<RecommendedCourseResponse>(`/course/user/my-courses`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );

  const items = (data ?? []) as RecommendedCourseItem[];
  return { data, items, error, isLoading, mutate };
}

export function useMyCertificates(
  config?: SWRConfiguration<MyCertificatesResponse>,
) {
  const { data, error, isLoading, mutate } = useSWR<MyCertificatesResponse>(
    keys.myCertificates,
    () => swrApiFetcher<MyCertificatesResponse>(`/certificate/my-certificates`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );

  const items = (data ?? []) as MyCertificateItem[];
  return { data, items, error, isLoading, mutate };
}

export function useAdminCourses(
  status?: 'DRAFT' | 'PUBLISHED',
  role: string = 'USER',
  config?: SWRConfiguration<RecommendedCourseResponse>,
) {
  const query = status ? `?status=${status}` : '';

  const isAdmin = role === 'ADMIN';

  const { data, error, isLoading, mutate } = useSWR<RecommendedCourseResponse>(
    isAdmin
      ? status
        ? [...keys.adminCoureses, status]
        : keys.adminCoureses
      : null,
    () => swrApiFetcher<RecommendedCourseResponse>(`/course/admin/all${query}`),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...config,
    },
  );

  const items = (data ?? []) as RecommendedCourseItem[];

  if (!isAdmin) {
    return {
      data: undefined,
      items: [],
      error: undefined,
      isLoading: false,
      mutate: () => {},
    };
  }

  return { data, items, error, isLoading, mutate };
}

export async function markLessonViewed(id: string) {
  return swrApiPost(`/lesson/${id}/view`);
}

export async function markLessonCompleted(id: string) {
  return swrApiPost(`/lesson/${id}/complete`);
}

export async function generateCertificate(id: string) {
  return swrApiPost(`/certificate/issue`, {
    course_id: id,
  });
}
