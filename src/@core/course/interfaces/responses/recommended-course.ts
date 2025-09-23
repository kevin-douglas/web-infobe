export interface RecommendedCourseItem {
  id: string;
  name: string;
  cover_key: string;
  totalLessons: number;
  minutes: string;
  cover_url: string;
  progress?: number;
}

export type RecommendedCourseResponse = RecommendedCourseItem[];
