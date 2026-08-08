import React, { useState } from 'react';
import { Language } from './types';
import { useTranslation } from './locales';
import {
  Users,
  MessageSquare,
  Sparkles,
  Share2,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Code2,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Send,
  Zap,
  Globe,
  Compass,
  TrendingUp,
  Award,
  Hash
} from 'lucide-react';

interface CommunityPageProps {
  language: Language;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ language }) => {
  const isAr = language === 'ar';
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'all' | 'discussions' | 'showcase' | 'qa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostText, setNewPostText] = useState('');

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Ahmad Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Pro Member',
      time: isAr ? 'منذ ساعتين' : '2h ago',
      category: 'showcase',
      title: isAr ? 'منصة إدارة مشاريع سحابية مصممة بـ React & Vite' : 'Cloud Project Management Platform built with React & Vite',
      content: isAr 
        ? 'شاركت معكم هذا المشروع الذي بنيته بالكامل بطلب من الذكاء الاصطناعي في CloudForge! يحتوي على لوحة تحكم كاملة واستجابة سريعة.'
        : 'Check out this full dashboard built entirely using CloudForge AI assistant! Fully responsive with dark mode support.',
      likes: 24,
      comments: 7,
      tags: ['React', 'Tailwind', 'CloudForge'],
      isLiked: false,
    },
    {
      id: 2,
      author: 'Sarah Lin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: 'Community Mod',
      time: isAr ? 'منذ 5 ساعات' : '5h ago',
      category: 'discussions',
      title: isAr ? 'ما هي أفضل الممارسات لتحسين أداء برامج React 19؟' : 'Best practices for performance optimization in React 19?',
      content: isAr
        ? 'أبحث عن تجاربكم مع التحديثات الأخيرة في React وكيفية الموازنة بين ميزات تحسين الأداء التلقائي وتقليل استهلاك الذاكرة.'
        : 'Looking for community insights on how React 19 server components and automatic memoization are impacting your app load speeds.',
      likes: 18,
      comments: 12,
      tags: ['React19', 'Performance', 'WebDev'],
      isLiked: false,
    },
    {
      id: 3,
      author: 'Youssef Al-Sabah',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      role: 'Core Contributor',
      time: isAr ? 'منذ يوم واحد' : '1d ago',
      category: 'qa',
      title: isAr ? 'كيف يمكن ربط خادم Node.js مع بروتوكولات العقد السحابية في Vercel؟' : 'How to bind Node.js backend with Vercel Cloud Serverless?',
      content: isAr
        ? 'هل ينصح باستخدام خادم Express مستقل مع Vercel أم الاعتماد كلياً على Serverless Functions للحصول على أفضل سرعة استجابة؟'
        : 'Should I deploy a standalone Express server alongside Vercel or strictly stick to Serverless Functions for minimal latency?',
      likes: 31,
      comments: 15,
      tags: ['NodeJS', 'Vercel', 'Backend'],
      isLiked: false,
    }
  ]);

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: isAr ? 'السيد علي' : 'Mr. Ali',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      role: 'VIP Member',
      time: isAr ? 'الآن' : 'Just now',
      category: 'discussions',
      title: isAr ? 'منشور جديد من مجتمع المطورين' : 'New Developer Community Post',
      content: newPostText,
      likes: 1,
      comments: 0,
      tags: ['CloudForge', 'DevCommunity'],
      isLiked: true,
    };

    setPosts([newPostObj, ...posts]);
    setNewPostText('');
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeTab === 'all' || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0D1527] via-[#111A33] to-[#180F2E] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[#00F2FE] text-xs font-bold font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>{isAr ? 'مجتمع مطوري CloudForge' : 'CloudForge Developer Community'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {isAr ? 'تواصل، شارك خبراتك، وابنِ المستقبل' : 'Connect, Share & Build Together'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'انضم إلى آلاف المطورين والمصممين لتبادل الأفكار، عرض مشاريعك البرمجية، والحصول على المساعدة التقنية التفاعلية.'
                : 'Join thousands of developers and creators to exchange ideas, showcase projects, and solve complex technical challenges.'}
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Create Post Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F2FE] to-purple-600 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-400 text-sm">
                    AF
                  </div>
                </div>
                <input
                  type="text"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={isAr ? 'اكتب مناقشة أو شارك مشروعك الجديد...' : 'Start a discussion or share a project...'}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
                />
              </div>

              {newPostText.trim() && (
                <div className="flex justify-end pt-2 border-t border-slate-800/80">
                  <button
                    onClick={handleCreatePost}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-blue-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:scale-102 transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نشر الآن' : 'Publish Post'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5">
              
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-cyan-950 text-[#00F2FE] border border-cyan-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {isAr ? 'الكل' : 'All Posts'}
                </button>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'discussions'
                      ? 'bg-cyan-950 text-[#00F2FE] border border-cyan-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {isAr ? 'نقاشات' : 'Discussions'}
                </button>
                <button
                  onClick={() => setActiveTab('showcase')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'showcase'
                      ? 'bg-cyan-950 text-[#00F2FE] border border-cyan-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {isAr ? 'معرض المشاريع' : 'Showcase'}
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'qa'
                      ? 'bg-cyan-950 text-[#00F2FE] border border-cyan-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {isAr ? 'أسئلة وأجوبة' : 'Q&A'}
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 rtl:left-auto rtl:right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'بحث في المنشورات...' : 'Search posts...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Posts Feed List */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700/80 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-white">{post.author}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-800/60 text-purple-300 text-[10px] font-mono">
                            {post.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{post.time}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-100 hover:text-[#00F2FE] cursor-pointer transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-mono"
                      >
                        <Hash className="w-3 h-3 text-cyan-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-all ${
                        post.isLiked ? 'text-[#00F2FE]' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments} {isAr ? 'تعليقات' : 'Comments'}</span>
                      </span>

                      <span className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
                        <Share2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Community Stats */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00F2FE]" />
                <span>{isAr ? 'إحصائيات المجتمع' : 'Community Stats'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'الأعضاء' : 'Members'}</span>
                  <div className="text-lg font-black text-white">12,480+</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{isAr ? 'المشاريع' : 'Projects'}</span>
                  <div className="text-lg font-black text-[#00F2FE]">3,920+</div>
                </div>
              </div>
            </div>

            {/* Top Trending Topics */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'المواضيع الأكثر تفاعلاً' : 'Trending Topics'}</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition-all">
                  <div className="font-extrabold text-slate-200">#React19_Features</div>
                  <span className="text-[10px] text-slate-500">142 {isAr ? 'منشور هذا الأسبوع' : 'posts this week'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition-all">
                  <div className="font-extrabold text-slate-200">#CloudForge_AI</div>
                  <span className="text-[10px] text-slate-500">98 {isAr ? 'منشور هذا الأسبوع' : 'posts this week'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition-all">
                  <div className="font-extrabold text-slate-200">#Vercel_Deployments</div>
                  <span className="text-[10px] text-slate-500">64 {isAr ? 'منشور هذا الأسبوع' : 'posts this week'}</span>
                </div>
              </div>
            </div>

            {/* Official Links */}
            <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 rounded-2xl p-5 space-y-3 text-xs">
              <h4 className="font-extrabold text-purple-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{isAr ? 'قنوات التواجد الرسمية' : 'Official Channels'}</span>
              </h4>
              <p className="text-slate-400 text-[11px]">
                {isAr ? 'انضم إلى قناتنا على Discord و Telegram للحصول على دعم مباشر وسريع.' : 'Join our Discord server and Telegram for direct technical discussion.'}
              </p>
              
              <div className="space-y-2 pt-1">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold flex items-center justify-between transition-all"
                >
                  <span>Discord Community</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
