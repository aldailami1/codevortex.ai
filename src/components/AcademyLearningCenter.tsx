'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { CertificateRecord, CourseTrack, Lesson, CodeSandboxSpec, UserProgress } from '@/types/academy';
import { COURSES_DATA } from '@/data/coursesData';
import { Language } from '@/types';
import { safeGetItem, safeSetItem } from '@/lib/utils';
import { Quiz } from './Quiz';
import { Certificate } from './Certificate';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Clock3,
  GraduationCap,
  LockKeyhole,
  Play,
  Rocket,
  Sparkles,
  Trophy,
  Wand2,
} from 'lucide-react';

interface AcademyLearningCenterProps {
  language: Language;
  onOpenWorkspace?: (initialCode?: string) => void;
}

type SandboxResult = { passed: boolean; output: string };

const defaultProgress: UserProgress = {
  studentName: 'CloudForge Learner',
  completedLessonIds: [],
  passedChapterExamIds: [],
  finalExamScores: {},
  earnedCertificates: [],
  totalXP: 350,
  completedCodeChallengeIds: [],
  earnedBadgeIds: [],
  completedHours: 0,
};

const minutesToHours = (duration?: string) => {
  const match = duration?.match(/(\d+(?:\.\d+)?)\s*(?:min|m|دقيقة)/i);
  return match ? Math.max(0.1, Number(match[1]) / 60) : 0.25;
};

const lessonSandbox = (lesson: Lesson): CodeSandboxSpec => lesson.sandbox || {
  language: lesson.titleEn.toLowerCase().includes('sql') || lesson.titleEn.toLowerCase().includes('database') ? 'sql' : 'javascript',
  starterCode: lesson.titleEn.toLowerCase().includes('database') ? "select 'CloudForge' as platform;" : "const platform = 'CloudForge';\nconsole.log(platform);",
  expectedOutput: 'CloudForge',
  evaluationHints: ['Keep the starter intent intact.', 'Return or print the expected CloudForge value.'],
};

const gradeSandbox = (spec: CodeSandboxSpec, code: string): SandboxResult => {
  const normalized = code.toLowerCase();
  const expected = spec.expectedOutput?.toLowerCase();
  const hasExpectedValue = !expected || normalized.includes(expected);
  const hasExecutableShape = spec.language === 'sql' ? /select\s+/i.test(code) : /(console\.log|return|function|const|let)/i.test(code);
  const passed = code.trim().length > 12 && hasExpectedValue && hasExecutableShape;
  return passed
    ? { passed: true, output: spec.expectedOutput || 'Static checks passed. Ready to submit.' }
    : { passed: false, output: 'Static checks did not pass yet. Keep the expected value and an executable statement in your solution.' };
};

const trackBadge = (track: CourseTrack, index: number) => ({
  id: `${track.id}-badge-${index}`,
  titleEn: index === 0 ? 'Path Explorer' : index === 1 ? 'Systems Builder' : 'CloudForge Specialist',
  titleAr: index === 0 ? 'مستكشف المسار' : index === 1 ? 'باني الأنظمة' : 'متخصص CloudForge',
  descriptionEn: index === 0 ? 'Completed the first learning milestone.' : index === 1 ? 'Completed half of the engineering path.' : 'Completed the full learning path.',
  descriptionAr: index === 0 ? 'أكملت أول محطة تعليمية.' : index === 1 ? 'أكملت نصف المسار الهندسي.' : 'أكملت المسار الهندسي بالكامل.',
});

export const AcademyLearningCenter: React.FC<AcademyLearningCenterProps> = ({ language, onOpenWorkspace }) => {
  const isAr = language === 'ar';
  const tracks = COURSES_DATA;
  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id || '');
  const [activeLessonId, setActiveLessonId] = useState(tracks[0]?.chapters[0]?.lessons[0]?.id || '');
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = safeGetItem('cloudforge_user_progress_v2');
      return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });
  const [sandboxCode, setSandboxCode] = useState('');
  const [sandboxResult, setSandboxResult] = useState<SandboxResult | null>(null);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});
  const [showCertificate, setShowCertificate] = useState(false);

  const currentTrack = tracks.find((track) => track.id === activeTrackId) || tracks[0];
  const allLessons = useMemo(() => currentTrack.chapters.flatMap((chapter) => chapter.lessons), [currentTrack]);
  const currentLesson = allLessons.find((lesson) => lesson.id === activeLessonId) || allLessons[0];
  const currentSpec = currentLesson ? lessonSandbox(currentLesson) : null;
  const totalHours = currentTrack.totalHours || allLessons.reduce((sum, lesson) => sum + (lesson.estimatedHours || minutesToHours(lesson.duration)), 0);
  const completedCount = allLessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
  const completionPercent = Math.round((completedCount / Math.max(1, allLessons.length)) * 100);
  const earnedForTrack = [0, 1, 2].filter((index) => completionPercent >= [1, 50, 100][index]).map((index) => currentTrack.skillBadges?.[index] || trackBadge(currentTrack, index));
  const trackHoursCompleted = allLessons.reduce((sum, lesson) => progress.completedLessonIds.includes(lesson.id) ? sum + (lesson.estimatedHours || minutesToHours(lesson.duration)) : sum, 0);
  const certificateRecord = useMemo<CertificateRecord>(() => {
    const saved = progress.earnedCertificates.find((certificate) => certificate.courseId === currentTrack.id);
    return saved || {
      id: `cert-${currentTrack.id}`,
      courseId: currentTrack.id,
      courseTitleEn: currentTrack.titleEn,
      courseTitleAr: currentTrack.titleAr,
      studentName: progress.studentName,
      issueDate: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      score: 100,
      verificationCode: `CF-${currentTrack.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}-${String(new Date().getFullYear()).slice(-2)}`,
    };
  }, [currentTrack, isAr, progress]);

  useEffect(() => {
    safeSetItem('cloudforge_user_progress_v2', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!currentLesson) return;
    setSandboxCode(lessonSandbox(currentLesson).starterCode);
    setSandboxResult(null);
  }, [currentLesson]);

  useEffect(() => {
    if (!currentTrack || !currentLesson) return;
    setProgress((previous) => ({ ...previous, lastTrackId: currentTrack.id }));
  }, [currentLesson, currentTrack]);

  const markComplete = (lesson: Lesson) => {
    if (progress.completedLessonIds.includes(lesson.id)) return;
    const hours = lesson.estimatedHours || minutesToHours(lesson.duration);
    setProgress((previous) => ({
      ...previous,
      completedLessonIds: [...previous.completedLessonIds, lesson.id],
      completedHours: (previous.completedHours || 0) + hours,
      totalXP: previous.totalXP + 100,
    }));
  };

  const changeTrack = (track: CourseTrack) => {
    setActiveTrackId(track.id);
    const firstLesson = track.chapters[0]?.lessons[0];
    if (firstLesson) setActiveLessonId(firstLesson.id);
    setSandboxResult(null);
  };

  const runSandbox = () => {
    if (!currentSpec) return;
    const result = gradeSandbox(currentSpec, sandboxCode);
    setSandboxResult(result);
    if (result.passed && currentLesson) {
      setProgress((previous) => {
        const alreadyGraded = (previous.completedCodeChallengeIds || []).includes(currentLesson.id);
        return {
          ...previous,
          completedCodeChallengeIds: Array.from(new Set([...(previous.completedCodeChallengeIds || []), currentLesson.id])),
          totalXP: previous.totalXP + (alreadyGraded ? 0 : 50),
        };
      });
    }
  };

  const submitLesson = () => {
    if (!currentLesson) return;
    if (!sandboxResult?.passed) return;
    markComplete(currentLesson);
  };

  if (showCertificate) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#080B14] px-4 py-6 text-slate-100 sm:px-6 lg:px-8 lg:py-10" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="mx-auto w-full max-w-6xl"><button onClick={() => setShowCertificate(false)} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-black text-slate-200 hover:border-cyan-300">{isAr ? 'العودة إلى المسار' : 'Back to learning path'}</button><Certificate certificate={certificateRecord} isArabic={isAr} onUpdateStudentName={(name) => setProgress((previous) => ({ ...previous, studentName: name }))} /></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#080B14] text-slate-100" dir={isAr ? 'rtl' : 'ltr'}>
      <header className="border-b border-slate-800/80 bg-slate-950/80 px-4 py-6 backdrop-blur-xl sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-3"><div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200"><GraduationCap className="h-3.5 w-3.5" /> CloudForge Academy</div><h1 className="text-2xl font-black leading-tight text-white sm:text-4xl md:text-5xl">{isAr ? 'مركز تدريب هندسي للسحابة والذكاء الاصطناعي' : 'Engineering academy for cloud and AI systems'}</h1><p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{isAr ? 'مسارات عملية، مختبرات برمجية، اختبارات قصيرة، وتقدم قابل للقياس من أول درس حتى الشهادة.' : 'Practical paths, coding labs, short quizzes, and measurable progress from the first lesson to certification.'}</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"><p className="text-[10px] font-bold uppercase text-slate-500">{isAr ? 'الخبرة' : 'XP'}</p><p className="mt-1 text-2xl font-black text-cyan-300">{progress.totalXP}</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"><p className="text-[10px] font-bold uppercase text-slate-500">{isAr ? 'الساعات' : 'Hours'}</p><p className="mt-1 text-2xl font-black text-violet-300">{(progress.completedHours || 0).toFixed(1)}</p></div><div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:col-span-1"><p className="text-[10px] font-bold uppercase text-slate-500">{isAr ? 'الشارات' : 'Badges'}</p><p className="mt-1 text-2xl font-black text-amber-300">{earnedForTrack.length}/3</p></div></div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">{tracks.map((track) => <button key={track.id} onClick={() => changeTrack(track)} className={`min-h-24 rounded-2xl border p-4 text-start transition ${track.id === currentTrack.id ? 'border-cyan-300 bg-cyan-400/10 shadow-lg shadow-cyan-950/30' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}><span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">{track.category} · {track.level}</span><span className="mt-2 block text-sm font-black text-white">{isAr ? track.titleAr : track.titleEn}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{isAr ? track.shortDescriptionAr : track.shortDescriptionEn}</span></button>)}</div>
        </div>
      <div className="mx-auto mt-5 flex w-full max-w-7xl justify-end">
        <button
          onClick={() => setShowCertificate(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-xs font-black text-amber-200 transition hover:bg-amber-300/20"
        >
          <Award className="h-4 w-4" />
          {isAr ? 'عرض نموذج الشهادة الرقمية' : 'Preview digital certificate'}
        </button>
      </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-6 overflow-x-hidden px-4 py-6 sm:px-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:px-8 lg:py-10">
        <aside className="h-fit overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="border-b border-slate-800 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">{isAr ? 'لوحة الطالب' : 'Student dashboard'}</p><h2 className="mt-1 text-lg font-black text-white">{completionPercent}%</h2></div><div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300"><Trophy className="h-5 w-5" /></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all" style={{ width: `${completionPercent}%` }} /></div><div className="mt-2 flex items-center justify-between text-[10px] text-slate-500"><span>{completedCount}/{allLessons.length} {isAr ? 'درس' : 'lessons'}</span><span>{totalHours.toFixed(1)}h {isAr ? 'المسار' : 'path'}</span></div></div>
          <div className="max-h-[55vh] space-y-2 overflow-y-auto p-3">{currentTrack.chapters.map((chapter, chapterIndex) => { const isOpen = openChapters[chapter.id] ?? true; return <div key={chapter.id} className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/50"><button onClick={() => setOpenChapters((previous) => ({ ...previous, [chapter.id]: !isOpen }))} className="flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-start text-xs font-black text-slate-200"><span className="flex min-w-0 items-center gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-slate-800 text-cyan-300">{chapterIndex + 1}</span><span className="truncate">{isAr ? chapter.titleAr : chapter.titleEn}</span></span>{isOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" /> : <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />}</button>{isOpen && <div className="space-y-1 border-t border-slate-800/80 p-2">{chapter.lessons.map((lesson) => { const selected = lesson.id === currentLesson?.id; const completed = progress.completedLessonIds.includes(lesson.id); return <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)} className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-xs font-semibold transition ${selected ? 'border border-cyan-300/40 bg-cyan-400/10 text-cyan-200' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}><span className="shrink-0">{completed ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : lesson.type === 'video' ? <Play className="h-4 w-4 text-cyan-300" /> : lesson.type === 'coding_challenge' ? <Code2 className="h-4 w-4 text-violet-300" /> : <BookOpen className="h-4 w-4 text-slate-500" />}</span><span className="min-w-0 flex-1 truncate">{isAr ? lesson.titleAr : lesson.titleEn}</span><span className="shrink-0 text-[10px] text-slate-600">{lesson.duration}</span></button>; })}</div>}</div>; })}</div>
        </aside>

        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md"><Clock3 className="h-5 w-5 text-cyan-300" /><p className="mt-3 text-2xl font-black text-white">{trackHoursCompleted.toFixed(1)}h</p><p className="text-xs text-slate-500">{isAr ? 'ساعات مكتملة في المسار' : 'completed path hours'}</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md"><Code2 className="h-5 w-5 text-violet-300" /><p className="mt-3 text-2xl font-black text-white">{(progress.completedCodeChallengeIds || []).length}</p><p className="text-xs text-slate-500">{isAr ? 'مختبرات تم تقييمها' : 'labs evaluated'}</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md"><Award className="h-5 w-5 text-amber-300" /><p className="mt-3 text-2xl font-black text-white">{earnedForTrack.length}</p><p className="text-xs text-slate-500">{isAr ? 'شارات مهارية' : 'skill badges'}</p></div></div>

          {currentLesson && <article className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md sm:p-8"><div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-start"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-300">{currentTrack.titleEn} · {currentLesson.duration}</p><h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-4xl">{isAr ? currentLesson.titleAr : currentLesson.titleEn}</h2></div><button onClick={submitLesson} disabled={progress.completedLessonIds.includes(currentLesson.id) || !sandboxResult?.passed} className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${progress.completedLessonIds.includes(currentLesson.id) ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'bg-cyan-300 text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40'}`}><Check className="h-4 w-4" />{progress.completedLessonIds.includes(currentLesson.id) ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'إكمال الدرس' : 'Complete lesson')}</button></div>

            {currentLesson.videoUrl ? <div className="aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"><iframe src={currentLesson.videoUrl} title={currentLesson.titleEn} className="h-full w-full border-0" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /></div> : <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-cyan-400/30 bg-[radial-gradient(circle_at_top,rgba(0,242,254,0.12),transparent_50%),#0b1220] p-8 text-center"><div><Sparkles className="mx-auto h-8 w-8 text-cyan-300" /><p className="mt-3 text-sm font-black text-white">{isAr ? 'شرح نظري مصور داخل مساحة التعلم' : 'Visual theory briefing inside the learning space'}</p><p className="mt-2 text-xs leading-6 text-slate-400">{isAr ? 'اقرأ المفاهيم، جرّب المثال، ثم نفّذ المختبر قبل الانتقال.' : 'Read the concept, try the example, then complete the lab before moving on.'}</p></div></div>}

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"><div className="mb-3 flex items-center gap-2 text-sm font-black text-cyan-200"><BookOpen className="h-4 w-4" />{isAr ? 'الشرح النظري' : 'Theory briefing'}</div><div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{isAr ? currentLesson.textContentAr || currentLesson.textContentEn : currentLesson.textContentEn || currentLesson.textContentAr || (isAr ? 'لا يوجد شرح نصي بعد.' : 'Theory content is being prepared.')}</div></div>

            <section className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-sm font-black text-violet-200"><Code2 className="h-4 w-4" />{isAr ? 'مختبر الكود التفاعلي' : 'Interactive code sandbox'}</div><p className="mt-1 text-xs leading-6 text-slate-400">{isAr ? 'التقييم آمن وثابت: لا يتم تنفيذ كود غير موثوق على الخادم.' : 'Evaluation is safe and deterministic: untrusted code is never executed on the server.'}</p></div><span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-black uppercase text-violet-200">{currentSpec?.language}</span></div><textarea value={sandboxCode} onChange={(event) => setSandboxCode(event.target.value)} spellCheck={false} className="mt-4 min-h-44 w-full resize-y rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-6 text-emerald-200 outline-none focus:border-violet-300" /><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="text-xs text-slate-500">{currentSpec?.evaluationHints?.[0]}</div><button onClick={runSandbox} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-violet-200"><Wand2 className="h-4 w-4" />{isAr ? 'تشغيل التقييم' : 'Run evaluation'}</button></div>{sandboxResult && <div className={`mt-3 rounded-xl border px-3 py-3 text-xs font-semibold ${sandboxResult.passed ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/30 bg-amber-400/10 text-amber-200'}`}>{sandboxResult.passed ? (isAr ? 'اجتاز التقييم: ' : 'Passed: ') : (isAr ? 'ما زال يحتاج إلى تحسين: ' : 'Needs improvement: ')}{sandboxResult.output}</div>}</section>

            {currentLesson.quiz && currentLesson.quiz.length > 0 && <Quiz exam={{ id: `lesson-${currentLesson.id}`, titleEn: currentLesson.titleEn, titleAr: currentLesson.titleAr, descriptionEn: 'Check your understanding before moving forward.', descriptionAr: 'اختبر فهمك قبل الانتقال.', passingScore: 80, questions: currentLesson.quiz }} isArabic={isAr} onPass={() => markComplete(currentLesson)} />}

            <div className="flex flex-col justify-between gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center"><div className="flex items-center gap-2 text-xs text-slate-500"><Rocket className="h-4 w-4 text-cyan-300" />{isAr ? 'التقييم التلقائي مطلوب للمختبرات قبل الانتقال للمستوى التالي.' : 'Automatic evaluation is required for labs before progressing.'}</div>{onOpenWorkspace && <button onClick={() => onOpenWorkspace(currentSpec?.starterCode)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-black text-cyan-200 hover:bg-cyan-400/20"><Code2 className="h-4 w-4" />{isAr ? 'فتح في مساحة العمل' : 'Open in workspace'}</button>}</div>
          </article>}

          <section className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((index) => { const badge = currentTrack.skillBadges?.[index] || trackBadge(currentTrack, index); const unlocked = completionPercent >= [1, 50, 100][index]; return <div key={badge.id} className={`rounded-2xl border p-5 ${unlocked ? 'border-amber-400/30 bg-amber-400/10' : 'border-slate-800 bg-slate-900/50 opacity-70'}`}><div className="flex items-center justify-between"><span className={`rounded-xl p-2 ${unlocked ? 'bg-amber-300 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{unlocked ? <Trophy className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}</span><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{[1, 50, 100][index]}%</span></div><h3 className="mt-4 text-sm font-black text-white">{isAr ? badge.titleAr : badge.titleEn}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{isAr ? badge.descriptionAr : badge.descriptionEn}</p></div>; })}</section>
        </div>
      </section>
    </main>
  );
};
