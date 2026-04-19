import type { Input, MatchResult, Result, MatchLog } from "./types"

// --------------------
// FIXTURES
// --------------------

function generateFixtures(opponents: number[]) {
  const matches: number[] = []

  opponents.forEach((team) => {
    matches.push(team)
    matches.push(team)
  })

  return matches // 14 partidos
}

// --------------------
// MATCH ENGINE
// --------------------

function simulateMatch(team: number, opponent: number): MatchResult {
  const diff = team - opponent
  const r = Math.random()

  if (diff > 150) return "win"
  if (diff < -150) return "loss"

  if (diff > 50) return r > 0.3 ? "win" : "draw"
  if (diff < -50) return r > 0.7 ? "win" : "loss"

  if (r > 0.66) return "win"
  if (r > 0.33) return "draw"
  return "loss"
}

// --------------------
// TABLE
// --------------------

function initTable(allTeams: number[]) {
  return allTeams.map((power) => ({
    power,
    points: 0,
    gf: 0,
    ga: 0
  }))
}

function updateTable(
  table: any[],
  teamPower: number,
  opponentPower: number,
  result: MatchResult
) {
  const team = table.find((t) => t.power === teamPower)!
  const opp = table.find((t) => t.power === opponentPower)!

  if (result === "win") {
    team.points += 3
  } else if (result === "draw") {
    team.points += 1
    opp.points += 1
  } else {
    opp.points += 3
  }
}

function getPosition(table: any[], teamPower: number) {
  const sorted = [...table].sort((a, b) => b.points - a.points)
  return sorted.findIndex((t) => t.power === teamPower) + 1
}

// --------------------
// EXPECTATION
// --------------------

function expectationToPosition(exp: number) {
  switch (exp) {
    case 8: return 1
    case 7: return 1
    case 6: return 2
    case 5: return 4
    case 4: return 5
    case 3: return 6
    case 2: return 7
    case 1: return 8
    default: return 5
  }
}

// --------------------
// MOOD
// --------------------

function updateMood(
  mood: number,
  currentPos: number,
  expectedPos: number
) {
  const diff = expectedPos - currentPos

  if (diff > 2) return Math.min(10, mood + 1)
  if (diff < -2) return Math.max(1, mood - 1)

  return mood
}

// --------------------
// ATTENDANCE
// --------------------

function calcAttendance(
  fans: number,
  mood: number,
  position: number,
  totalTeams: number
) {
  const base = 20 + Math.random() * 5
  const moodFactor = 0.8 + mood * 0.04
  const positionFactor = 1 + (totalTeams - position) * 0.02

  return fans * base * moodFactor * positionFactor
}

// --------------------
// REVENUE
// --------------------

function calcRevenue(att: number, input: Input) {
  const t = att * input.mix.terraces
  const b = att * input.mix.basic
  const r = att * input.mix.roof
  const v = att * input.mix.vip

  return (
    t * input.prices.terraces +
    b * input.prices.basic +
    r * input.prices.roof +
    v * input.prices.vip
  )
}

// --------------------
// FANS
// --------------------

function getCap(division: number) {
  return 50000 / division
}

function updateFans(
  fans: number,
  position: number,
  expected: number,
  division: number
) {
  const diff = expected - position
  let growth = diff * 0.01

  const cap = getCap(division)
  const saturation = 1 - fans / cap

  return fans + fans * growth * saturation
}

// --------------------
// MAIN
// --------------------

export function simulateSeason(input: Input): Result {
  let fans = input.fans
  let mood = 6
  let cash = 0
  let totalAttendance = 0

  const opponents = input.leagueTeams
  const fixtures = generateFixtures(opponents)

  const allTeams = [input.teamPower, ...opponents]
  const table = initTable(allTeams)

  const expectedPos = expectationToPosition(input.expectation)

  const history: MatchLog[] = []

  for (let i = 0; i < fixtures.length; i++) {
    const opponent = fixtures[i]

    const result = simulateMatch(input.teamPower, opponent)

    updateTable(table, input.teamPower, opponent, result)

    const position = getPosition(table, input.teamPower)

    mood = updateMood(mood, position, expectedPos)

    let attendance = calcAttendance(
      fans,
      mood,
      position,
      allTeams.length
    )

    attendance = Math.min(attendance, input.capacity)
    totalAttendance += attendance

    const revenue = calcRevenue(attendance, input)
    cash += revenue

    fans = updateFans(fans, position, expectedPos, input.division)

    history.push({
      match: i + 1,
      opponent,
      result,
      position,
      mood,
      attendance: Math.round(attendance),
      revenue: Math.round(revenue),
      fans: Math.round(fans)
    })
  }

  return {
    finalFans: Math.round(fans),
    totalRevenue: Math.round(cash),
    avgAttendance: Math.round(totalAttendance / fixtures.length),
    occupancy: totalAttendance / (fixtures.length * input.capacity),
    matches: history
  }
}