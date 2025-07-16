/**
 * Debug utilities for testing sign out functionality
 */

export function createDebugPanel() {
  // Only show in development
  if (import.meta.env.PROD) return;

  const existingPanel = document.getElementById('debug-signout-panel');
  if (existingPanel) return;

  const panel = document.createElement('div');
  panel.id = 'debug-signout-panel';
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.9);
    color: #8B5CF6;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #333;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    max-width: 300px;
    backdrop-filter: blur(10px);
  `;

  const checkEnvironment = () => {
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    
    const hasValidUrl = supabaseUrl && !supabaseUrl.includes('your_supabase') && !supabaseUrl.includes('placeholder');
    const hasValidKey = supabaseKey && !supabaseKey.includes('your_supabase') && !supabaseKey.includes('placeholder');
    
    return { hasValidUrl, hasValidKey, supabaseUrl, supabaseKey };
  };

  const checkStorage = () => {
    const authKeys = [];
    
    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth') || key.includes('remember'))) {
        authKeys.push(`L: ${key}`);
      }
    }
    
    // Check sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth') || key.includes('temp'))) {
        authKeys.push(`S: ${key}`);
      }
    }
    
    return authKeys;
  };

  const updatePanel = () => {
    const env = checkEnvironment();
    const storage = checkStorage();
    
    panel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px;">🔍 Sign Out Debug</div>
      
      <div style="margin-bottom: 8px;">
        <div style="color: ${env.hasValidUrl ? '#51cf66' : '#ff6b6b'};">
          ${env.hasValidUrl ? '✅' : '❌'} Supabase URL: ${env.hasValidUrl ? 'Valid' : 'Invalid/Missing'}
        </div>
        <div style="color: ${env.hasValidKey ? '#51cf66' : '#ff6b6b'};">
          ${env.hasValidKey ? '✅' : '❌'} Supabase Key: ${env.hasValidKey ? 'Valid' : 'Invalid/Missing'}
        </div>
      </div>
      
      <div style="margin-bottom: 8px;">
        <div style="color: ${storage.length === 0 ? '#51cf66' : '#ffd43b'};">
          ${storage.length === 0 ? '✅' : '⚠️'} Storage: ${storage.length} auth items
        </div>
        ${storage.length > 0 ? `<div style="font-size: 10px; color: #666; margin-top: 2px;">${storage.join(', ')}</div>` : ''}
      </div>
      
      <div style="margin-top: 10px;">
        <button id="debug-clear-storage" style="background: #ff6b6b; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; margin-right: 5px;">Clear Storage</button>
        <button id="debug-refresh" style="background: #51cf66; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; margin-right: 5px;">Refresh</button>
        <button id="debug-close" style="background: #666; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; cursor: pointer;">Close</button>
      </div>
    `;
    
    // Add event listeners
    document.getElementById('debug-clear-storage')?.addEventListener('click', () => {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🔍 Debug: Storage cleared');
      updatePanel();
    });
    
    document.getElementById('debug-refresh')?.addEventListener('click', () => {
      updatePanel();
    });
    
    document.getElementById('debug-close')?.addEventListener('click', () => {
      panel.remove();
    });
  };

  updatePanel();
  document.body.appendChild(panel);
  
  // Auto-refresh every 5 seconds
  setInterval(updatePanel, 5000);
}

// Add keyboard shortcut to toggle debug panel
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    const panel = document.getElementById('debug-signout-panel');
    if (panel) {
      panel.remove();
    } else {
      createDebugPanel();
    }
  }
});

// Auto-create debug panel in development
if (import.meta.env.DEV) {
  setTimeout(createDebugPanel, 2000);
}
