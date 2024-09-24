import { Router } from 'express'
import { healthCheck } from '@src/controllers'

/**
 * Handle all routes
 * @param router
 */
export const routes = (router: Router) => {
  // Health check
  router.get('/api/health', healthCheck)
}
