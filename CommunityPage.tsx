import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';
import {
  Users,
  MessageSquare,
  Share2,
  ExternalLink,
  Flame,
  Award,
  Globe,
  PlusCircle,
  ThumbsUp,
  Sparkles,
  Code2
} from 'lucide-react';

interface CommunityPageProps {
  language: Language;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ language }) => {
  const t = getTranslation(language);
  const isAr = language === 'ar';

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Ahmad_Dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      titleAr: 'كيف قمت ببناء منصة إدارة مهام متكاملة في 5 دقائق باستخدام AI Copilot',
      titleEn: 'How I built a complete SaaS task management app in 5 mins with AI Copilot',
      likes: 142,
      comments: 38,
      tag: 'Showcase',
      time: '2h ago',
    },
    {
      id: 2,
      author: 'Sarah_Engineering',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      titleAr: 'دليل استخدام WebSocket للاتصال المباشر بين سيرفرات Node والمحرر',
      titleEn: 'Guide: Real-time WebSockets setup between Node servers & Cloud IDE',
      likes: 98,
      comments: 21,
      tag: 'Tutorial',
      time: '5h ago',
    },
    {
      id: 3,
      author: 'Marcus_Vortex',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      titleAr: 'إطلاق قالب متجر إلكتروني مع الربط المباشر ببوابة دفق المبيعات',
      titleEn: 'Released Next.js E-Commerce template with real payment gateway hooks',
      likes: 210,
      comments: 54,
      tag: 'Templates',
      time: '1d ago',
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim()) {
      const newP = {
        id: Date.now(),
        author: 'Developer_You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        titleAr: newPostTitle,
        titleEn: newPostTitle,
        likes: 1,
        comments: 0,
        tag: 'Community',
        time: 'Just now',
      };
      setPosts([newP, ...posts]);
      setNewPostTitle('');
      setShowNewPostForm(false);
    }
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/80 border border-orange-500/30 text-orange-400 text-xs font-black">
            <Users className="w-4 h-4" />
            <span>{t('community')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isAr ? 'مجتمع المطورين العالمي' : 'Global Developer Community Hub'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base">
            {isAr
              ? 'تواصل مع أكثر من 50,000 مهندس ومطور، شارك مشاريعك، واستفد من تجارب مجتمع CloudForge.'
              : 'Connect with 50,000+ engineers, share your builds, and collaborate across Reddit & Discord.'}
          </p>

          {/* Social Community Quick Buttons */}
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a
              href="https://reddit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#FF4500]/20 border border-[#FF4500]/50 text-[#FF4500] hover:bg-[#FF4500] hover:text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
            >
              <Globe className="w-4 h-4" />
              <span>Reddit r/cloudforge</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#5865F2] hover:bg-[#5865F2] hover:text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discord Server (Live Chat)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Community Discussion Board Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white">{isAr ? 'نقاشات وشروحات المطورين الحية' : 'Live Developer Discussions'}</h2>
          </div>

          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAr ? 'إضافة منشور جديد' : 'New Discussion Post'}</span>
          </button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white">{isAr ? 'اكتب عنوان منشورك للمجتمع' : 'Write your community topic'}</h3>
            <input
              type="text"
              required
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder={isAr ? 'عنوان المنشور أو فكرة المشروع...' : 'Post title or project showcase idea...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00F2FE] text-slate-950 font-bold text-xs"
              >
                {isAr ? 'نشر الآن' : 'Publish'}
              </button>
            </div>
          </form>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-cyan-400">@{post.author}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">{post.tag}</span>
                    <span className="text-[10px] text-slate-500">{post.time}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer">
                    {isAr ? post.titleAr : post.titleEn}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleLike(post.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{post.likes}</span>
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
