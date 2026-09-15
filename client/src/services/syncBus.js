import { useEffect, useRef } from 'react';

// Channel name for cross-tab communications
const CHANNEL_NAME = 'portfolio_sync_bus';
const STORAGE_PING_KEY = 'portfolio_sync_ping';

// Singleton BroadcastChannel instance (with fallback)
let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (err) {
  console.warn('BroadcastChannel not supported or restricted, falling back to localStorage events.', err);
}

/**
 * Map API URLs or storage keys to canonical entity names
 */
export function extractEntityFromUrl(url = '') {
  const clean = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\/api\//, '').replace(/^\//, '');
  const segment = clean.split('/')[0]?.split('?')[0]?.toLowerCase();
  
  const map = {
    profile: 'profile',
    projects: 'projects',
    skills: 'skills',
    experience: 'experience',
    education: 'education',
    certifications: 'certifications',
    testimonials: 'testimonials',
    settings: 'settings',
    blog: 'blog',
    media: 'media',
    messages: 'messages',
    resume: 'resume',
    seo: 'seo',
    analytics: 'analytics',
    activity: 'activity',
  };

  return map[segment] || segment || 'all';
}

/**
 * Broadcast an update event across current window and all other browser tabs
 */
export function notifyDataChange(entity = 'all', meta = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    entity: String(entity).toLowerCase(),
    timestamp: Date.now(),
    meta,
  };

  // 1. BroadcastChannel (modern cross-tab)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch (e) {
      console.warn('BroadcastChannel postMessage failed:', e);
    }
  }

  // 2. Storage event (cross-tab fallback supported by 100% of browsers)
  try {
    localStorage.setItem(STORAGE_PING_KEY, JSON.stringify(payload));
  } catch (e) {
    // quota or private mode
  }

  // 3. In-memory CustomEvent for same-tab / same-window components
  try {
    window.dispatchEvent(
      new CustomEvent('portfolio_data_changed', {
        detail: payload,
      })
    );
  } catch (e) {}
}

/**
 * Subscribe to sync events matching specific entities.
 * Also triggers on window focus / tab visibility change to guarantee freshness.
 */
export function subscribeToSync(callback, entities = []) {
  if (typeof window === 'undefined') return () => {};

  const targetEntities = Array.isArray(entities)
    ? entities.map((e) => e.toLowerCase())
    : [String(entities).toLowerCase()];

  let debounceTimer = null;
  const trigger = (eventEntity, source) => {
    const norm = (eventEntity || 'all').toLowerCase();
    const shouldFire =
      targetEntities.length === 0 ||
      targetEntities.includes('*') ||
      targetEntities.includes('all') ||
      norm === 'all' ||
      norm === '*' ||
      targetEntities.includes(norm);

    if (shouldFire) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          callback({ entity: norm, source });
        } catch (err) {
          console.error('Error in portfolio sync subscriber:', err);
        }
      }, 120);
    }
  };

  // 1. BroadcastChannel listener
  const handleBcMessage = (event) => {
    if (event?.data?.entity) {
      trigger(event.data.entity, 'broadcast_channel');
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBcMessage);
  }

  // 2. Local storage cross-tab event listener
  const handleStorage = (event) => {
    if (event.key === STORAGE_PING_KEY && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        if (data?.entity) {
          trigger(data.entity, 'storage');
        }
      } catch (e) {}
    }
  };
  window.addEventListener('storage', handleStorage);

  // 3. Same-window custom event listener
  const handleCustomEvent = (event) => {
    if (event.detail?.entity) {
      trigger(event.detail.entity, 'custom_event');
    }
  };
  window.addEventListener('portfolio_data_changed', handleCustomEvent);

  // 4. Tab visibility change (when user returns to frontend tab)
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      trigger('all', 'visibility_change');
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);

  // 5. Window focus event
  const handleFocus = () => {
    trigger('all', 'window_focus');
  };
  window.addEventListener('focus', handleFocus);

  // Cleanup function
  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBcMessage);
    }
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('portfolio_data_changed', handleCustomEvent);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('focus', handleFocus);
  };
}

/**
 * Reusable React Hook for automatic real-time sync in components.
 * Automatically re-invokes `refetchFn` whenever matching entities change.
 * 
 * @param {string|string[]} entities Entity or entities to listen for (e.g. ['projects'], ['profile', 'settings'])
 * @param {Function} refetchFn Callback to execute to re-fetch or refresh data
 */
export function usePortfolioSync(entities, refetchFn) {
  const refetchRef = useRef(refetchFn);

  useEffect(() => {
    refetchRef.current = refetchFn;
  }, [refetchFn]);

  useEffect(() => {
    const unsubscribe = subscribeToSync((info) => {
      if (typeof refetchRef.current === 'function') {
        refetchRef.current(info);
      }
    }, entities);

    return unsubscribe;
  }, [Array.isArray(entities) ? entities.join(',') : entities]);
}
