import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabaseClient';
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { peakSlug, clientLocalId, deviceTime, gps } = body

    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })

    const supa = createSupabaseAdmin()
    const { data, error } = await supa.auth.getUser(token)
    if (error || !data.user) return NextResponse.json({ error: 'invalid_token' }, { status: 401 })
    const user = data.user

    const peak = await prisma.peak.findUnique({ where: { slug: peakSlug } })
    if (!peak) return NextResponse.json({ error: 'peak_not_found' }, { status: 404 })

    const cutoff = new Date(Date.now() - 1000 * 60 * 60)
    const recent = await prisma.summit.findFirst({ where: { userId: user.id, peakId: peak.id, createdAt: { gte: cutoff } }, orderBy: { createdAt: 'desc' } })
    if (recent) return NextResponse.json({ error: 'too_soon_same_peak' }, { status: 429 })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayCount = await prisma.summit.count({ where: { userId: user.id, createdAt: { gte: todayStart } } })

    let multiplier = 1
    if (todayCount + 1 === 2) multiplier = 1.2
    if (todayCount + 1 === 3) multiplier = 1.5
    if (todayCount + 1 >= 4) multiplier = 2.0

    let points = Math.round(peak.basePoints * multiplier)

    let verified = false
    if (gps && typeof gps.lat === 'number' && typeof gps.lon === 'number') {
      if (peak.lat && peak.lon) {
        const dx = (gps.lat - peak.lat) * 111000
        const dy = (gps.lon - peak.lon) * 111000 * Math.cos((peak.lat * Math.PI) / 180)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= 75 && (gps.accuracy ?? 999) <= 50) {
          verified = true
          points += 5
        }
      }
    }

    const summit = await prisma.summit.create({
      data: {
        userId: user.id,
        peakId: peak.id,
        clientLocalId: clientLocalId,
        deviceTime: deviceTime ? new Date(deviceTime) : null,
        gpsLat: gps?.lat,
        gpsLon: gps?.lon,
        gpsAccuracy: gps?.accuracy,
        verified,
        pointsEarned: points,
      }
    })

    return NextResponse.json({ accepted: true, summitId: summit.id, verified, points })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
