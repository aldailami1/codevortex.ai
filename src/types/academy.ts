/**
 * CloudForge Academy — Domain Types
 * ------------------------------------------------------------------
 * Types for the built-in learning tracks, lessons, exams and progress.
 * Shapes mirror exactly what AcademyAdmin / AcademyModule / Quiz render.
 * Self-contained module, no external dependencies.
 */
import type { Language } from './index';

export type ContentType = 'video' | 'article' | 'quiz' | 'coding_challenge';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizOption {
  id: string;
  textEn: string;
  textAr: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionAr: string;
  options: QuizOption[];
  explanationEn?: string;
  explanationAr?: string;
}

export interface Exam {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  type: ContentType;
  titleEn: string;
  titleAr: string;
  duration?: string;
  videoUrl?: string;
  textContentEn?: string;
  textContentAr?: string;
  quiz?: QuizQuestion[];
}

export interface Chapter {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  lessons: Lesson[];
  chapterExam?: Exam;
}

export interface Instructor {
  nameEn: string;
  nameAr: string;
  avatar: string;
  titleEn: string;
  titleAr: string;
}

export interface CourseTrack {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  category: string;
  level: SkillLevel;
  iconName?: string;
  thumbnailUrl?: string;
  instructor?: Instructor;
  rating?: number;
  totalStudents?: number;
  accentColor?: string;
  chapters: Chapter[];
  finalExam: Exam;
}

export interface CertificateRecord {
  id: string;
  courseId: string;
  courseTitleEn: string;
  courseTitleAr: string;
  studentName: string;
  issueDate: string;
  score: number;
  verificationCode: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  passedChapterExamIds: string[];
  finalExamScores: Record<string, number>;
  earnedCertificates: CertificateRecord[];
  totalXP: number;
  studentName: string;
  lastTrackId?: string;
}

export type { Language };
