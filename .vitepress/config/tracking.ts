// config/tracking.ts
import type { HeadConfig } from 'vitepress'

// Google Analytics Tracking ID
const GA_TRACKING_ID = 'G-PS8V67BLY3'

// Google Analytics head configuration
export const googleAnalyticsHead: HeadConfig[] = [
  [
    'script',
    {
      async: '',
      src: `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    }
  ],
  [
    'script',
    {},
    `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}');`
  ]
]

// Optional: Function to get tracking head with custom config
export const getGoogleAnalyticsHead = (trackingId: string = GA_TRACKING_ID): HeadConfig[] => [
  [
    'script',
    {
      async: '',
      src: `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    }
  ],
  [
    'script',
    {},
    `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${trackingId}');`
  ]
]

// Optional: Additional tracking configurations
export const trackingConfig = {
  googleAnalytics: {
    trackingId: GA_TRACKING_ID,
    head: googleAnalyticsHead
  }
  // Add other tracking services here if needed
  // facebook: { ... },
  // hotjar: { ... },
}