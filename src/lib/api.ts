const API_URL = import.meta.env.API_URL ?? 'http://localhost:3000'

export class AuthError extends Error {
  constructor() {
    super('Not authenticated')
    this.name = 'AuthError'
  }
}

async function apiFetch<T>(
  path: string,
  cookieHeader?: string,
  init?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (cookieHeader) headers['Cookie'] = cookieHeader

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers,
    ...init,
  })

  if (res.status === 401) throw new AuthError()
  return res.json() as Promise<T>
}

// --- /auth/me ---

export interface UserInfo {
  userId:   string
  teamId:   string
  teamName: string
  leagueId: string
}

export async function getMe(cookieHeader?: string): Promise<UserInfo> {
  return apiFetch<UserInfo>('/auth/me', cookieHeader)
}

// --- /auth/logout ---

export async function logout(cookieHeader?: string): Promise<void> {
  await apiFetch('/auth/logout', cookieHeader, { method: 'POST' })
}

// --- /api/stadium/analysis ---

export interface StadiumAnalysis {
  arena: {
    arenaId:           string
    arenaName:         string
    teamId:            string | number
    teamName:          string
    leagueId:          string | number
    capacity: {
      terraces: number
      basic:    number
      roofed:   number
      vip:      number
    }
    totalCapacity:     number
    weeklyMaintenance: number
    lastUpdated:       string
  }
  fans: {
    count: number
    mood:  number
  }
  attendance: {
    expected:          number
    fillRate:          number
    matchesPerSeason:  number
  }
  financials: {
    currentWeeklyGrossIncome:  number
    currentWeeklyMaintenance:  number
    currentWeeklyNetIncome:    number
    currentSeasonNetIncome:    number
  }
  recommendation: {
    optimalCapacity: number
    recommendedSeats: {
      terraces: { seats: number; ticketPrice: number; weeklyMaintenance: number; buildCostIfNew: number }
      basic:    { seats: number; ticketPrice: number; weeklyMaintenance: number; buildCostIfNew: number }
      roofed:   { seats: number; ticketPrice: number; weeklyMaintenance: number; buildCostIfNew: number }
      vip:      { seats: number; ticketPrice: number; weeklyMaintenance: number; buildCostIfNew: number }
    }
    roi: {
      expansionNeeded:       boolean
      deltaSeats:            number
      buildCost?:            number
      weeklyIncomeGain?:     number
      seasonIncomeGain?:     number
      paybackWeeks?:         number | null
      newWeeklyMaintenance?: number
    }
    verdict: {
      status:  'expand' | 'optimal' | 'watch' | 'oversized'
      message: string
    }
  }
  meta: {
    modelVersion: string
    generatedAt:  string
  }
}

export async function getStadiumAnalysis(
  cookieHeader?: string,
  params?: { fanMood?: number; matchesPerSeason?: number },
): Promise<StadiumAnalysis> {
  const qs = new URLSearchParams()
  if (params?.fanMood != null)          qs.set('fanMood', String(params.fanMood))
  if (params?.matchesPerSeason != null)  qs.set('matchesPerSeason', String(params.matchesPerSeason))
  const query = qs.toString() ? `?${qs}` : ''

  const res = await apiFetch<{ ok: true; data: StadiumAnalysis }>(
    `/api/stadium/analysis${query}`,
    cookieHeader,
  )
  return res.data
}
