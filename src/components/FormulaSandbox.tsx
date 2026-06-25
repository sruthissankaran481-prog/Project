import React, { useState, useEffect } from 'react';
import { HelpCircle, Users, Heart, MessageSquare, Share2, Sparkles, Award } from 'lucide-react';

interface Preset {
  name: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  badge: string;
}

const PRESETS: Preset[] = [
  {
    name: 'The Micro-Influencer',
    description: 'A small but highly dedicated audience. High intimacy leads to incredible relative results!',
    likes: 180,
    comments: 45,
    shares: 25,
    followers: 2500,
    badge: 'Superstar'
  },
  {
    name: 'The Ghost Giant',
    description: 'A massive follower count, but very low active interest. Highlights why raw follower count is a vanity metric!',
    likes: 250,
    comments: 10,
    shares: 5,
    followers: 80000,
    badge: 'Warning'
  },
  {
    name: 'The Viral Hit',
    description: 'A post that gets shared widely, propelling the interaction counts far beyond normal ranges.',
    likes: 1200,
    comments: 280,
    shares: 520,
    followers: 12000,
    badge: 'Viral'
  }
];

export default function FormulaSandbox() {
  const [likes, setLikes] = useState<number>(150);
  const [comments, setComments] = useState<number>(25);
  const [shares, setShares] = useState<number>(15);
  const [followers, setFollowers] = useState<number>(10000);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const totalInteractions = likes + comments + shares;
  const ratio = followers > 0 ? totalInteractions / followers : 0;
  const engagementRate = ratio * 100;

  const loadPreset = (index: number) => {
    const p = PRESETS[index];
    setLikes(p.likes);
    setComments(p.comments);
    setShares(p.shares);
    setFollowers(p.followers);
    setActivePreset(index);
  };

  // Deselect preset if user changes values manually
  const handleValueChange = (setter: React.Dispatch<React.SetStateAction<number>>, val: number) => {
    setter(val);
    setActivePreset(null);
  };

  return (
    <div id="formula-sandbox-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Title */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 bg-pink-50 text-pink-600 rounded-lg">
            <Sparkles className="h-5 w-5" id="sandbox-icon" />
          </span>
          <h2 className="text-xl font-bold text-slate-800" id="sandbox-title">Formula Sandbox</h2>
        </div>
        <p className="text-slate-500 text-sm">
          Demystifying the core metric: Why do we analyze <strong>Engagement Rate</strong> instead of just counting Likes?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="sandbox-layout">
        {/* Left Column: Sliders and Presets */}
        <div className="lg:col-span-7 space-y-6" id="sandbox-controls">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select an educational scenario:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESETS.map((preset, idx) => (
                <button
                  key={preset.name}
                  onClick={() => loadPreset(idx)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition cursor-pointer ${
                    activePreset === idx
                      ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/10'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  id={`btn-preset-${idx}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm">{preset.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      preset.badge === 'Superstar' ? 'bg-emerald-50 text-emerald-700' :
                      preset.badge === 'Warning' ? 'bg-amber-50 text-amber-700' :
                      'bg-indigo-50 text-indigo-700'
                    }`}>
                      {preset.badge}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Value Adjusters */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>Interactive Simulator</span>
              <span className="text-xs font-normal text-slate-400">(Drag to see changes instantly)</span>
            </h3>

            {/* Likes */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-pink-500 shrink-0" />
                  Likes Count
                </span>
                <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {likes.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2500"
                step="5"
                value={likes}
                onChange={(e) => handleValueChange(setLikes, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                id="slider-likes"
              />
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                  Comments Count
                </span>
                <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {comments.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="5"
                value={comments}
                onChange={(e) => handleValueChange(setComments, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                id="slider-comments"
              />
            </div>

            {/* Shares */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Share2 className="h-4 w-4 text-blue-500 shrink-0" />
                  Shares Count
                </span>
                <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {shares.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="5"
                value={shares}
                onChange={(e) => handleValueChange(setShares, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                id="slider-shares"
              />
            </div>

            {/* Followers */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-purple-500 shrink-0" />
                  Follower Count at time of post
                </span>
                <span className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                  {followers.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="150000"
                step="500"
                value={followers}
                onChange={(e) => handleValueChange(setFollowers, Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                id="slider-followers"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical visualizer */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between" id="sandbox-visualizer">
          <div>
            <h3 className="text-slate-800 font-bold text-sm mb-4 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              How the Math Works
            </h3>

            {/* Math pipeline */}
            <div className="space-y-4" id="math-pipeline">
              {/* Step 1 */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Step 1: Total Interactions
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono">
                    Likes + Comments + Shares
                  </div>
                  <div className="font-mono font-bold text-slate-800">
                    {likes} + {comments} + {shares} ={' '}
                    <span className="text-indigo-600">{totalInteractions}</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Step 2: Interaction Ratio
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono">
                    Total Interactions / Followers
                  </div>
                  <div className="font-mono font-bold text-slate-800">
                    {totalInteractions} / {followers.toLocaleString()} ={' '}
                    <span className="text-indigo-600">{ratio.toFixed(5)}</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Step 3: Convert to Percentage
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono">
                    Ratio * 100
                  </div>
                  <div className="font-mono font-bold text-slate-800">
                    {ratio.toFixed(5)} × 100 ={' '}
                    <span className="text-indigo-600 font-extrabold">{engagementRate.toFixed(3)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large display of result */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 text-center" id="scorecard-container">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Final Engagement Rate
            </span>
            <div className="text-3xl font-extrabold text-indigo-600 font-mono tracking-tight" id="display-engagement-rate">
              {engagementRate.toFixed(2)}%
            </div>

            {/* Performance assessment badge */}
            <div className="mt-3 flex justify-center">
              {engagementRate >= 5 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  <Award className="h-3.5 w-3.5" /> Excellent Performance
                </span>
              ) : engagementRate >= 2.5 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                  <Award className="h-3.5 w-3.5" /> Healthy Average
                </span>
              ) : engagementRate >= 1.0 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                  Moderate Engagement
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                  Low Reach / engagement
                </span>
              )}
            </div>
            
            <p className="text-slate-400 text-[11px] leading-relaxed mt-4">
              *A healthy standard for organic social media is <strong>2.5% to 5.0%</strong>. 
              Higher means your content is deeply capturing your followers' attention!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
