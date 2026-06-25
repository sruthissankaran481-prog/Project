import React, { useState, useEffect, useMemo } from 'react';
import { PostRecord, ActiveTabType } from './types';
import { generateDataset } from './data/dataset';
import DatasetExplorer from './components/DatasetExplorer';
import FormulaSandbox from './components/FormulaSandbox';
import PythonMentor from './components/PythonMentor';
import AdvisorPanel from './components/AdvisorPanel';
import MentorChat from './components/MentorChat';
import { GraduationCap, Table, Calculator, Code, Lightbulb, MessageSquare, TrendingUp, Users, Percent, Award } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<PostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dataset');

  // Load dataset on start
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Try fetching from Express backend
        const res = await fetch('/api/dataset');
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
          console.log('[App] Loaded dataset from backend API.');
        } else {
          throw new Error('Backend returned non-OK status');
        }
      } catch (err) {
        console.warn('[App] Backend fetch failed or not running yet. Falling back to local dataset generator.', err);
        // Fallback to client-side generation
        const generated = generateDataset();
        setData(generated);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Overall Key Metrics of the Dataset
  const stats = useMemo(() => {
    if (data.length === 0) return { totalPosts: 0, avgRate: 0, bestPlatform: 'N/A', totalFollowers: 0 };
    
    // Total posts
    const totalPosts = data.length;
    
    // Avg engagement rate
    const sumRates = data.reduce((acc, row) => acc + row.engagementRate, 0);
    const avgRate = Number((sumRates / totalPosts).toFixed(2));
    
    // Latest follower count
    const totalFollowers = data[totalPosts - 1]?.followerCount || 0;
    
    // Best Platform by engagement
    const platformTotals: Record<string, { total: number; count: number }> = {};
    data.forEach(item => {
      if (!platformTotals[item.platform]) {
        platformTotals[item.platform] = { total: 0, count: 0 };
      }
      platformTotals[item.platform].total += item.engagementRate;
      platformTotals[item.platform].count += 1;
    });
    
    let bestPlatform = 'LinkedIn';
    let bestAvg = 0;
    Object.keys(platformTotals).forEach(p => {
      const avg = platformTotals[p].total / platformTotals[p].count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestPlatform = p;
      }
    });

    return { totalPosts, avgRate, bestPlatform, totalFollowers };
  }, [data]);

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Dynamic Banner Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 shrink-0" id="main-header">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-sm text-white">
              <GraduationCap className="h-6 w-6" id="header-cap-icon" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" id="app-title">
                Social Media Engagement Mentor
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                Beginner-Friendly Data Analytics Sandbox
              </p>
            </div>
          </div>

          {/* Quick Context / Learning Badges */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60" id="badge-container">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Curriculum</span>
              <span className="text-xs font-semibold text-white">Project: Social Media Engagement</span>
            </div>
            <span className="h-6 w-px bg-slate-700"></span>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-[10px] rounded-lg uppercase tracking-wider border border-indigo-500/30">
              Beginner Level
            </span>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6" id="main-content">
        
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6" id="welcome-section">
          <div className="space-y-2 max-w-2xl text-left">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <span className="text-indigo-400">👋</span> Welcome to your Data Analytics Lab!
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
              Analyzing metrics is like putting on glasses—suddenly, the blurry actions of your audience become crystal-clear trends. We have generated a realistic log of <strong>300 posts</strong> to help you learn the ropes. Work through the tabs below to master the formula, study Python, and formulate high-impact strategies!
            </p>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0" id="stat-cards-grid">
            
            {/* Stat Card 1 */}
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-left min-w-[125px]">
              <span className="text-indigo-300 text-[10px] font-bold uppercase block tracking-wider">Total Posts Logged</span>
              <span className="font-mono text-xl font-black mt-0.5 block">{stats.totalPosts}</span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Jan - Jun 2026</span>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-left min-w-[125px]">
              <span className="text-indigo-300 text-[10px] font-bold uppercase block tracking-wider">Avg Engagement</span>
              <span className="font-mono text-xl font-black text-emerald-400 mt-0.5 block flex items-center gap-1">
                {stats.avgRate}% <Percent className="h-4 w-4 shrink-0" />
              </span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Healthy organic standard</span>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-left min-w-[125px]">
              <span className="text-indigo-300 text-[10px] font-bold uppercase block tracking-wider">Current Followers</span>
              <span className="font-mono text-xl font-black mt-0.5 block flex items-center gap-1">
                <Users className="h-4 w-4 text-indigo-300 shrink-0" /> {stats.totalFollowers.toLocaleString()}
              </span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Growing organic brand</span>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-left min-w-[125px]">
              <span className="text-indigo-300 text-[10px] font-bold uppercase block tracking-wider">Top platform</span>
              <span className="font-mono text-xl font-black text-amber-300 mt-0.5 block flex items-center gap-1">
                <Award className="h-4.5 w-4.5 text-amber-300 shrink-0" /> {stats.bestPlatform}
              </span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Driven by Carousels</span>
            </div>

          </div>
        </section>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-2xl max-w-full overflow-x-auto border border-slate-200" id="tabs-navigation">
          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'dataset'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
            }`}
            id="tab-btn-dataset"
          >
            <Table className="h-4 w-4" />
            1. Dataset Explorer
          </button>
          
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'sandbox'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
            }`}
            id="tab-btn-sandbox"
          >
            <Calculator className="h-4 w-4" />
            2. Formula Sandbox
          </button>
          
          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'python'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
            }`}
            id="tab-btn-python"
          >
            <Code className="h-4 w-4" />
            3. Python Code Mentor
          </button>
          
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'recommendations'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
            }`}
            id="tab-btn-recommendations"
          >
            <Lightbulb className="h-4 w-4" />
            4. Strategic Advisor
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
            }`}
            id="tab-btn-chat"
          >
            <MessageSquare className="h-4 w-4" />
            5. Ask Professor Taylor
          </button>
        </nav>

        {/* Tab Contents */}
        <section className="transition duration-300" id="tab-content-area">
          {activeTab === 'dataset' && (
            <DatasetExplorer data={data} isLoading={isLoading} />
          )}

          {activeTab === 'sandbox' && (
            <FormulaSandbox />
          )}

          {activeTab === 'python' && (
            <PythonMentor data={data} />
          )}

          {activeTab === 'recommendations' && (
            <AdvisorPanel />
          )}

          {activeTab === 'chat' && (
            <MentorChat />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 mt-12 text-center text-xs shrink-0" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Social Media Engagement Analysis Mentor. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Project Dataset: <strong className="text-slate-400">social_media_engagement.csv</strong> (generated)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
