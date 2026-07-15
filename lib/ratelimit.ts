import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Sallitaan testaus paikallisesti (development), mutta pidetään Upstash käytössä.
// Jos et halua Upstashiin turhia pyyntöjä koodatessa, voit vaihtaa trueksi myöhemmin.
const isDevelopment = false 

export const ratelimit = isDevelopment
  ? {
      limit: async () => ({
        success: true,
      }),
    }
  : new Ratelimit({
      redis: Redis.fromEnv(),
      // Kirjautumisyrityksille tiukempi raja: max 5 yritystä 2 minuutissa
      limiter: Ratelimit.slidingWindow(5, '2 m'),
      analytics: true,
    })