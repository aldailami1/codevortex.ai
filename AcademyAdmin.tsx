import React, { useState } from 'react';
import { CourseTrack, Chapter, Lesson, ContentType, SkillLevel, QuizQuestion } from '../types/academy';
import { Language } from '../types';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Eye,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Code2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  X,
  UploadCloud,
} from 'lucide-react';

interface AcademyAdminProps {
  language: Language;
  tracks: CourseTrack[];
  onSaveTracks: (updatedTracks: CourseTrack[]) => void;
  onClose: () => void;
}

export const AcademyAdmin: React.FC<AcademyAdminProps> = ({
  language,
  tracks,
  onSaveTracks,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [localTracks, setLocalTracks] = useState<CourseTrack[]>(tracks);
  const [activeTrackId, setActiveTrackId] = useState<string>(localTracks[0]?.id || '');
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showAddTrackModal, setShowAddTrackModal] = useState<boolean>(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState<boolean>(false);

  // New Track form state
  const [newTrackTitleEn, setNewTrackTitleEn] = useState('');
  const [newTrackTitleAr, setNewTrackTitleAr] = useState('');
  const [newTrackDescEn, setNewTrackDescEn] = useState('');
  const [newTrackDescAr, setNewTrackDescAr] = useState('');
  const [newTrackCategory, setNewTrackCategory] = useState<'AI & Data' | 'Web Development' | 'Cyber Security' | 'Cloud & DevOps'>('AI & Data');
  const [newTrackLevel, setNewTrackLevel] = useState<SkillLevel>('Intermediate');

  // New Chapter form state
  const [newChapterTitleEn, setNewChapterTitleEn] = useState('');
  const [newChapterTitleAr, setNewChapterTitleAr] = useState('');
  const [newChapterDescEn, setNewChapterDescEn] = useState('');
  const [newChapterDescAr, setNewChapterDescAr] = useState('');

  const currentTrack = localTracks.find((t) => t.id === activeTrackId) || localTracks[0];

  const handleCreateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitleEn.trim() || !newTrackTitleAr.trim()) return;

    const newTrack: CourseTrack = {
      id: `track-${Date.now()}`,
      titleEn: newTrackTitleEn,
      titleAr: newTrackTitleAr,
      slug: newTrackTitleEn.toLowerCase().replace(/\s+/g, '-'),
      descriptionEn: newTrackDescEn,
      descriptionAr: newTrackDescAr,
      shortDescriptionEn: newTrackDescEn.slice(0, 100),
      shortDescriptionAr: newTrackDescAr.slice(0, 100),
      category: newTrackCategory,
      level: newTrackLevel,
      iconName: 'BookOpen',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      instructor: {
        nameEn: 'CodeVortex Academy',
        nameAr: 'أكاديمية كود فورتكس',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        titleEn: 'Lead Technical Instructor',
        titleAr: 'كبير المدربين التقنيين',
      },
      chapters: [],
      finalExam: {
        id: `exam-${Date.now()}`,
        titleEn: `${newTrackTitleEn} Final Exam`,
        titleAr: `الاختبار النهائي لـ ${newTrackTitleAr}`,
        descriptionEn: 'Course final comprehensive examination.',
        descriptionAr: 'الاختبار النهائي الشامل للمادة.',
        passingScore: 80,
        questions: [
          {
            id: `q-${Date.now()}`,
            questionEn: 'Is this course complete?',
            questionAr: 'هل هذه المادة مكتملة المعطيات؟',
            options: [
              { id: 'opt-1', textEn: 'Yes, passed!', textAr: 'نعم، تم بنجاح', isCorrect: true },
              { id: 'opt-2', textEn: 'No', textAr: 'لا', isCorrect: false },
            ],
            explanationEn: 'Correct response.',
            explanationAr: 'إجابة صحيحة.',
          },
        ],
      },
      rating: 5.0,
      totalStudents: 1,
    };

    const updated = [newTrack, ...localTracks];
    setLocalTracks(updated);
    setActiveTrackId(newTrack.id);
    onSaveTracks(updated);
    setShowAddTrackModal(false);
    setNewTrackTitleEn('');
    setNewTrackTitleAr('');
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrack || !newChapterTitleEn.trim()) return;

    const newChapter: Chapter = {
      id: `ch-${Date.now()}`,
      titleEn: newChapterTitleEn,
      titleAr: newChapterTitleAr || newChapterTitleEn,
      descriptionEn: newChapterDescEn,
      descriptionAr: newChapterDescAr || newChapterDescEn,
      lessons: [],
    };

    const updatedTracks = localTracks.map((t) => {
      if (t.id === currentTrack.id) {
        return { ...t, chapters: [...t.chapters, newChapter] };
      }
      return t;
    });

    setLocalTracks(updatedTracks);
    onSaveTracks(updatedTracks);
    setShowAddChapterModal(false);
    setNewChapterTitleEn('');
    setNewChapterTitleAr('');
  };

  const handleAddLesson = (chapterId: string, type: ContentType) => {
    if (!currentTrack) return;
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      titleEn: type === 'video' ? 'New Video Lesson' : type === 'quiz' ? 'New Quiz Evaluation' : 'New Article Lesson',
      titleAr: type === 'video' ? 'درس فيديو جديد' : type === 'quiz' ? 'اختبار معرفة جديد' : 'مقال تعليمي جديد',
      duration: '10 min',
      type,
      videoUrl: type === 'video' ? 'https://www.youtube.com/embed/aircAruvnKk' : undefined,
      textContentEn: type === 'article' ? '### New Lesson Content\n\nWrite detailed markdown lesson here.' : undefined,
      textContentAr: type === 'article' ? '### محتوى الدرس الجديد\n\nاكتب محتوى المقال التعليمي هنا.' : undefined,
      quiz: type === 'quiz' ? [
        {
          id: `q-${Date.now()}`,
          questionEn: 'Sample Quiz Question?',
          questionAr: 'سؤال تجريبي جديد؟',
          options: [
            { id: 'opt-1', textEn: 'Correct Answer', textAr: 'الإجابة الصحيحة', isCorrect: true },
            { id: 'opt-2', textEn: 'Incorrect Answer', textAr: 'إجابة خاطئة', isCorrect: false },
          ],
          explanationEn: 'Explanation for correct choice.',
          explanationAr: 'توضيح سبب صحة الاختيار.',
        }
      ] : undefined,
    };

    const updatedTracks = localTracks.map((t) => {
      if (t.id === currentTrack.id) {
        const updatedChapters = t.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return { ...ch, lessons: [...ch.lessons, newLesson] };
          }
          return ch;
        });
        return { ...t, chapters: updatedChapters };
      }
      return t;
    });

    setLocalTracks(updatedTracks);
    onSaveTracks(updatedTracks);
    setEditingLesson(newLesson);
    setActiveChapterId(chapterId);
  };

  const handleSaveEditingLesson = (updatedLesson: Lesson) => {
    if (!currentTrack || !activeChapterId) return;

    const updatedTracks = localTracks.map((t) => {
      if (t.id === currentTrack.id) {
        const updatedChapters = t.chapters.map((ch) => {
          if (ch.id === activeChapterId) {
            const updatedLessons = ch.lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l));
            return { ...ch, lessons: updatedLessons };
          }
          return ch;
        });
        return { ...t, chapters: updatedChapters };
      }
      return t;
    });

    setLocalTracks(updatedTracks);
    onSaveTracks(updatedTracks);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    if (!currentTrack) return;
    const updatedTracks = localTracks.map((t) => {
      if (t.id === currentTrack.id) {
        const updatedChapters = t.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) };
          }
          return ch;
        });
        return { ...t, chapters: updatedChapters };
      }
      return t;
    });

    setLocalTracks(updatedTracks);
    onSaveTracks(updatedTracks);
    if (editingLesson?.id === lessonId) setEditingLesson(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col text-slate-100 overflow-hidden dir-rtl" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>{isAr ? 'استوديو إدارة الأكاديمية وصناعة المحتوى' : 'Academy Content & Course Studio'}</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full">
                ADMIN STUDIO
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {isAr ? 'إضافة وتعديل المسارات، الفصول، الدروس، الاختبارات التفاعلية والفيديوهات' : 'Create and manage tracks, chapters, lessons, interactive quizzes, and media'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddTrackModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء مسار تعليمي جديد' : 'New Course Track'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Studio Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track & Chapter Sidebar */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isAr ? 'المسارات المتاحة' : 'Course Tracks'}
            </span>
            <span className="text-xs text-cyan-400 font-mono font-bold">{localTracks.length}</span>
          </div>

          <div className="space-y-2">
            {localTracks.map((track) => {
              const isActive = track.id === (currentTrack?.id || activeTrackId);
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    setActiveTrackId(track.id);
                    setEditingLesson(null);
                  }}
                  className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate text-white">{isAr ? track.titleAr : track.titleEn}</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      {track.chapters.length} {isAr ? 'فصول' : 'chapters'}
                    </div>
                  </div>
                  <Sparkles className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {currentTrack && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isAr ? 'فصول المسار الحالي' : 'Track Chapters'}
                </span>
                <button
                  onClick={() => setShowAddChapterModal(true)}
                  className="p-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 transition-all text-xs flex items-center gap-1 font-bold px-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فصل' : 'Chapter'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentTrack.chapters.map((chapter) => (
                  <div key={chapter.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span className="truncate">{isAr ? chapter.titleAr : chapter.titleEn}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAddLesson(chapter.id, 'video')}
                          className="p-1 hover:bg-cyan-950 text-cyan-400 rounded"
                          title={isAr ? 'إضافة درس فيديو' : 'Add Video Lesson'}
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAddLesson(chapter.id, 'quiz')}
                          className="p-1 hover:bg-amber-950 text-amber-400 rounded"
                          title={isAr ? 'إضافة اختبار' : 'Add Quiz'}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAddLesson(chapter.id, 'article')}
                          className="p-1 hover:bg-emerald-950 text-emerald-400 rounded"
                          title={isAr ? 'إضافة مقال' : 'Add Article'}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Chapter Lessons list */}
                    <div className="space-y-1">
                      {chapter.lessons.map((les) => (
                        <div
                          key={les.id}
                          onClick={() => {
                            setActiveChapterId(chapter.id);
                            setEditingLesson(les);
                          }}
                          className={`p-2 rounded-lg text-[11px] font-medium cursor-pointer flex items-center justify-between border transition-all ${
                            editingLesson?.id === les.id
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {les.type === 'video' && <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            {les.type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            {les.type === 'article' && <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            <span className="truncate">{isAr ? les.titleAr : les.titleEn}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLesson(chapter.id, les.id);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lesson Editor Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {editingLesson ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {isAr ? 'محرر تفاصيل الدرس' : 'Lesson Content Editor'}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">ID: {editingLesson.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSaveEditingLesson(editingLesson)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? 'حفظ التغيرات' : 'Save Lesson'}</span>
                </button>
              </div>

              {/* Title inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isAr ? 'عنوان الدرس (الإنجليزية)' : 'Lesson Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={editingLesson.titleEn}
                    onChange={(e) => setEditingLesson({ ...editingLesson, titleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isAr ? 'عنوان الدرس (العربية)' : 'Lesson Title (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={editingLesson.titleAr}
                    onChange={(e) => setEditingLesson({ ...editingLesson, titleAr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* Duration and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isAr ? 'المدة الزمنية التقديرية' : 'Estimated Duration'}
                  </label>
                  <input
                    type="text"
                    value={editingLesson.duration}
                    onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    {isAr ? 'نوع محتوى الدرس' : 'Content Type'}
                  </label>
                  <select
                    value={editingLesson.type}
                    onChange={(e) => setEditingLesson({ ...editingLesson, type: e.target.value as ContentType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 outline-none"
                  >
                    <option value="video">Video Tutorial</option>
                    <option value="article">Article / Markdown</option>
                    <option value="quiz">Interactive Quiz</option>
                    <option value="coding_challenge">Coding Challenge</option>
                  </select>
                </div>
              </div>

              {/* Video URL for video lessons */}
              {editingLesson.type === 'video' && (
                <div className="space-y-2 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <label className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>{isAr ? 'رابط تضمين الفيديو (YouTube Embed URL)' : 'YouTube Embed Video URL'}</span>
                  </label>
                  <input
                    type="text"
                    value={editingLesson.videoUrl || ''}
                    onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/aircAruvnKk"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              )}

              {/* Text / Markdown Content */}
              {(editingLesson.type === 'article' || editingLesson.type === 'video') && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isAr ? 'المحتوى النصي المقال باللغة العربية (Markdown)' : 'Arabic Markdown Content'}
                    </label>
                    <textarea
                      rows={8}
                      value={editingLesson.textContentAr || ''}
                      onChange={(e) => setEditingLesson({ ...editingLesson, textContentAr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono leading-relaxed focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {isAr ? 'المحتوى النصي المقال باللغة الإنجليزية (Markdown)' : 'English Markdown Content'}
                    </label>
                    <textarea
                      rows={8}
                      value={editingLesson.textContentEn || ''}
                      onChange={(e) => setEditingLesson({ ...editingLesson, textContentEn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono leading-relaxed focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-700 animate-pulse" />
              <h3 className="text-base font-bold text-slate-400">
                {isAr ? 'اختر درساً من القائمة الجانبية لتعديله' : 'Select a lesson from the sidebar to edit'}
              </h3>
              <p className="text-xs max-w-sm">
                {isAr ? 'يمكنك إضافة درجات، مقالات، اختبارات تفاعلية، أو روابط فيديوهات بسهولة' : 'Easily manage lessons, quizzes, videos, and articles in real-time'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Track Modal */}
      {showAddTrackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">
              {isAr ? 'إضافة مسار تعليمي جديد' : 'Create New Course Track'}
            </h3>

            <form onSubmit={handleCreateTrack} className="space-y-3">
              <input
                type="text"
                placeholder={isAr ? 'اسم المسار بالإنجليزية' : 'Track Title (English)'}
                value={newTrackTitleEn}
                onChange={(e) => setNewTrackTitleEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                required
              />

              <input
                type="text"
                placeholder={isAr ? 'اسم المسار بالعربية' : 'Track Title (Arabic)'}
                value={newTrackTitleAr}
                onChange={(e) => setNewTrackTitleAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                required
              />

              <textarea
                placeholder={isAr ? 'الوصف المختصر للمسار' : 'Track Description'}
                value={newTrackDescEn}
                onChange={(e) => setNewTrackDescEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                rows={3}
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrackModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20"
                >
                  {isAr ? 'حفظ المسار' : 'Create Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">
              {isAr ? 'إضافة فصل تعليمي للمسار' : 'Add Chapter to Track'}
            </h3>

            <form onSubmit={handleCreateChapter} className="space-y-3">
              <input
                type="text"
                placeholder={isAr ? 'عنوان الفصل (الإنجليزية)' : 'Chapter Title (English)'}
                value={newChapterTitleEn}
                onChange={(e) => setNewChapterTitleEn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
                required
              />

              <input
                type="text"
                placeholder={isAr ? 'عنوان الفصل (العربية)' : 'Chapter Title (Arabic)'}
                value={newChapterTitleAr}
                onChange={(e) => setNewChapterTitleAr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold"
                >
                  {isAr ? 'إضافة الفصل' : 'Add Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
