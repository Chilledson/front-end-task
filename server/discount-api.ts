// Emberforge discount API. This stands in for a real backend and is served by the
// Vite dev and preview servers. Treat it as a black box: do not edit it.
//
//   POST /api/discounts/validate   body: { "code": "EMBER10" }
//
//   200 { "code": "EMBER10", "type": "percentage", "value": 10 }
//   404 { "error": "invalid_code", "message": "Invalid discount code" }
//   410 { "error": "expired",      "message": "This code has expired" }
//   400 { "error": "bad_request",  "message": "..." }
//   405 { "error": "method_not_allowed" }
//   500 { "error": "internal",     "message": "Internal server error" }

import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { delay, send } from './http'

interface DiscountRecord {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  expiresAt: string // ISO date (YYYY-MM-DD)
}

const ROUTE = '/api/discounts/validate'
const LATENCY_MS = 400
const UNREACHABLE_CODE = 'FORGE500'

const discountCodes: DiscountRecord[] = [
  { code: 'EMBER10', type: 'percentage', value: 10, expiresAt: '2099-01-01' },
  { code: 'FORGE15', type: 'fixed', value: 15, expiresAt: '2099-01-01' },
  { code: 'SUMMER24', type: 'percentage', value: 20, expiresAt: '2024-08-31' },
]

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk: Buffer) => (data += chunk.toString()))
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

async function handleValidate(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'method_not_allowed' })
  }

  let code: unknown
  try {
    code = (JSON.parse((await readBody(req)) || '{}') as { code?: unknown }).code
  } catch {
    return send(res, 400, { error: 'bad_request', message: 'Body must be JSON' })
  }

  if (typeof code !== 'string' || code.trim() === '') {
    return send(res, 400, { error: 'bad_request', message: '"code" is required' })
  }

  await delay(LATENCY_MS)

  const normalised = code.trim().toUpperCase()

  if (normalised === UNREACHABLE_CODE) {
    return send(res, 500, { error: 'internal', message: 'Internal server error' })
  }

  const record = discountCodes.find((d) => d.code === normalised)
  if (!record) {
    return send(res, 404, { error: 'invalid_code', message: 'Invalid discount code' })
  }

  if (new Date(record.expiresAt) < new Date()) {
    return send(res, 410, { error: 'expired', message: 'This code has expired' })
  }

  return send(res, 200, { code: record.code, type: record.type, value: record.value })
}

export function discountApi(): Plugin {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const path = (req.url ?? '').split('?')[0]
    if (path !== ROUTE) return next()
    void handleValidate(req, res)
  }

  return {
    name: 'emberforge-discount-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
