import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, ChevronRight, CircleAlert, Clock3, RefreshCw, Trophy } from "lucide-react";

type SportKey = "nfl" | "nba" | "mlb" | "nhl" | "epl";

type SportOption = {
  id: SportKey;
  label: string;
  league: string;
  path: string;
  icon: string;
};

type EspnTeam = {
  id?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logo?: string;
};

type EspnEvent = {
  id: string;
  name?: string;
  date?: string;
  status?: { type?: { state?: string; shortDetail?: string; detail?: string } };
  shortName?: string;
  competitions?: Array<{
    competitors?: Array<{
      homeAway?: "home" | "away";
      score?: string;
      team?: EspnTeam;
    }>;
    broadcasts?: Array<{ names?: string[] }>;
  }>;
  season?: { name?: string };
};

type EspnScoreboard = {
  events?: EspnEvent[];
};

const ESPN_ROOT = "https://site.api.espn.com/apis/site/v2/sports";
const SPORTS: SportOption[] = [
  { id: "nfl", label: "American Football", league: "NFL", path: "football/nfl", icon: "🏈" },
  { id: "nba", label: "Basketball", league: "NBA", path: "basketball/nba", icon: "🏀" },
  { id: "mlb", label: "Baseball", league: "MLB", path: "baseball/mlb", icon: "⚾" },
  { id: "nhl", label: "Ice Hockey", league: "NHL", path: "hockey/nhl", icon: "🏒" },
  { id: "epl", label: "Soccer", league: "Premier League", path: "soccer/eng.1", icon: "⚽" },
];

function getStatus(event: EspnEvent) {
  const state = event.status?.type?.state?.toLowerCase();
  if (state === "in") return { label: event.status?.type?.shortDetail || "LIVE", tone: "live" as const };
  if (state === "post") return { label: "FINAL", tone: "final" as const };
  return { label: "UPCOMING", tone: "upcoming" as const };
}

function formatDate(date?: string) {
  if (!date) return "Time TBC";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "Time TBC";
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(value);
}

function formatTime(date?: string) {
  if (!date) return "Time TBC";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "Time TBC";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(value);
}

function eventTeams(event: EspnEvent) {
  const competitors = event.competitions?.[0]?.competitors ?? [];
  return {
    home: competitors.find((competitor) => competitor.homeAway === "home"),
    away: competitors.find((competitor) => competitor.homeAway === "away"),
  };
}

export default function EspnMatchCenter() {
  const [sportId, setSportId] = useState<SportKey>("nfl");
  const [events, setEvents] = useState<EspnEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const sport = SPORTS.find((item) => item.id === sportId) ?? SPORTS[0];

  const loadMatches = useCallback(async (key: SportKey) => {
    const selectedSport = SPORTS.find((item) => item.id === key) ?? SPORTS[0];
    setLoading(true);
    setError("");
    try {
      const dayKeys = Array.from({ length: 8 }, (_, offset) => {
        const day = new Date();
        day.setUTCHours(0, 0, 0, 0);
        day.setUTCDate(day.getUTCDate() + offset);
        return `${day.getUTCFullYear()}${String(day.getUTCMonth() + 1).padStart(2, "0")}${String(day.getUTCDate()).padStart(2, "0")}`;
      });
      const responses = await Promise.all(
        dayKeys.map((date) => fetch(`${ESPN_ROOT}/${selectedSport.path}/scoreboard?dates=${date}`, { cache: "no-store" })),
      );
      const failedResponse = responses.find((response) => !response.ok);
      if (failedResponse) throw new Error(`ESPN returned ${failedResponse.status}. Please retry in a moment.`);
      const feeds = (await Promise.all(responses.map((response) => response.json()))) as EspnScoreboard[];
      const scoreboardEvents = Array.from(new Map(feeds.flatMap((feed) => feed.events ?? []).map((event) => [event.id, event])).values());
      const now = Date.now();
      const weekAhead = now + 7 * 24 * 60 * 60 * 1000;
      const visibleEvents = scoreboardEvents
        .filter((event) => {
          const state = event.status?.type?.state?.toLowerCase();
          const start = event.date ? new Date(event.date).getTime() : NaN;
          return state === "in" || (state !== "post" && Number.isFinite(start) && start <= weekAhead && start >= now - 2 * 60 * 60 * 1000);
        })
        .sort((left, right) => new Date(left.date ?? 0).getTime() - new Date(right.date ?? 0).getTime());
      setEvents(visibleEvents);
      setLastUpdated(new Date());
    } catch (cause) {
      setEvents([]);
      setError(cause instanceof Error ? cause.message : "Matches could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMatches(sportId);
  }, [loadMatches, sportId]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => void loadMatches(sportId), 5 * 60_000);
    return () => window.clearInterval(refreshTimer);
  }, [loadMatches, sportId]);

  const upcomingCount = useMemo(
    () => events.filter((event) => event.status?.type?.state?.toLowerCase() !== "in").length,
    [events],
  );

  return (
    <main className="min-h-screen bg-[#080a09] text-white">
      <header className="border-b border-white/10 bg-black/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="/" className="flex items-center gap-3" aria-label="Maxxwin home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#f5c542]/40 bg-[#f5c542]/10 text-lg font-black text-[#f5c542]">M</span>
            <span>
              <span className="block text-lg font-black italic tracking-[0.14em]">MAXWIN</span>
              <span className="block text-[10px] font-semibold tracking-[0.24em] text-white/45">SPORTS CENTER</span>
            </span>
          </a>
          <a href="/register.html" className="rounded-lg bg-[#f5c542] px-4 py-2 text-sm font-extrabold text-black transition hover:bg-[#ffda69]">Join Maxxwin</a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f5c542]/25 bg-[#f5c542]/[0.07] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f5c542]">
              <Activity size={14} /> ESPN Match Center
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">Live scores and upcoming matches</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">Follow the latest fixtures and scores across major leagues. Match schedules and live status are provided by ESPN.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
            {lastUpdated ? `Updated ${formatTime(lastUpdated.toISOString())}` : "Scoreboard connected"}
          </div>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#101311] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a sport">
            {SPORTS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={sportId === item.id}
                onClick={() => setSportId(item.id)}
                className={`rounded-xl border px-3 py-2 text-sm font-bold transition sm:px-4 ${sportId === item.id ? "border-[#f5c542] bg-[#f5c542] text-black" : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"}`}
              >
                <span className="mr-2" aria-hidden="true">{item.icon}</span>{item.league}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => void loadMatches(sportId)} disabled={loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/5 disabled:cursor-wait disabled:opacity-50">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">{sport.label}</h2>
            <p className="mt-1 text-xs text-white/45">{events.length} match{events.length === 1 ? "" : "es"} in the next 7 days{events.some((event) => event.status?.type?.state === "in") ? " · Live now" : ""}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/55"><CalendarDays size={14} /> Upcoming: {upcomingCount}</span>
        </div>

        {loading ? (
          <div className="grid min-h-56 place-items-center rounded-2xl border border-white/10 bg-[#101311] text-sm font-semibold text-white/55" role="status"><span className="inline-flex items-center gap-3"><RefreshCw size={18} className="animate-spin text-[#f5c542]" />Loading {sport.league} matches…</span></div>
        ) : error ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 text-center" role="alert"><CircleAlert size={24} className="text-red-300" /><p className="font-bold">The scoreboard is temporarily unavailable</p><p className="max-w-lg text-sm text-white/60">{error}</p><button type="button" onClick={() => void loadMatches(sportId)} className="mt-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">Try again</button></div>
        ) : events.length === 0 ? (
          <div className="grid min-h-56 place-items-center rounded-2xl border border-white/10 bg-[#101311] px-5 text-center"><div><Trophy size={28} className="mx-auto text-[#f5c542]" /><p className="mt-3 font-bold">No {sport.league} games in the next 7 days</p><p className="mt-1 text-sm text-white/50">Choose another league or check back later. The list updates from ESPN.</p></div></div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const { home, away } = eventTeams(event);
              const status = getStatus(event);
              const live = status.tone === "live";
              const showScores = status.tone !== "upcoming";
              return (
                <article key={event.id} className={`rounded-2xl border bg-[#101311] p-4 transition hover:-translate-y-0.5 hover:border-white/25 ${live ? "border-emerald-400/35" : "border-white/10"}`}>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">{event.season?.name || sport.league}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/65"><Clock3 size={13} />{formatDate(event.date)} <span className="text-white/25">·</span> {formatTime(event.date)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${status.tone === "live" ? "bg-emerald-400/15 text-emerald-300" : status.tone === "final" ? "bg-white/10 text-white/55" : "bg-[#f5c542]/10 text-[#f5c542]"}`}>{live && <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />}{status.label}</span>
                  </div>
                  <div className="space-y-3">
                    {[{ team: away?.team, score: showScores ? away?.score : undefined }, { team: home?.team, score: showScores ? home?.score : undefined }].map(({ team, score }, index) => (
                      <div key={`${event.id}-${team?.id ?? index}`} className="flex items-center gap-3">
                        {team?.logo ? <img src={team.logo} alt="" className="h-8 w-8 shrink-0 rounded-full bg-white/5 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[10px] font-black text-white/50">{team?.abbreviation?.slice(0, 3) || "–"}</span>}
                        <span className="min-w-0 flex-1 truncate text-sm font-bold">{team?.displayName || team?.shortDisplayName || "TBA"}</span>
                        {score !== undefined && <span className="min-w-5 text-right text-lg font-black tabular-nums">{score}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35"><span>{event.shortName || event.name || sport.league}</span><span className="inline-flex items-center gap-1">ESPN <ChevronRight size={12} /></span></div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-center text-[11px] leading-5 text-white/35">Scores and fixture information are sourced from ESPN. Match availability and schedules may change.</p>
      </section>
    </main>
  );
}
