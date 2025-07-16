/**
 * Production-safe logging utility
 * Only logs in development mode to prevent information leakage
 */

const isDevelopment = import.meta.env.MODE === 'development'

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`🐛 [DEBUG] ${message}`, ...args)
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, ...args)
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, ...args)
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.error(`❌ [ERROR] ${message}`, ...args)
    }
    // In production, you might want to send errors to a logging service
  },
  
  // Security-focused logging - never logs in production
  security: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`🔒 [SECURITY] ${message}`, ...args)
    }
  }
}

// Production build should strip console logs
if (!isDevelopment) {
  // Override console methods to prevent accidental logging
  const noop = () => {}
  console.log = noop
  console.debug = noop
  console.info = noop
  console.warn = noop
  // Keep console.error for critical issues
}
