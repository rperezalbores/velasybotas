import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function serverSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const ENTRY_ID_RE = /^[a-z0-9-]+\/[a-z0-9-]+\/[\w.-]+$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface CommentFields {
  entry_id: string
  author_name: string
  author_email: string | null
  body: string
}

function validateComment(
  data: unknown
): { ok: true; fields: CommentFields } | { ok: false; error: string } {
  if (typeof data !== 'object' || data === null) {
    return { ok: false, error: 'Invalid request body' }
  }
  const d = data as Record<string, unknown>

  const entry_id = typeof d.entry_id === 'string' ? d.entry_id.trim() : ''
  if (!ENTRY_ID_RE.test(entry_id)) {
    return { ok: false, error: 'Invalid entry_id' }
  }

  const author_name = typeof d.author_name === 'string' ? d.author_name.trim() : ''
  if (!author_name || author_name.length > 100) {
    return { ok: false, error: 'author_name must be 1–100 characters' }
  }

  const body = typeof d.body === 'string' ? d.body.trim() : ''
  if (!body || body.length > 5000) {
    return { ok: false, error: 'body must be 1–5000 characters' }
  }

  const rawEmail = typeof d.author_email === 'string' ? d.author_email.trim() : ''
  if (rawEmail && !EMAIL_RE.test(rawEmail)) {
    return { ok: false, error: 'Invalid email format' }
  }

  return {
    ok: true,
    fields: { entry_id, author_name, body, author_email: rawEmail || null },
  }
}

// ---------------------------------------------------------------------------
// CSRF — ensure requests come from the same origin
// ---------------------------------------------------------------------------

function checkOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  // Requests with no Origin header are direct server-to-server calls — allow.
  if (!origin) return true
  const host = req.headers.get('host')
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Rate limiting — simple in-memory sliding window
// Note: resets on each serverless cold start. Good enough for a personal blog;
// upgrade to Vercel KV + @upstash/ratelimit for distributed enforcement.
// ---------------------------------------------------------------------------

const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10        // max POSTs per window per IP
const RATE_WINDOW = 3_600_000 // 1 hour in ms

function isRateLimited(req: NextRequest): boolean {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const entry = req.nextUrl.searchParams.get('entry')
  if (!entry) return NextResponse.json([])

  const supabase = serverSupabase()
  const { data, error } = await supabase
    .from('comments')
    .select('id, author_name, body, created_at')
    .eq('entry_id', entry)
    .eq('approved', true)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // CSRF check
  if (!checkOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limiting
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: 'Too many requests — try again later' },
      { status: 429 }
    )
  }

  // Parse + validate body
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const validation = validateComment(raw)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const supabase = serverSupabase()
  const { data, error } = await supabase
    .from('comments')
    .insert(validation.fields)
    .select('id, author_name, body, created_at')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
