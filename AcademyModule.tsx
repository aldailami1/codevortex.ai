import React, { useState, useEffect } from 'react';
import { CourseTrack, Chapter, Lesson, UserProgress, CertificateRecord, Exam } from '../types/academy';
import { COURSES_DATA } from '../data/coursesData';
import { Quiz } from './Quiz';
import { Certificate } from './Certificate';
import { AcademyAdmin } from './AcademyAdmin';
import { Language } from '../types';
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Code2,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Play,
  Award,
  Sparkles,
  Trophy,
  Zap,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Brain,
  Search,
  Settings,
  X,
  Star,
  Printer,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  FileCheck,
  User,
} from 'lucide-react';

interface AcademyModuleProps {
  language: Language;
  onOpenWorkspace?: (initialCode?: string) => void;
}

export const AcademyModule: React.FC<AcademyModuleProps> = ({
  language,
  onOpenWorkspace,
}) => {
  const isAr = language === 'ar';

  // Load or initialize course tracks
  const [tracks, setTracks] = useState<CourseTrack[]>(() => {
    try {
      const saved = localStorage.getItem('codevortex_courses_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved courses data', e);
    }
    return COURSES_DATA;
  });

  // User progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('codevortex_user_progress_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse user progress', e);
    }
    return {
      studentName: 'مهندس برمجيات أمين',
      completedLessonIds: [],
      passedChapterExamIds: [],
      finalExamScores: {},
      earnedCertificates: [],
      totalXP: 350,
    };
  });

  // Active track selection
  const [activeTrackId, setActiveTrackId] = useState<string>(tracks[0]?.id || '');
  // Selected view type: 'lesson' | 'chapter_exam' | 'final_exam' | 'certificate'
  const [viewType, setViewType] = useState<'lesson' | 'chapter_exam' | 'final_exam' | 'certificate'>('lesson');
  const [activeLessonId, setActiveLessonId] = useState<string>(tracks[0]?.chapters[0]?.lessons[0]?.id || '');
  const [activeChapterId, setActiveChapterId] = useState<string>(tracks[0]?.chapters[0]?.id || '');

  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});
  const [showAdminStudio, setShowAdminStudio] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('codevortex_courses_v5', JSON.stringify(tracks));
    } catch (e) {
      console.error(e);
    }
  }, [tracks]);

  useEffect(() => {
    try {
      localStorage.setItem('codevortex_user_progress_v5', JSON.stringify(progress));
    } catch (e) {
      console.error(e);
    }
  }, [progress]);

  const currentTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Resolve current lesson and chapter
  let currentLesson: Lesson | undefined;
  let currentChapter: Chapter | undefined = currentTrack.chapters.find((ch) => ch.id === activeChapterId) || currentTrack.chapters[0];

  for (const ch of currentTrack.chapters) {
    const foundLesson = ch.lessons.find((l) => l.id === activeLessonId);
    if (foundLesson) {
      currentLesson = foundLesson;
      currentChapter = ch;
      break;
    }
  }

  if (!currentLesson && currentTrack.chapters[0]?.lessons[0]) {
    currentLesson = currentTrack.chapters[0].lessons[0];
  }

  // Calculate track progress
  const totalLessonsInTrack = currentTrack.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0) || 1;
  const completedLessonsInTrack = currentTrack.chapters.reduce((acc, ch) => {
    return acc + ch.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
  }, 0);
  const trackCompletionPercent = Math.round((completedLessonsInTrack / totalLessonsInTrack) * 100);

  const finalExamScore = progress.finalExamScores[currentTrack.id];
  const hasPassedFinalExam = finalExamScore !== undefined && finalExamScore >= (currentTrack.finalExam.passingScore || 80);

  // Existing certificate for active track
  const currentCertificate = progress.earnedCertificates.find((cert) => cert.courseId === currentTrack.id);

  // Handlers
  const handleMarkLessonComplete = (lessonId: string) => {
    if (progress.completedLessonIds.includes(lessonId)) return;

    setProgress((prev) => ({
      ...prev,
      completedLessonIds: [...prev.completedLessonIds, lessonId],
      totalXP: prev.totalXP + 100,
    }));
  };

  const handlePassedChapterExam = (chapterId: string, score: number) => {
    if (!progress.passedChapterExamIds.includes(chapterId)) {
      setProgress((prev) => ({
        ...prev,
        passedChapterExamIds: [...prev.passedChapterExamIds, chapterId],
        totalXP: prev.totalXP + 200,
      }));
    }
  };

  const handlePassedFinalExam = (score: number) => {
    const existingCert = progress.earnedCertificates.find((c) => c.courseId === currentTrack.id);
    let updatedCerts = [...progress.earnedCertificates];

    if (!existingCert) {
      const newCert: CertificateRecord = {
        id: `cert-${Date.now()}`,
        courseId: currentTrack.id,
        courseTitleEn: currentTrack.titleEn,
        courseTitleAr: currentTrack.titleAr,
        studentName: progress.studentName || 'مهندس برمجيات أمين',
        issueDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
        score,
        verificationCode: `CVX-ACADEMY-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      updatedCerts.push(newCert);
    }

    setProgress((prev) => ({
      ...prev,
      finalExamScores: { ...prev.finalExamScores, [currentTrack.id]: score },
      earnedCertificates: updatedCerts,
      totalXP: prev.totalXP + 500,
    }));

    setViewType('certificate');
  };

  const handleUpdateStudentName = (newName: string) => {
    setProgress((prev) => {
      const updatedCerts = prev.earnedCertificates.map((cert) =>
        cert.courseId === currentTrack.id ? { ...cert, studentName: newName } : cert
      );
      return {
        ...prev,
        studentName: newName,
        earnedCertificates: updatedCerts,
      };
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080B14] text-slate-100 min-h-screen dir-rtl" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header Bar */}
      <div className="border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 shadow-lg shadow-cyan-500/20 font-black">
            <GraduationCap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>{isAr ? 'منظومة الأكاديمية والمناهج التعليمية التفاعلية' : 'World-Class EdTech Academy Engine'}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                LMS V5.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {isAr ? 'مناهج شاملة بالذكاء الاصطناعي، البرمجة، اللغات، الويب، التطبيقات والأمن السيبراني' : 'Structured courses for AI, Core Programming, Languages, Web, Apps, and Cyber Security'}
            </p>
          </div>
        </div>

        {/* Learner Progress & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* XP Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{progress.totalXP} XP</span>
          </div>

          {/* Student Name Display */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>{progress.studentName}</span>
          </div>

          {/* Admin Studio Button */}
          <button
            onClick={() => setShowAdminStudio(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            title={isAr ? 'فتح استوديو التحكم بالمحتوى' : 'Open Admin Content Studio'}
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{isAr ? 'استوديو المحتوى' : 'Content Studio'}</span>
          </button>
        </div>
      </div>

      {/* Course Subject Tabs Selector */}
      <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2.5 no-scrollbar">
        {tracks.map((track) => {
          const isActive = track.id === currentTrack.id;
          const cert = progress.earnedCertificates.find((c) => c.courseId === track.id);

          return (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrackId(track.id);
                setViewType('lesson');
                const firstCh = track.chapters[0];
                if (firstCh) {
                  setActiveChapterId(firstCh.id);
                  if (firstCh.lessons[0]) setActiveLessonId(firstCh.lessons[0].id);
                }
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950 via-blue-950 to-indigo-950 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Brain className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{isAr ? track.titleAr : track.titleEn}</span>
              {cert && (
                <span title={isAr ? 'تم الاجتياز والشهادة صالحة' : 'Passed & Certified'}>
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Course Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Navigation Tree */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[#0B0F19]/60 flex flex-col shrink-0 overflow-y-auto">
          {/* Active Course Track Info Card */}
          <div className="p-5 border-b border-slate-800/80 bg-[#0E1424] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800/80 text-cyan-300 font-bold">
                {currentTrack.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{currentTrack.rating}</span>
                <span className="text-slate-500">({currentTrack.totalStudents.toLocaleString()})</span>
              </div>
            </div>

            <h2 className="text-base font-black text-white leading-snug">
              {isAr ? currentTrack.titleAr : currentTrack.titleEn}
            </h2>

            {/* Course Progress Indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">{isAr ? 'نسبة الإنجاز بالدروس' : 'Lessons Completed'}</span>
                <span className="text-cyan-400">{trackCompletionPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${trackCompletionPercent}%` }}
                />
              </div>
            </div>

            {/* Final Exam & Certificate Action triggers */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setViewType('final_exam')}
                className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all border ${
                  viewType === 'final_exam'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>
                  {hasPassedFinalExam
                    ? isAr
                      ? `الاختبار النهائي للمادة (اجتياز ${finalExamScore}%)`
                      : `Final Exam (Passed ${finalExamScore}%)`
                    : isAr
                    ? 'تقديم الاختبار النهائي للمادة (طلب النجاح 80%)'
                    : 'Take Course Final Exam (80% Required)'}
                </span>
              </button>

              {hasPassedFinalExam && (
                <button
                  onClick={() => setViewType('certificate')}
                  className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all border ${
                    viewType === 'certificate'
                      ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                      : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isAr ? 'عرض وطباعة الشهادة المعتمدة' : 'View & Print Certificate'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Chapters and Lessons Tree */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {currentTrack.chapters.map((chapter, chIdx) => {
              const isCollapsed = collapsedChapters[chapter.id];
              const isPassedChapter = progress.passedChapterExamIds.includes(chapter.id);

              return (
                <div
                  key={chapter.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden"
                >
                  {/* Chapter Header */}
                  <button
                    onClick={() =>
                      setCollapsedChapters({
                        ...collapsedChapters,
                        [chapter.id]: !isCollapsed,
                      })
                    }
                    className="w-full p-3.5 bg-[#0D1220] hover:bg-slate-900 flex items-center justify-between text-right font-bold text-xs transition-all border-b border-slate-800/60"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-400 shrink-0">
                        {chIdx + 1}
                      </span>
                      <span className="truncate text-slate-200">
                        {isAr ? chapter.titleAr : chapter.titleEn}
                      </span>
                    </div>

                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {/* Chapter Content */}
                  {!isCollapsed && (
                    <div className="p-2 space-y-1">
                      {/* Lessons */}
                      {chapter.lessons.map((lesson) => {
                        const isSelected =
                          viewType === 'lesson' && lesson.id === activeLessonId;
                        const isCompleted = progress.completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setActiveChapterId(chapter.id);
                              setActiveLessonId(lesson.id);
                              setViewType('lesson');
                            }}
                            className={`w-full text-right p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 transition-all ${
                              isSelected
                                ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 shadow-md'
                                : 'bg-transparent hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : lesson.type === 'video' ? (
                                <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                              ) : lesson.type === 'quiz' ? (
                                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                              )}

                              <span className="truncate">{isAr ? lesson.titleAr : lesson.titleEn}</span>
                            </div>

                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {lesson.duration}
                            </span>
                          </button>
                        );
                      })}

                      {/* Chapter Exam Option */}
                      {chapter.chapterExam && (
                        <button
                          onClick={() => {
                            setActiveChapterId(chapter.id);
                            setViewType('chapter_exam');
                          }}
                          className={`w-full text-right p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-3 transition-all mt-1 border ${
                            viewType === 'chapter_exam' && activeChapterId === chapter.id
                              ? 'bg-amber-950/80 border-amber-500/60 text-amber-200'
                              : 'bg-slate-900/60 border-slate-800 text-amber-400/80 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="truncate">
                              {isAr ? `اختبار الفصل: ${chapter.titleAr}` : `Exam: ${chapter.titleEn}`}
                            </span>
                          </div>

                          {isPassedChapter && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#080B14]">
          {/* VIEW TYPE 1: LESSON VIEW */}
          {viewType === 'lesson' && currentLesson && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
                    <span>{isAr ? currentChapter?.titleAr : currentChapter?.titleEn}</span>
                    <span>•</span>
                    <span>{currentLesson.duration}</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-white leading-snug">
                    {isAr ? currentLesson.titleAr : currentLesson.titleEn}
                  </h1>
                </div>

                <button
                  onClick={() => handleMarkLessonComplete(currentLesson!.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                    progress.completedLessonIds.includes(currentLesson.id)
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {progress.completedLessonIds.includes(currentLesson.id)
                      ? isAr
                        ? 'مكتمل (+100 XP)'
                        : 'Completed (+100 XP)'
                      : isAr
                      ? 'تحديد كـ مكتمل'
                      : 'Mark Complete'}
                  </span>
                </button>
              </div>

              {/* Video Player */}
              {currentLesson.type === 'video' && currentLesson.videoUrl && (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.titleEn}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Text Article Content */}
              {(currentLesson.textContentAr || currentLesson.textContentEn) && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4">
                  <div
                    className="space-y-4 whitespace-pre-wrap font-sans"
                    dangerouslySetInnerHTML={{
                      __html: (isAr ? currentLesson.textContentAr : currentLesson.textContentEn)
                        ?.replace(/### (.*)/g, '<h3 class="text-lg font-bold text-cyan-300 mt-4 mb-2">$1</h3>')
                        ?.replace(/#### (.*)/g, '<h4 class="text-base font-bold text-slate-200 mt-3 mb-1">$1</h4>')
                        ?.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">$1</pre>')
                        ?.replace(/> (.*)/g, '<blockquote class="p-3 border-r-4 border-cyan-500 bg-cyan-950/40 rounded-r-xl italic text-cyan-200 my-2">$1</blockquote>') || '',
                    }}
                  />
                </div>
              )}

              {/* Lesson Quiz Component */}
              {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                <Quiz
                  exam={{
                    id: `lesson-quiz-${currentLesson.id}`,
                    titleEn: `Lesson Quiz: ${currentLesson.titleEn}`,
                    titleAr: `اختبار الدرس: ${currentLesson.titleAr}`,
                    descriptionEn: 'Check your understanding before moving forward.',
                    descriptionAr: 'اختبر فهمك لمفاهيم هذا الدرس.',
                    passingScore: 80,
                    questions: currentLesson.quiz,
                  }}
                  isArabic={isAr}
                  onPass={() => handleMarkLessonComplete(currentLesson!.id)}
                />
              )}
            </div>
          )}

          {/* VIEW TYPE 2: CHAPTER EXAM VIEW */}
          {viewType === 'chapter_exam' && currentChapter?.chapterExam && (
            <div className="py-4">
              <Quiz
                exam={currentChapter.chapterExam}
                isArabic={isAr}
                onPass={(score) => handlePassedChapterExam(currentChapter!.id, score)}
              />
            </div>
          )}

          {/* VIEW TYPE 3: COURSE FINAL EXAM VIEW */}
          {viewType === 'final_exam' && (
            <div className="py-4 space-y-6">
              <Quiz
                exam={currentTrack.finalExam}
                isArabic={isAr}
                onPass={(score) => handlePassedFinalExam(score)}
              />
            </div>
          )}

          {/* VIEW TYPE 4: ACCREDITED CERTIFICATE VIEW */}
          {viewType === 'certificate' && (
            <div className="py-4">
              <Certificate
                certificate={
                  currentCertificate || {
                    id: `cert-${Date.now()}`,
                    courseId: currentTrack.id,
                    courseTitleEn: currentTrack.titleEn,
                    courseTitleAr: currentTrack.titleAr,
                    studentName: progress.studentName,
                    issueDate: new Date().toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                    score: finalExamScore || 90,
                    verificationCode: `CVX-ACADEMY-${Math.floor(100000 + Math.random() * 900000)}`,
                  }
                }
                isArabic={isAr}
                onUpdateStudentName={handleUpdateStudentName}
              />
            </div>
          )}
        </div>
      </div>

      {/* Admin Content Studio Modal */}
      {showAdminStudio && (
        <AcademyAdmin
          language={language}
          tracks={tracks}
          onSaveTracks={(updated) => setTracks(updated)}
          onClose={() => setShowAdminStudio(false)}
        />
      )}
    </div>
  );
};
