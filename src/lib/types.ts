// --------------------
// TYPES
// --------------------

export type MatchResult = "win" | "draw" | "loss"

export type Input = {
  fans: number
  capacity: number
  teamPower: number
  leagueTeams: number[] // 7 rivales
  expectation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  //8: ¡Somos mucho mejores que esta división!
  //7: Debemos ganar esta temporada
  //6: ¡Luchar por el título!
  //5: Estar entre los mejores 4
  //4: Terminar en la mitad de la tabla no estaría nada mal
  //3: Tendremos que luchar para mantenernos
  //2: Cada día en esta división es un premio
  //1: No somos dignos de estar en esta división
  prices: {
    terraces: number
    basic: number
    roof: number
    vip: number
  }
  mix: {
    terraces: number
    basic: number
    roof: number
    vip: number
  }
  division: number
}

export type MatchLog = {
  match: number
  opponent: number
  result: MatchResult
  position: number
  mood: number
  attendance: number
  revenue: number
  fans: number
}

export type Result = {
  finalFans: number
  totalRevenue: number
  avgAttendance: number
  occupancy: number
  matches: MatchLog[]
}
