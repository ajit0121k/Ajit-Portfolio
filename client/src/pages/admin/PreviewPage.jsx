import React, { useState } from 'react';
import { Eye, Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';

export default function PreviewPage() {
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile
  const [iframeKey, setIframeKey] = useState(0);

  const getWidth = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12 animate-fade-in flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary-500" />
            <span>Live Portfolio Sandbox Preview</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive multi-viewport testing environment
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Toggles */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-xl text-xs transition-all ${
                device === 'desktop'
                  ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-xl text-xs transition-all ${
                device === 'tablet'
                  ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-xl text-xs transition-all ${
                device === 'mobile'
                  ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            title="Refresh sandbox frame"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900/50 flex justify-center p-2 sm:p-4 backdrop-blur-md shadow-2xl">
        <div className={`h-full transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#070b14] border border-white/20 ${getWidth()}`}>
          <iframe
            key={iframeKey}
            src="/"
            title="Public Portfolio Live Preview"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}
