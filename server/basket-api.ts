// Emberforge basket API. This stands in for a real backend and is served by the
// Vite dev and preview servers. Treat it as a black box: do not edit it.
//
//   GET /api/basket
//
//   200 { "lines": [{ "productId": "legend-rank", "quantity": 1 }, ...] }
//   405 { "error": "method_not_allowed" }
//   500 { "error": "internal", "message": "Internal server error" }

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { delay, send } from './http'

interface BasketLine {
  productId: string
  quantity: number
}

const ROUTE = '/api/basket'
const LATENCY_MS = 600
const SCENARIO_ENV = 'EMBERFORGE_BASKET'

const savedBasket: BasketLine[] = [
  { productId: 'legend-rank', quantity: 1 },
  { productId: 'mystery-crate', quantity: 2 },
  { productId: 'crate-keys', quantity: 1 },
]

async function handleBasket(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return send(res, 405, { error: 'method_not_allowed' })
  }

  await delay(LATENCY_MS)

  switch (process.env[SCENARIO_ENV]) {
    case 'error':
      return send(res, 500, { error: 'internal', message: 'Internal server error' })
    case 'empty':
      return send(res, 200, { lines: [] })
    default:
      return send(res, 200, { lines: savedBasket })
  }
}

export function basketApi(): Plugin {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = (req.url ?? '').split('?')[0]
    if (path !== ROUTE) return next()
    void handleBasket(req, res)
  }

  return {
    name: 'emberforge-basket-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
