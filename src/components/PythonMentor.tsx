import React, { useState, useMemo, useEffect } from 'react';
import { PostRecord } from '../types';
import { Play, Terminal, Code, BarChart2, BookOpen, Check, ArrowRight } from 'lucide-react';

interface PythonMentorProps {
  data: PostRecord[];
}

type CodeTab = 'platform' | 'content_type' | 'posting_time';

export default function PythonMentor({ data }: PythonMentorProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('platform');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState<Record<CodeTab, boolean>>({
    platform: false,
    content_type: false,
    posting_time: false
  });
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  // 1. Calculate Real Live Stats for Platform Comparison
  const platformStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    data.forEach(item => {
      if (!stats[item.platform]) stats[item.platform] = { total: 0, count: 0 };
      stats[item.platform].total += item.engagementRate;
      stats[item.platform].count += 1;
    });
    return Object.keys(stats).map(p => ({
      name: p,
      value: Number((stats[p].total / stats[p].count).toFixed(2))
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  // 2. Calculate Real Live Stats for Content Type Analysis
  const contentTypeStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    data.forEach(item => {
      if (!stats[item.contentType]) stats[item.contentType] = { total: 0, count: 0 };
      stats[item.contentType].total += item.engagementRate;
      stats[item.contentType].count += 1;
    });
    return Object.keys(stats).map(c => ({
      name: c,
      value: Number((stats[c].total / stats[c].count).toFixed(2))
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  // 3. Calculate Real Live Stats for Posting Time Comparison
  const postingTimeStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    data.forEach(item => {
      if (!stats[item.postingTime]) stats[item.postingTime] = { total: 0, count: 0 };
      stats[item.postingTime].total += item.engagementRate;
      stats[item.postingTime].count += 1;
    });
    // Hard order: Morning, Afternoon, Evening
    const order = ['Morning', 'Afternoon', 'Evening'];
    return order.map(t => {
      const s = stats[t] || { total: 0, count: 1 };
      return {
        name: t,
        value: Number((s.total / s.count).toFixed(2))
      };
    });
  }, [data]);

  // Calculate platform-specific posting time stats for richer insight
  const platformPostingTimeStats = useMemo(() => {
    const stats: Record<string, Record<string, { total: number; count: number }>> = {};
    data.forEach(item => {
      if (!stats[item.platform]) stats[item.platform] = {};
      if (!stats[item.platform][item.postingTime]) stats[item.platform][item.postingTime] = { total: 0, count: 0 };
      stats[item.platform][item.postingTime].total += item.engagementRate;
      stats[item.platform][item.postingTime].count += 1;
    });
    return stats;
  }, [data]);

  const runCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalLines([]);

    const scriptName = 
      activeTab === 'platform' ? 'platform_analysis.py' :
      activeTab === 'content_type' ? 'content_type_analysis.py' :
      'posting_time_analysis.py';

    const lines = [
      `$ python ${scriptName}`,
      `>>> Loading dataset: 'social_media_engagement.csv'...`,
      `>>> Successfully loaded 300 rows of post data.`,
      `>>> Executing pandas operations...`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < lines.length) {
        setTerminalLines(prev => [...prev, lines[step]]);
        step++;
      } else {
        clearInterval(interval);
        // Output final data results based on active tab
        setTimeout(() => {
          if (activeTab === 'platform') {
            setTerminalLines(prev => [
              ...prev,
              `>>> Grouping by 'Platform' and calculating mean of 'Engagement Rate (%)'...`,
              `\nOutput Results:`,
              `-----------------------------------------`,
              `  Platform   |  Average Engagement Rate  `,
              `-----------------------------------------`,
              ...platformStats.map(stat => `  ${stat.name.padEnd(10)} |  ${stat.value.toFixed(2)}%`),
              `-----------------------------------------`,
              `>>> Plotting Bar Chart...`,
              `>>> Process finished with Exit Code 0.`
            ]);
          } else if (activeTab === 'content_type') {
            setTerminalLines(prev => [
              ...prev,
              `>>> Grouping by 'Content Type' and calculating mean of 'Engagement Rate (%)'...`,
              `\nOutput Results:`,
              `-----------------------------------------`,
              `  Content Type |  Average Engagement Rate `,
              `-----------------------------------------`,
              ...contentTypeStats.map(stat => `  ${stat.name.padEnd(12)} |  ${stat.value.toFixed(2)}%`),
              `-----------------------------------------`,
              `>>> Highest performing format: ${contentTypeStats[0]?.name}`,
              `>>> Plotting Horizontal Bar Chart...`,
              `>>> Process finished with Exit Code 0.`
            ]);
          } else {
            setTerminalLines(prev => [
              ...prev,
              `>>> Grouping by 'Posting Time' and calculating mean of 'Engagement Rate (%)'...`,
              `\nOutput Results:`,
              `-----------------------------------------`,
              `  Posting Time |  Average Engagement Rate `,
              `-----------------------------------------`,
              ...postingTimeStats.map(stat => `  ${stat.name.padEnd(12)} |  ${stat.value.toFixed(2)}%`),
              `-----------------------------------------`,
              `>>> Instagram's Best: Evening (${(platformPostingTimeStats['Instagram']?.['Evening']?.total / platformPostingTimeStats['Instagram']?.['Evening']?.count || 0).toFixed(2)}%)`,
              `>>> LinkedIn's Best: Morning (${(platformPostingTimeStats['LinkedIn']?.['Morning']?.total / platformPostingTimeStats['LinkedIn']?.['Morning']?.count || 0).toFixed(2)}%)`,
              `>>> Plotting Grouped Bar Chart...`,
              `>>> Process finished with Exit Code 0.`
            ]);
          }
          setIsRunning(false);
          setHasRun(prev => ({ ...prev, [activeTab]: true }));
        }, 800);
      }
    }, 300);
  };

  // Reset run state if switching tab
  useEffect(() => {
    setTerminalLines([]);
  }, [activeTab]);

  // Code snippets for each tab
  const pythonCodes = {
    platform: `import pandas as pd
import matplotlib.pyplot as plt

# 1. Load the generated dataset
df = pd.read_csv('social_media_engagement.csv')

# 2. Group by Platform and calculate average Engagement Rate
# This tells us which social channel connects best with our followers.
platform_avg = df.groupby('Platform')['Engagement Rate (%)'].mean().reset_index()

# Sort results for cleaner visualization
platform_avg = platform_avg.sort_values(by='Engagement Rate (%)', ascending=False)

print("Average Engagement Rate by Platform:")
print(platform_avg.to_string(index=False))

# 3. Create a bar chart using matplotlib
plt.figure(figsize=(8, 5))
colors = ['#0a66c2', '#ec4899', '#1da1f2'] # Matching professional brand colors
plt.bar(platform_avg['Platform'], platform_avg['Engagement Rate (%)'], color=colors)

plt.title('Average Engagement Rate by Platform', fontsize=14, pad=15)
plt.xlabel('Social Media Platform', fontsize=11)
plt.ylabel('Average Engagement Rate (%)', fontsize=11)
plt.grid(axis='y', linestyle='--', alpha=0.5)

# Render chart
plt.tight_layout()
plt.show()`,

    content_type: `import pandas as pd
import matplotlib.pyplot as plt

# 1. Load the generated dataset
df = pd.read_csv('social_media_engagement.csv')

# 2. Analyze which Content Type drives the highest engagement
# Helps us understand if users prefer Videos, Carousels, Images, or text.
content_avg = df.groupby('Content Type')['Engagement Rate (%)'].mean().reset_index()
content_avg = content_avg.sort_values(by='Engagement Rate (%)', ascending=False)

print("Average Engagement Rate by Content Type:")
print(content_avg.to_string(index=False))

# 3. Create a horizontal bar chart
plt.figure(figsize=(9, 5))
plt.barh(content_avg['Content Type'], content_avg['Engagement Rate (%)'], color='#6366f1')

plt.title('Best Content Format by Engagement Rate', fontsize=14, pad=15)
plt.xlabel('Average Engagement Rate (%)', fontsize=11)
plt.ylabel('Format Type', fontsize=11)
plt.gca().invert_yaxis() # Highest bar on top
plt.grid(axis='x', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()`,

    posting_time: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Load the generated dataset
df = pd.read_csv('social_media_engagement.csv')

# 2. Group by Posting Time to see overall averages
time_avg = df.groupby('Posting Time')['Engagement Rate (%)'].mean().reset_index()
print("Overall Performance by Posting Time:")
print(time_avg)

# 3. Double-click analysis: Does the best time change depending on the platform?
# We construct a pivot table to compare times across platforms.
pivot_df = df.pivot_table(
    values='Engagement Rate (%)', 
    index='Platform', 
    columns='Posting Time', 
    aggfunc='mean'
)
print("\\nPlatform vs. Posting Time Engagement Grid:")
print(pivot_df)

# 4. Draw a grouped bar chart using seaborn
plt.figure(figsize=(10, 6))
sns.barplot(x='Platform', y='Engagement Rate (%)', hue='Posting Time', data=df, ci=None)

plt.title('Posting Time Effectiveness by Platform', fontsize=14, pad=15)
plt.ylabel('Average Engagement Rate (%)', fontsize=11)
plt.xlabel('Platform', fontsize=11)
plt.grid(axis='y', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()`
  };

  // Line by line breakdown of active code
  const codeExplanations = {
    platform: [
      { line: 'import pandas as pd', desc: 'Loads "Pandas", the standard Python tool for working with tables (DataFrames).' },
      { line: "df = pd.read_csv('...')", desc: 'Reads our 300-row social media CSV file into memory as a table named "df".' },
      { line: "df.groupby('Platform')['...'].mean()", desc: 'Groups posts by Platform (LinkedIn/Instagram/Twitter) and averages their Engagement Rates.' },
      { line: 'plt.bar(...)', desc: 'Uses Matplotlib to draw a beautiful vertical bar chart of the computed averages.' }
    ],
    content_type: [
      { line: "df.groupby('Content Type')", desc: 'Groups the data by media type (Video, Carousel, Image, Text) to isolate their stats.' },
      { line: '.sort_values(..., ascending=False)', desc: 'Sorts the results from highest engagement rate to lowest so the best is at the top.' },
      { line: 'plt.barh(...)', desc: 'Plots a horizontal bar chart, which is perfect for comparing categorical items cleanly.' }
    ],
    posting_time: [
      { line: 'df.pivot_table(...)', desc: 'Creates a cross-tabulation table mapping Platforms against Posting Times (Morning vs Afternoon vs Evening).' },
      { line: "sns.barplot(..., hue='Posting Time')", desc: 'Uses Seaborn (a plotting library) to draw grouped bars, color-coded by posting time.' }
    ]
  };

  const getActiveChartStats = () => {
    if (activeTab === 'platform') return platformStats;
    if (activeTab === 'content_type') return contentTypeStats;
    return postingTimeStats;
  };

  const activeStats = getActiveChartStats();
  const maxStatValue = useMemo(() => {
    return Math.max(...activeStats.map(s => s.value), 1);
  }, [activeStats]);

  return (
    <div id="python-mentor-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Code className="h-5 w-5" id="code-icon" />
          </span>
          <h2 className="text-xl font-bold text-slate-800" id="mentor-title">Python Code Mentor</h2>
        </div>
        <p className="text-slate-500 text-sm">
          Learn real-world data analysis with Python. Switch tasks, inspect the code, and click <strong>Run Code</strong> to simulate the analysis!
        </p>
      </div>

      {/* Task Switcher */}
      <div className="flex flex-wrap gap-2 mb-6" id="python-tabs">
        <button
          onClick={() => setActiveTab('platform')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer ${
            activeTab === 'platform'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          id="tab-platform"
        >
          1. Platform Comparison
        </button>
        <button
          onClick={() => setActiveTab('content_type')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer ${
            activeTab === 'content_type'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          id="tab-content"
        >
          2. Best Content Type
        </button>
        <button
          onClick={() => setActiveTab('posting_time')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 cursor-pointer ${
            activeTab === 'posting_time'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          id="tab-time"
        >
          3. Posting Time Effectiveness
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="python-layout">
        
        {/* Left Side: Code Editor Panel */}
        <div className="lg:col-span-6 flex flex-col" id="code-panel">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-t-xl border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-400 font-mono text-xs ml-2">
                {activeTab === 'platform' ? 'platform_analysis.py' :
                 activeTab === 'content_type' ? 'content_type_analysis.py' :
                 'posting_time_analysis.py'}
              </span>
            </div>
            
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg transition duration-150 cursor-pointer shadow-sm`}
              id="btn-run-code"
            >
              <Play className="h-3 w-3 fill-slate-950" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
          
          <div className="bg-slate-950 p-4 rounded-b-xl overflow-x-auto font-mono text-xs sm:text-sm text-slate-300 border border-slate-900 shadow-inner h-[320px]" id="code-display">
            <pre className="whitespace-pre">{pythonCodes[activeTab]}</pre>
          </div>

          {/* Key line decoder */}
          <div className="mt-4 bg-slate-50 border border-slate-200/60 rounded-xl p-4" id="line-decoder">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
              Beginner Code Decoder (What are we doing?)
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              {codeExplanations[activeTab].map((expl, i) => (
                <div key={i} className="flex gap-2">
                  <code className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono shrink-0 select-all border border-slate-200/50">
                    {expl.line}
                  </code>
                  <span className="text-slate-500">→ {expl.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Simulated Terminal & Dynamic Chart Output */}
        <div className="lg:col-span-6 flex flex-col gap-4" id="output-panel">
          
          {/* Terminal Console */}
          <div className="flex flex-col flex-1" id="terminal-container">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5 rounded-t-xl text-slate-400 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              <span>Interactive Output Console</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-b-xl font-mono text-xs text-emerald-400 h-[180px] overflow-y-auto border border-slate-800 flex flex-col justify-end" id="terminal-screen">
              {terminalLines.length === 0 ? (
                <div className="text-slate-500 h-full flex flex-col items-center justify-center text-center">
                  <Play className="h-8 w-8 opacity-30 mb-2 animate-pulse" />
                  <p>Click <strong className="text-slate-400 font-bold">"Run Code"</strong> above to execute the Python script on our live 300 posts.</p>
                </div>
              ) : (
                <div className="space-y-1 w-full text-left">
                  {terminalLines.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                      {line.startsWith('$') ? (
                        <span className="text-white font-bold">{line}</span>
                      ) : line.includes('Output Results:') || line.includes('---') ? (
                        <span className="text-amber-400">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Result Chart Output */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex-1 flex flex-col justify-between h-[230px]" id="visual-chart-box">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-indigo-500" />
                Python Graph Output
              </h4>
              {hasRun[activeTab] ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  <Check className="h-3 w-3" /> Plot Rendered
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Run code to render chart</span>
              )}
            </div>

            {/* Simulated Chart Plot Area */}
            {!hasRun[activeTab] ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg py-8">
                <BarChart2 className="h-10 w-10 opacity-20 mb-2" />
                <p className="text-xs">No chart plotted yet.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col" id="chart-render-area">
                {/* Custom SVG Bar Chart */}
                <div className="flex-1 flex items-end justify-around gap-2 px-4 pt-4 border-b border-slate-200 pb-2 h-[120px]">
                  {activeStats.map((stat, i) => {
                    const heightPercent = (stat.value / maxStatValue) * 80; // Scale to max 80%
                    
                    // Colors
                    let barColor = 'bg-indigo-500';
                    if (activeTab === 'platform') {
                      if (stat.name === 'LinkedIn') barColor = 'bg-blue-600';
                      else if (stat.name === 'Instagram') barColor = 'bg-pink-500';
                      else barColor = 'bg-sky-400';
                    } else if (activeTab === 'content_type') {
                      if (stat.name === 'Carousel') barColor = 'bg-indigo-600';
                      else if (stat.name === 'Video') barColor = 'bg-indigo-400';
                      else if (stat.name === 'Image') barColor = 'bg-indigo-300';
                      else barColor = 'bg-indigo-200';
                    } else {
                      if (stat.name === 'Morning') barColor = 'bg-amber-400';
                      else if (stat.name === 'Afternoon') barColor = 'bg-orange-500';
                      else barColor = 'bg-indigo-950';
                    }

                    return (
                      <div key={stat.name} className="flex flex-col items-center w-full group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 scale-0 group-hover:scale-100 transition origin-bottom bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-mono shadow z-10 whitespace-nowrap">
                          {stat.value.toFixed(2)}% Engagement
                        </div>
                        
                        {/* Bar */}
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className={`w-full max-w-[45px] ${barColor} rounded-t-md transition-all duration-700 ease-out shadow-sm`}
                        ></div>
                        
                        {/* Value Tag */}
                        <span className="font-mono text-[10px] text-slate-800 font-bold mt-1">
                          {stat.value.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-around text-[10px] font-medium text-slate-400 pt-2">
                  {activeStats.map(stat => (
                    <span key={stat.name} className="truncate max-w-[65px] text-center block">
                      {stat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-400 mt-2 text-center" id="chart-footer">
              {activeTab === 'platform' && "*LinkedIn outperforms by leveraging professional B2B text/carousel sharing."}
              {activeTab === 'content_type' && "*Carousels and Videos capture users' attention longest across all channels."}
              {activeTab === 'posting_time' && "*Audiences have platform-specific schedules (LinkedIn in morning, Insta in evening)."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
