import { useState } from "react";
import { simulateSeason } from "../lib/simulation";
import type { Result } from "../lib/types";
import LineChart from "./LineChart";

// --------------------
// CHART
// --------------------

// --------------------
// MAIN COMPONENT
// --------------------

export default function Simulator() {
  const [fans, setFans] = useState(890);
  const [capacity, setCapacity] = useState(12200);
  const [teamPower, setTeamPower] = useState(715);
  const [division, setDivision] = useState(6);
  const [expectation, setExpectation] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(
    2,
  );

  const [leagueTeams, setLeagueTeams] = useState<number[]>([
    827, 836, 713, 542, 530, 526, 543,
  ]);

  const [result, setResult] = useState<Result | null>(null);

  function updateTeam(index: number, value: number) {
    const copy = [...leagueTeams];
    copy[index] = value;
    setLeagueTeams(copy);
  }

  function runSimulation() {
    const res = simulateSeason({
      fans,
      capacity,
      teamPower,
      leagueTeams,
      expectation,
      division,
      prices: {
        terraces: 10,
        basic: 20,
        roof: 30,
        vip: 50,
      },
      mix: {
        terraces: 0.4,
        basic: 0.3,
        roof: 0.2,
        vip: 0.1,
      },
    });

    setResult(res);
  }

  const attendanceData = result?.matches.map((m) => m.attendance) || [];
  const fansData = result?.matches.map((m) => m.fans) || [];

  const maxAttendance = Math.max(...attendanceData, capacity);
  const maxFans = Math.max(...fansData, fans);

  return (
    <div className="container">
      <h1>Season Simulator</h1>

      <div className="info">
        
        {/* TEAM INPUTS */}
        <div className="card input-group">
          <h3>Club Information</h3>
          <div className="grid-2">
            <label>Fans</label>
            <input
              type="number"
              value={fans}
              onChange={(e) => setFans(+e.target.value)}
            />

            <label>Stadium Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(+e.target.value)}
            />

            <label>Team Power (500–1500)</label>
            <input
              type="number"
              value={teamPower}
              onChange={(e) => setTeamPower(+e.target.value)}
            />
          </div>

          <div className="grid-2">
            <label>Division</label>
            <input
              type="number"
              value={division}
              onChange={(e) => setDivision(+e.target.value)}
            />

            <label>Expectation</label>
            <select
              value={expectation}
              onChange={(e) => setExpectation(+e.target.value as any)}
            >
              <option value={8}>Somos mucho mejores</option>
              <option value={7}>Debemos ganar</option>
              <option value={6}>Luchar por el título</option>
              <option value={5}>Top 4</option>
              <option value={4}>Mitad de tabla</option>
              <option value={3}>Luchar permanencia</option>
              <option value={2}>Ya es un logro</option>
              <option value={1}>No pertenecemos</option>
            </select>
          </div>
        </div>

        {/* LEAGUE INPUTS*/}
        <div className="card input-group">
          <h3>League Opponents</h3>
          <div className="grid-4">
            {leagueTeams.map((t, i) => (
              <div key={i}>
                <label>Team {i + 1}</label>
                <input
                  type="number"
                  value={t}
                  onChange={(e) => updateTeam(i, +e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={runSimulation}>Run Simulation</button>
      </div>

      {/* RESULTS */}
      {result && (
        <>
          <div className="card grid-4">
            <div>
              <h4>Final Fans</h4>
              <p>{result.finalFans}</p>
            </div>
            <div>
              <h4>Revenue</h4>
              <p>{result.totalRevenue}</p>
            </div>
            <div>
              <h4>Avg Attendance</h4>
              <p>{result.avgAttendance}</p>
            </div>
            <div>
              <h4>Occupancy</h4>
              <p>{(result.occupancy * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="card">
            <h3>Attendance</h3>
            <LineChart
              data={attendanceData}
              max={maxAttendance}
              label="Attendance"
            />

            <h3 style={{ marginTop: 20 }}>Fans</h3>
            <LineChart 
              data={fansData} 
              max={maxFans} 
              label="Fans" 
            />
          </div>

          <div className="card">
            <h3>Match Breakdown</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Res</th>
                  <th>Pos</th>
                  <th>Att</th>
                  <th>Fans</th>
                  <th>Mood</th>
                </tr>
              </thead>
              <tbody>
                {result.matches.map((m) => (
                  <tr key={m.match}>
                    <td>{m.match}</td>
                    <td>{m.result}</td>
                    <td>{m.position}</td>
                    <td>{m.attendance}</td>
                    <td>{m.fans}</td>
                    <td>{m.mood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
