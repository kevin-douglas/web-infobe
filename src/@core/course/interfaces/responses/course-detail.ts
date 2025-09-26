export interface CourseResponse {
  course: Course;
  modules: Module[];
  summary: Summary;
  recentLessons: RecentLesson[];
}

export interface Course {
  id: string;
  name: string;
  cover_key: string;
  created_at: string;
  updated_at: string;
  cover_url: string;
}

export interface Module {
  id: string;
  name: string;
  finished: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
  minutes: number;
  status: 'finished' | 'view' | 'not_started';
  percent: number;
}

export interface Summary {
  totalLessons: number;
  viewedLessons: number;
  completedLessons: number;
}

export interface RecentLesson {
  id: string;
  name: string;
  percent: number;
  updated_at: string;
}
