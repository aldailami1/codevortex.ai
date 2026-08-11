import React, { useState } from 'react';
import { QuizQuestion, Exam } from '@/types/academy';
import { CheckCircle2, XCircle, RefreshCw, Award, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuizProps {
  exam: Exam;
  isArabic: boolean;
  onPass: (score: number) => void;
  onFail?: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ exam, isArabic, onPass, onFail }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scorePercent, setScorePercent] = useState<number>(0);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    exam.questions.forEach((q) => {
      const selectedOptId = userAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selectedOptId && correctOption && selectedOptId === correctOption.id) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / exam.questions.length) * 100);
    setScorePercent(calculatedScore);
    setSubmitted(true);

    if (calculatedScore >= exam.passingScore) {
      onPass(calculatedScore);
    } else if (onFail) {
      onFail(calculatedScore);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScorePercent(0);
  };

  const allAnswered = exam.questions.every((q) => userAnswers[q.id] !== undefined);
  const isPassed = submitted && scorePercent >= exam.passingScore;

  return (
    <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            {isArabic ? `نسبة الاجتياز المطلوبة: ${exam.passingScore}%` : `Passing Threshold: ${exam.passingScore}%`}
          </div>
          <h2 className="text-2xl font-black text-white">
            {isArabic ? exam.titleAr : exam.titleEn}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isArabic ? exam.descriptionAr : exam.descriptionEn}
          </p>
        </div>

        {submitted && (
          <div
            className={`px-5 py-3 rounded-2xl border text-center font-extrabold flex flex-col items-center justify-center min-w-[140px] ${
              isPassed
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-400'
            }`}
          >
            <span className="text-3xl font-black">{scorePercent}%</span>
            <span className="text-xs uppercase tracking-wider mt-0.5">
              {isPassed ? (isArabic ? 'اجتياز بنجاح 🎉' : 'PASSED 🎉') : (isArabic ? 'لم يجتاز ❌' : 'FAILED ❌')}
            </span>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {exam.questions.map((q, idx) => {
          const selectedOptId = userAnswers[q.id];
          const correctOption = q.options.find((o) => o.isCorrect);

          return (
            <div
              key={q.id}
              className="bg-[#111827] border border-slate-800/90 rounded-2xl p-5 md:p-6 space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <h3 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
                  {isArabic ? q.questionAr : q.questionEn}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {q.options.map((opt) => {
                  const isSelected = selectedOptId === opt.id;
                  let optStyle =
                    'border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50';

                  if (submitted) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300 font-semibold';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-300 font-semibold';
                    } else {
                      optStyle = 'border-slate-800/40 bg-slate-900/20 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-cyan-500/80 bg-cyan-950/50 text-cyan-200 font-semibold shadow-lg shadow-cyan-950/30';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      disabled={submitted}
                      className={`w-full text-start p-4 rounded-xl border transition-all flex items-center justify-between text-sm md:text-base ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                              : 'border-slate-700 bg-slate-950 text-slate-400'
                          }`}
                        >
                          {opt.id.charAt(opt.id.length - 1).toUpperCase()}
                        </span>
                        <span>{isArabic ? opt.textAr : opt.textEn}</span>
                      </div>

                      {submitted && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {submitted && isSelected && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback when submitted */}
              {submitted && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs md:text-sm text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>{isArabic ? 'الشرح والتوضيح العلمي:' : 'Explanation:'}</span>
                  </div>
                  <p className="leading-relaxed text-slate-400 pl-6">
                    {isArabic ? q.explanationAr : q.explanationEn}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              allAnswered
                ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 hover:scale-105 shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{isArabic ? 'تسليم وإرسال الاجابات' : 'Submit Exam Responses'}</span>
            {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isPassed && (
              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-100 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>{isArabic ? 'إعادة الاختبار للوصول إلى 80%' : 'Retry Exam to reach 80%'}</span>
              </button>
            )}

            {isPassed && (
              <div className="text-emerald-400 font-extrabold text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>
                  {isArabic
                    ? 'تهانينا! لقد حققت نسبة النجاح المطلوبة وتم فتح الشهادة المعتمدة بنجاح.'
                    : 'Congratulations! You passed the required grade and unlocked your official certificate.'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
