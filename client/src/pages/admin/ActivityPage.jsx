import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, Search } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get('/activity');
        setActivities(data.data?.activities || data.activities || []);
      } catch (e) {
        toast.error('Failed to load activity logs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getActionBadge = (action) => {
    if (action?.includes('CREATE')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (action?.includes('UPDATE') || action?.includes('PUBLISH')) return 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20';
    if (action?.includes('DELETE')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    return 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200/50';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Activity Audit Log</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Complete immutable record of all administrative actions</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="liquid-glass-card overflow-hidden">
          <div className="divide-y divide-slate-200/60 dark:divide-white/10">
            {activities.map((act, idx) => (
              <div key={act.id || act._id || idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getActionBadge(act.action)}`}>
                        {act.action || 'ACTION'}
                      </span>
                      {act.entity && <span className="font-semibold text-slate-700 dark:text-slate-300">&bull; {act.entity}</span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{act.description}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(act.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="liquid-glass-card p-12 text-center text-xs text-slate-400">
          No activity logs found.
        </div>
      )}
    </div>
  );
}
