import React, { useState } from 'react';
import { Language } from './types';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Play,
  Award,
  Search,
  ChevronRight,
} from 'lucide-react';

interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  modules: CourseModule[];
}

// بيانات الدورات المضمنة محلياً لمنع استدعاء المسارات المفقودة أثناء البناء
const COURSES_DATA: Course[] = [
  {
    id: 'course-web-dev',
    title: 'Full-Stack Web Development',
    description: 'Master modern frontend and backend development with React, Node.js, and TypeScript.',
    category: 'Web Development',
    level: 'Beginner',
    duration: '12 Hours',
    modules: [
      {
        id: 'mod-1',
        title: 'Introduction to Modern Web Architecture',
        lessons: [
          { id: 'les-1', title: 'HTML5 & Modern CSS Standards', duration: '25m', completed: true },
          { id: 'les-2', title: 'JavaScript Essentials & DOM Operations', duration: '40m', completed: false },
        ],
      },
    ],
  },
  {
    id: 'course-ai-eng',
    title: 'AI Engineering & Prompt System Design',
    description: 'Learn how to integrate LLMs, build automated AI workflows, and optimize API pipelines.',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    duration: '8 Hours',
    modules: [
      {
        id: 'mod-2',
        title: 'Core LLM Integrations',
        lessons: [
          { id: 'les-3', title: 'Understanding Gemini & OpenAI APIs', duration: '30m', completed: false },
          { id: 'les-4', title: 'Structured Output & Function Calling', duration: '45m', completed: false },
        ],
      },
    ],
  },
  {
    id: 'course-cloud-native',
    title: 'Cloud Infrastructure & DevOps Mastery',
    description: 'Deploy, scale, and monitor modern web platforms using serverless edge computing.',
    category: 'Cloud Computing',
    level: 'Advanced',
    duration: '10 Hours',
    modules: [
      {
        id: 'mod-3',
        title: 'CI/CD & Serverless Deployments',
        lessons: [
          { id: 'les-5', title: 'Automated Builds with Vercel & Bun', duration: '35m', completed: false },
        ],
      },
    ],
  },
];

interface AcademyModuleProps {
  language: Language;
}

export const AcademyModule: React.FC<AcademyModuleProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES_DATA.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 p-6 overflow-y-auto font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
              <GraduationCap className="w-5 h-5" />
              <span>{isAr ? 'أكاديمية CloudForge' : 'CloudForge Academy'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {isAr ? 'المسارات التعليمية والدورات' : 'Educational Paths & Masterclasses'}
            </h1>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في الدورات...' : 'Search courses...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedCourse.id === course.id
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {course.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-white">{course.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>{isAr ? 'عرض المنهاج' : 'View Curriculum'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Course Details Overview */}
        {selectedCourse && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCourse.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedCourse.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs px-3 py-1.5 rounded-xl font-mono shrink-0">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Level: {selectedCourse.level}</span>
              </div>
            </div>

            <div className="space-y-4">
              {selectedCourse.modules.map((mod) => (
                <div key={mod.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    {mod.title}
                  </h4>
                  <div className="space-y-2">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-xs text-slate-300 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Play className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{les.title}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{les.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
