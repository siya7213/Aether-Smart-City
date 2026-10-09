import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Cloud, 
  FileCode, 
  Sparkles,
  Layers
} from 'lucide-react';
import { CityInfo, LanguageCode } from '../types';

interface DeploymentHubProps {
  currentCity: CityInfo;
  currentLang: LanguageCode;
}

export const DeploymentHub: React.FC<DeploymentHubProps> = ({ currentCity }) => {
  const [activeSubTab, setActiveSubTab] = useState<'app_py' | 'requirements' | 'cloud_guide'>('app_py');
  const [copiedApp, setCopiedApp] = useState(false);
  const [copiedReq, setCopiedReq] = useState(false);

  const requirementsText = `streamlit==1.38.0
sqlalchemy==2.0.35
haversine==2.8.1
scikit-learn==1.5.2
deep-translator==1.11.4
gTTS==2.5.3
pydeck==0.9.1
pandas==2.2.3
numpy==1.26.4
requests==2.32.3`;

  const handleCopyAppPy = async () => {
    try {
      const res = await fetch('/app.py');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedApp(true);
      setTimeout(() => setCopiedApp(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyRequirements = () => {
    navigator.clipboard.writeText(requirementsText);
    setCopiedReq(true);
    setTimeout(() => setCopiedReq(false), 2000);
  };

  const handleDownloadAppPy = () => {
    const link = document.createElement('a');
    link.href = '/app.py';
    link.download = 'app.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadRequirements = () => {
    const blob = new Blob([requirementsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'requirements.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-5 rounded-2xl border bg-slate-900/60 border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Streamlit Cloud & Single-File Python Release
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAppPy}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-black shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download app.py</span>
            </button>
            <button
              onClick={handleDownloadRequirements}
              className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>requirements.txt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab selection */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('app_py')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'app_py'
              ? 'bg-amber-400 text-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Single-File app.py</span>
        </button>
        <button
          onClick={() => setActiveSubTab('requirements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'requirements'
              ? 'bg-amber-400 text-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Pinned requirements.txt</span>
        </button>
        <button
          onClick={() => setActiveSubTab('cloud_guide')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'cloud_guide'
              ? 'bg-amber-400 text-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Streamlit Cloud Protocol</span>
        </button>
      </div>

      {/* Tab 1: app.py viewer */}
      {activeSubTab === 'app_py' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Root repository file: <b className="text-white">./app.py</b></span>
              <span className="text-slate-600">|</span>
              <span>Python 3.11</span>
            </div>

            <button
              onClick={handleCopyAppPy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-medium cursor-pointer"
            >
              {copiedApp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedApp ? 'Copied to Clipboard' : 'Copy app.py Code'}</span>
            </button>
          </div>

          <div className="p-4 bg-black rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto leading-relaxed">
            <pre>
{`# AETHER SMART CITY PLATFORM ENGINE (Single-File app.py)
# Built with Streamlit, SQLAlchemy 2.0, PyDeck, deep-translator, gTTS, and Haversine.

import os, json, math, heapq, tempfile, requests
import pandas as pd, numpy as np, pydeck as pdk, streamlit as st
from datetime import datetime
from haversine import haversine, Unit
from gtts import gTTS
from deep_translator import GoogleTranslator
from sqlalchemy import create_engine, Column, Integer, Float, String, Text, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Non-Negotiable Directives:
# - Zero Paid Keys Policy: Offline Haversine, A* pathfinding, free deep-translator.
# - Multi-City Registry: 35+ major Indian cities (Mumbai, Pune, Solapur, etc.).
# - 6 Functional Modules: Explore, Heritage Engine, Safe Nav, Analytics, Triage, Senior Voice.

# ... Complete file is saved in the repository at /app.py ...`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: requirements.txt viewer */}
      {activeSubTab === 'requirements' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Root repository file: <b className="text-white">./requirements.txt</b></span>
            </div>

            <button
              onClick={handleCopyRequirements}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-medium cursor-pointer"
            >
              {copiedReq ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReq ? 'Copied to Clipboard' : 'Copy requirements.txt'}</span>
            </button>
          </div>

          <div className="p-4 bg-black rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-300 leading-relaxed">
            <pre>{requirementsText}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Cloud Deployment Protocol */}
      {activeSubTab === 'cloud_guide' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            <span>Deploying to Streamlit Community Cloud in 60 Seconds</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/50 border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold font-mono text-xs">STEP 1: GIT PUSH</div>
              <p className="text-xs text-slate-300">
                Commit <code className="text-cyan-300 font-mono">app.py</code> and <code className="text-cyan-300 font-mono">requirements.txt</code> to your GitHub repository root.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold font-mono text-xs">STEP 2: CONNECT REPO</div>
              <p className="text-xs text-slate-300">
                Go to <a href="https://share.streamlit.io" target="_blank" rel="noreferrer" className="text-cyan-400 underline">share.streamlit.io</a>, select your repository, and set main file to <b>app.py</b>.
              </p>
            </div>

            <div className="p-4 bg-black/50 border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold font-mono text-xs">STEP 3: LAUNCH LIVE</div>
              <p className="text-xs text-slate-300">
                Streamlit installs all pinned dependencies automatically. The SQLite database seeds dynamically with zero manual intervention.
              </p>
            </div>
          </div>

          <div className="p-4 bg-black/60 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Local Execution Commands:</span>
            </div>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto">
{`# 1. Create Python 3.11 virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 2. Install pinned dependencies
pip install -r requirements.txt

# 3. Launch Aether Smart City Platform
streamlit run app.py`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
