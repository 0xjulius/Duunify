import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const isDevelopment = process.env.NODE_ENV === 'development'

export const ratelimit = isDevelopment
  ? {
      limit: async () => ({
        success: true,
      }),
    }
  : new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    })