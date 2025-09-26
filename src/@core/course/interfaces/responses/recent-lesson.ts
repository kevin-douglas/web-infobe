export interface RecenteLessonsItem {
  lesson_id: string;
  lesson_name: string;
  course_id: string;
  course_name: string;
  cover_key: string;
  percent: number;
  updated_at: string;
}

export type RecenteLessonsResponse = RecenteLessonsItem[];
