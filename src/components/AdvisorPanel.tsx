import React from 'react';
import { Lightbulb, Calendar, Compass, ArrowUpRight, CheckCircle, Smartphone } from 'lucide-react';

interface Recommendation {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  concept: string;
  proof: string;
  actionItems: string[];
  color: string;
}

export default function AdvisorPanel() {
  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: 'Embrace Multi-Page "Carousels" & Video Reels',
      subtitle: 'Double-down on interactive formats over single images',
      icon: <Smartphone className="h-6 w-6 text-indigo-600" />,
      concept: 'Our data clearly reveals that users love "swiping" and "watching". Format formats that demand active attention (like Carousels and Video Reels) outpace static images by over 2.5x in engagement.',
      proof: 'Across all channels, Carousel posts achieved the highest average engagement (~6.8%), followed closely by Video format (~5.5%). Single static images average only ~2.2% because they are easily scrolled past.',
      actionItems: [
        'Turn checklist-style blogs into 5-page PDF slide decks (Carousels) on LinkedIn.',
        'Record quick 30-second speaking videos instead of posting plain text announcements.',
        'Add a clear final slide saying "Swipe Left for the tip!" to prompt interactive engagement.'
      ],
      color: 'indigo'
    },
    {
      id: 2,
      title: 'Match Your Posting Hours to Channel Rhythms',
      subtitle: 'Schedule posts based on user lifestyles, not convenience',
      icon: <Calendar className="h-6 w-6 text-emerald-600" />,
      concept: 'Users browse different platforms at entirely different times of day. Professionals check LinkedIn when beginning their workday, while people scroll Instagram to relax in the evening.',
      proof: 'LinkedIn engagement peaks in the Morning (~7.2%) and falls off a cliff in the evening. Conversely, Instagram engagement is highest in the Evening (~5.8%), especially for Videos.',
      actionItems: [
        'Schedule educational LinkedIn posts to drop between 8:00 AM and 9:30 AM local time.',
        'Post Instagram Reels and Carousel stories strictly in the evening, between 6:00 PM and 8:00 PM.',
        'Keep Twitter updates focused on the Afternoon lunch hours (12:00 PM to 2:00 PM).'
      ],
      color: 'emerald'
    },
    {
      id: 3,
      title: 'Tailor Your Voice - Stop Mirror Posting',
      subtitle: 'Adapt format and tone to fit the platform culture',
      icon: <Compass className="h-6 w-6 text-blue-600" />,
      concept: 'Each platform has its own unique superpower. Copy-pasting the exact same image and text across all three platforms dilutes your brand and ignores what makes each channel special.',
      proof: 'LinkedIn drives the highest organic engagement rate (~5.5%) for detailed industry lessons. Twitter gets lower relative rates (~1.8%) but leads in high-viral Shares/Retweets for punchy, concise texts.',
      actionItems: [
        'Use LinkedIn as your authority-builder (detailed lessons, PDF slides).',
        'Use Instagram as your relationship-builder (authentic video reels, team stories).',
        'Use Twitter as your conversational networking hub (short text tips, polls, afternoon replies).'
      ],
      color: 'blue'
    }
  ];

  return (
    <div id="advisor-panel-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Title */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Lightbulb className="h-5 w-5" id="advisor-icon" />
          </span>
          <h2 className="text-xl font-bold text-slate-800" id="advisor-title">Content Strategy Recommendations</h2>
        </div>
        <p className="text-slate-500 text-sm">
          A beginner-friendly marketing guide tailored for a small business social media manager, backed entirely by our dataset.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="recommendations-grid">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col h-full bg-slate-50/50 hover:bg-slate-50 transition border border-slate-200/50 rounded-2xl p-5"
            id={`rec-card-${rec.id}`}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <span className={`p-2.5 rounded-xl bg-white shadow-xs border border-slate-100`}>
                {rec.icon}
              </span>
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Recommendation #{rec.id}</span>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mt-0.5">{rec.title}</h3>
              </div>
            </div>

            <p className="text-slate-400 text-xs italic mb-4">
              "{rec.subtitle}"
            </p>

            {/* Core Explanation */}
            <div className="space-y-4 flex-1">
              {/* Concept */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  The Concept
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {rec.concept}
                </p>
              </div>

              {/* Data Proof */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/40">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  What the Data Says (Proof)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  {rec.proof}
                </p>
              </div>

              {/* Action items */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Your 3-Step Action Plan
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {rec.actionItems.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center gap-4 text-slate-700" id="advisor-footer">
        <Lightbulb className="h-8 w-8 text-indigo-600 shrink-0" />
        <div className="text-sm leading-relaxed">
          <strong className="text-indigo-900 font-bold block mb-1">Takeaway for Small Business Managers:</strong>
          Data analytics isn’t about chasing abstract numbers—it is about identifying patterns of human behavior. By posting the <strong>right format</strong> (carousels/videos) at the <strong>right hour</strong> (morning for B2B, evening for B2C) on the <strong>right channel</strong>, you can easily double your marketing effectiveness without spending an extra dollar!
        </div>
      </div>
    </div>
  );
}
