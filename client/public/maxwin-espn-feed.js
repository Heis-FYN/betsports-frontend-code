(() => {
  const API_ROOT = "https://betsports-backend.onrender.com";
  const MAX_ATTEMPTS = 2;

  function normalizeMatch(match) {
    const odds = match.odds ?? match.odds_data ?? {};
    const home = match.homeTeam?.name ?? match.home_team ?? "Home Team";
    const away = match.awayTeam?.name ?? match.away_team ?? "Away Team";
    const start = match.startTime ?? match.start_time ?? match.commenceTime ?? "";
    const homeOdds = odds.home ?? odds["1"] ?? match.home_odds;
    const drawOdds = odds.draw ?? odds.X ?? match.draw_odds;
    const awayOdds = odds.away ?? odds["2"] ?? match.away_odds;
    const oneXTwo = {
      "1": homeOdds ?? "-",
      X: drawOdds ?? "-",
      "2": awayOdds ?? "-",
    };

    return {
      id: match.id,
      sportKey: match.sport ?? "football",
      sport: match.sport ?? "football",
      league: match.league ?? match.league_name ?? "Football",
      homeTeam: home,
      awayTeam: away,
      home_team: home,
      away_team: away,
      homeLogo: match.homeTeam?.logo ?? match.home_logo,
      awayLogo: match.awayTeam?.logo ?? match.away_logo,
      commenceTime: start,
      start_time: start,
      time: start ? new Date(start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) : "",
      status: String(match.status ?? "upcoming").toLowerCase(),
      scoreHome: match.score?.home ?? match.home_score ?? 0,
      scoreAway: match.score?.away ?? match.away_score ?? 0,
      home_score: match.score?.home ?? match.home_score ?? 0,
      away_score: match.score?.away ?? match.away_score ?? 0,
      current_minute: match.currentMinute ?? match.current_minute ?? 0,
      is_simulated: false,
      odds1: homeOdds,
      oddsX: drawOdds,
      odds2: awayOdds,
      odds_data: oneXTwo,
      markets: { h2h: oneXTwo },
    };
  }

  async function loadUpcoming() {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await fetch(`${API_ROOT}/api/public/football/matches/upcoming`, {
          cache: "no-store",
          signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new Error(`ESPN match service returned ${response.status}.`);
        const payload = await response.json();
        if (!Array.isArray(payload?.data)) throw new Error("The ESPN match service returned an unexpected response.");
        return payload.data.map(normalizeMatch);
      } catch (error) {
        lastError = error;
        if (attempt < MAX_ATTEMPTS) await new Promise((resolve) => window.setTimeout(resolve, 350 * attempt));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("ESPN matches could not be loaded.");
  }

  window.maxwinEspnFeed = { loadUpcoming };
})();
