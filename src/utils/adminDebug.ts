/**
 * Debug utility to help track admin state issues
 */

export const debugAdminState = (context: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Admin Debug [${context}]:`, {
      timestamp: new Date().toISOString(),
      ...data
    })
  }
}

export const clearAdminCache = () => {
  try {
    localStorage.removeItem('studio_nullbyte_admin_status')
    localStorage.removeItem('studio_nullbyte_admin_expiry')
    console.log('🧹 Admin cache cleared')
  } catch (error) {
    console.warn('⚠️ Failed to clear admin cache:', error)
  }
}

export const getAdminCacheInfo = () => {
  try {
    const status = localStorage.getItem('studio_nullbyte_admin_status')
    const expiry = localStorage.getItem('studio_nullbyte_admin_expiry')
    
    return {
      status,
      expiry: expiry ? new Date(parseInt(expiry)) : null,
      isExpired: expiry ? Date.now() > parseInt(expiry) : true
    }
  } catch (error) {
    console.warn('⚠️ Failed to get admin cache info:', error)
    return { status: null, expiry: null, isExpired: true }
  }
}

// Add to window for debugging in browser console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).adminDebug = {
    clearCache: clearAdminCache,
    getCacheInfo: getAdminCacheInfo
  }
}
