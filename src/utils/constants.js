export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const PLANS = {
  free:    { name: 'Free',    channels: 1,  aiReplies: 0,    uploads: 0  },
  creator: { name: 'Creator', channels: 1,  aiReplies: 500,  uploads: 5  },
  pro:     { name: 'Pro',     channels: 3,  aiReplies: 1200, uploads: 20 },
  agency:  { name: 'Agency',  channels: 25, aiReplies: -1,   uploads: -1 },
}

export const PLAN_COLORS = {
  free:    'gray',
  creator: 'brand',
  pro:     'emerald',
  agency:  'amber',
}
