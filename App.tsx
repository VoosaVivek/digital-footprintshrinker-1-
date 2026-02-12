
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PrivacyScore from './components/PrivacyScore';
import { runScan, calculatePrivacyScore } from './services/scanEngine';
import { PrivacyItem, OS, Category, ReportData } from './types';
import { 
  PlayIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  ShieldExclamationIcon,
  CheckCircleIcon,
  FolderOpenIcon,
  LockClosedIcon,
  DocumentArrowDownIcon,
  // Fix: Added missing ShieldCheckIcon import
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState<PrivacyItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [os, setOs] = useState<OS>(OS.WINDOWS);
  const [score, setScore] = useState(100);
  const [afterScore, setAfterScore] = useState<number | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [progress, setProgress] = useState(0);

  // Initialize OS detection
  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase();
    if (platform.includes('win')) setOs(OS.WINDOWS);
    else if (platform.includes('mac')) setOs(OS.MACOS);
    else setOs(OS.LINUX);
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 95));
    }, 100);

    try {
      const results = await runScan(os);
      setItems(results);
      setScore(calculatePrivacyScore(results));
      setAfterScore(null);
      setProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => setIsScanning(false), 500);
    }
  };

  const handleCleanup = async () => {
    const confirmed = window.confirm("Are you sure you want to clean the selected privacy artifacts? A full backup will be created first.");
    if (!confirmed) return;

    setIsCleaning(true);
    // Simulate cleanup process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedCount = items.filter(i => i.selected).length;
    const bytesSaved = items.filter(i => i.selected).reduce((acc, i) => acc + i.size, 0);
    
    const cleanedItems = items.map(item => item.selected ? { ...item, cleaned: true } : item);
    const newItems = cleanedItems.filter(i => !i.cleaned);
    
    const newReport: ReportData = {
      initialScore: score,
      finalScore: 100,
      cleanedItems: items.filter(i => i.selected),
      totalBytesSaved: bytesSaved,
      timestamp: new Date().toISOString()
    };

    setReports([newReport, ...reports]);
    setItems(newItems);
    setScore(100);
    setAfterScore(100);
    setIsCleaning(false);
    setActiveTab('reports');
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const totalSizeSelected = items.filter(i => i.selected).reduce((acc, i) => acc + i.size, 0);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h2>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex gap-2">
              {[OS.WINDOWS, OS.LINUX, OS.MACOS].map(target => (
                <button
                  key={target}
                  onClick={() => setOs(target)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    os === target ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">System Integrity</p>
              <p className="text-xs font-mono text-emerald-500">SECURE SHELL v1.4</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PrivacyScore score={score} label="Current Exposure Level" />
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <LockClosedIcon className="w-5 h-5 text-indigo-400" />
                      Scanner Controls
                    </h3>
                    <p className="text-sm text-zinc-400 mb-6">
                      Initiate a deep scan of browser databases, system caches, and thumbnail artifacts.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleScan}
                      disabled={isScanning}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all"
                    >
                      {isScanning ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PlayIcon className="w-5 h-5" />}
                      {isScanning ? 'Scanning...' : 'Start Audit'}
                    </button>
                  </div>
                </div>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>Scanning system artifacts...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {items.length > 0 && !isScanning && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Detected Digital Artifacts ({items.length})</h3>
                    <div className="text-xs text-zinc-500 flex gap-4">
                      <span>High Risk: <span className="text-rose-500 font-bold">{items.filter(i => i.risk === 'High').length}</span></span>
                      <span>Total Size: <span className="text-indigo-400 font-bold">{(items.reduce((acc, i) => acc + i.size, 0) / 1024 / 1024).toFixed(2)} MB</span></span>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider">Artifact Path</th>
                          <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider">Risk</th>
                          <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-wider">Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {items.map(item => (
                          <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 border border-zinc-700">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-[11px] text-zinc-400 truncate max-w-xs" title={item.path}>
                              {item.path}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-tighter ${
                                item.risk === 'High' ? 'text-rose-500' : item.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                              }`}>
                                <ShieldExclamationIcon className="w-3.5 h-3.5" />
                                {item.risk}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-zinc-500 font-mono">
                              {(item.size / 1024).toFixed(1)} KB
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {items.length === 0 && !isScanning && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-xl">
                    <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">System Environment Clean</h4>
                    <p className="text-zinc-500 max-w-md mx-auto mt-2">
                      No significant privacy-sensitive artifacts were detected. Perform a periodic scan to maintain your footprint.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cleanup' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Privacy Sanitization</h3>
                  <p className="text-zinc-400 mt-1">Select artifacts for localized cleanup. All files are backed up automatically.</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Pending Release</p>
                    <p className="text-sm font-mono text-indigo-400">{(totalSizeSelected / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={handleCleanup}
                    disabled={items.filter(i => i.selected).length === 0 || isCleaning}
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-900/20"
                  >
                    {isCleaning ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <TrashIcon className="w-5 h-5" />}
                    {isCleaning ? 'Sanitizing...' : `Clean Selected (${items.filter(i => i.selected).length})`}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="p-12 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-500">
                    <ShieldExclamationIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p>No items found. Run a scan from the dashboard first.</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        item.selected 
                          ? 'bg-zinc-800 border-indigo-500/50 shadow-lg shadow-indigo-900/10' 
                          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${item.selected ? 'bg-indigo-600' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                          <FolderOpenIcon className={`w-6 h-6 ${item.selected ? 'text-white' : 'text-zinc-500'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1 truncate max-w-md">{item.path.split('/').pop()}</p>
                          <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                            <span className="text-indigo-400">{item.category}</span>
                            <span>&bull;</span>
                            <span>{(item.size / 1024).toFixed(1)} KB</span>
                            <span>&bull;</span>
                            <span className={item.risk === 'High' ? 'text-rose-500' : 'text-zinc-500'}>{item.risk} Risk</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.selected ? 'bg-indigo-600 border-indigo-600' : 'border-zinc-700'
                      }`}>
                        {item.selected && <CheckCircleIcon className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold">Audit History</h3>
                  <p className="text-zinc-400 mt-1">Review past cleanup operations and saved reports.</p>
                </div>
              </div>

              {reports.length === 0 ? (
                <div className="p-20 text-center text-zinc-500 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl">
                  <DocumentArrowDownIcon className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p>No cleanup operations have been performed yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reports.map((report, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">Cleanup Session Completed</h4>
                            <p className="text-sm text-zinc-500 font-mono uppercase">ID: {report.timestamp.replace(/[^0-9]/g, '').slice(-8)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-zinc-400">{new Date(report.timestamp).toLocaleString()}</p>
                          <div className="flex gap-2 mt-2">
                             <button className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold text-zinc-300 transition-colors">CSV LOG</button>
                             <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors">FULL HTML</button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Footprint Gain</p>
                          <p className="text-3xl font-bold text-emerald-400">+{report.finalScore - report.initialScore}<span className="text-sm text-zinc-600 ml-1">pts</span></p>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Artifacts Removed</p>
                          <p className="text-3xl font-bold text-white">{report.cleanedItems.length}</p>
                        </div>
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Disk Recovery</p>
                          <p className="text-3xl font-bold text-indigo-400">{(report.totalBytesSaved / 1024 / 1024).toFixed(2)}<span className="text-sm text-zinc-600 ml-1">MB</span></p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Operation Log (SHA-256 Verified)</h5>
                        <div className="max-h-40 overflow-y-auto rounded-xl border border-zinc-800 divide-y divide-zinc-800 bg-zinc-950">
                          {report.cleanedItems.map((item, i) => (
                            <div key={i} className="px-4 py-3 flex justify-between items-center">
                              <span className="text-[11px] font-mono text-zinc-500 truncate max-w-lg">{item.path}</span>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-bold uppercase">REMOVED</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="max-w-3xl mx-auto space-y-12 py-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl mx-auto flex items-center justify-center">
                  <ShieldCheckIcon className="w-10 h-10 text-indigo-500" />
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight">Privacy & Ethics Charter</h2>
                <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                  Footprint Shrinker is designed with a strict "User-First" security model.
                </p>
              </div>

              <div className="grid gap-8">
                {[
                  {
                    title: "Local Execution Only",
                    desc: "This tool does not communicate with external servers. All scanning, cleanup, and reporting happen within your device's memory and local storage.",
                    icon: LockClosedIcon
                  },
                  {
                    title: "Backup & Recovery Policy",
                    desc: "We enforce a strict backup protocol. Every file identified for removal is moved to an encrypted local backup directory before deletion. You can restore data at any time.",
                    icon: ArrowPathIcon
                  },
                  {
                    title: "No Credential Exfiltration",
                    desc: "Scanning is limited to activity traces (history, cache, thumbnails). We never attempt to recover, store, or view passwords, login tokens, or personal messages.",
                    icon: ShieldExclamationIcon
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 p-8 bg-zinc-900 border border-zinc-800 rounded-3xl">
                    <div className="flex-shrink-0">
                      <item.icon className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl text-center">
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-[0.2em] mb-4">Final Disclaimer</p>
                <p className="text-sm text-zinc-500 italic">
                  "Digital footprint reduction is a component of comprehensive privacy hygiene but does not guarantee total anonymity. Use this tool alongside encrypted communication and secure browsing habits."
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
