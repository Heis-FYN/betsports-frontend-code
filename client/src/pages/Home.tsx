import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  Gift,
  LayoutGrid,
  LockKeyhole,
  Menu,
  Play,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Sport = {
  name: string;
  count: string;
  icon: typeof Trophy;
};

type Fixture = {
  league: string;
  time: string;
  state: string;
  home: string;
  away: string;
  homeCode: string;
  awayCode: string;
  homeScore?: string;
  awayScore?: string;
  trend: string;
  odds: string[];
  accent: string;
};

const sports: Sport[] = [
  { name: "All events", count: "128", icon: LayoutGrid },
  { name: "Football", count: "64", icon: Trophy },
  { name: "Basketball", count: "28", icon: Activity },
  { name: "Tennis", count: "18", icon: Zap },
  { name: "Rugby", count: "12", icon: Radio },
];

const fixtures: Fixture[] = [
  {
    league: "Premier League · Matchday 08",
    time: "LIVE  68:24",
    state: "In play",
    home: "North London",
    away: "West Ham",
    homeCode: "NL",
    awayCode: "WH",
    homeScore: "2",
    awayScore: "1",
    trend: "+18% momentum",
    odds: ["1.42", "4.80", "7.20"],
    accent: "cyan",
  },
  {
    league: "NBA · Regular Season",
    time: "Q3  04:12",
    state: "In play",
    home: "Brooklyn",
    away: "Phoenix",
    homeCode: "BK",
    awayCode: "PH",
    homeScore: "71",
    awayScore: "68",
    trend: "+9% momentum",
    odds: ["1.68", "2.14", "1.91"],
    accent: "orange",
  },
  {
    league: "ATP 500 · Tokyo",
    time: "Starts in 22m",
    state: "Upcoming",
    home: "A. Shelton",
    away: "H. Rune",
    homeCode: "AS",
    awayCode: "HR",
    trend: "Trending match",
    odds: ["1.76", "2.04", "1.88"],
    accent: "lime",
  },
];

const pulseItems = [
  "North London v West Ham — 2nd half intensity rising",
  "Phoenix covering the spread in 6 of the last 8",
  "Tokyo final set market opens in 22 minutes",
];

export default function Home() {
  const [activeSport, setActiveSport] = useState("All events");
  const [slip, setSlip] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedFixtures = useMemo(() => {
    if (activeSport === "All events") return fixtures;
    if (activeSport === "Football") return fixtures.slice(0, 1);
    if (activeSport === "Basketball") return fixtures.slice(1, 2);
    if (activeSport === "Tennis") return fixtures.slice(2, 3);
    return fixtures.slice(0, 2);
  }, [activeSport]);

  const addToSlip = (fixture: Fixture, index: number) => {
    const pick = `${fixture.home} ${index === 0 ? "win" : index === 1 ? "draw" : "away"} · ${fixture.odds[index]}`;
    setSlip((current) => (current.includes(pick) ? current : [...current, pick]));
    toast.success("Added to your pulse slip", { description: pick });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0f10] text-[#eef5f2]">
      <div className="site-noise" />
      <header className="relative z-20 border-b border-white/[0.08] bg-[#0b0f10]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
          <div className="flex items-center gap-10">
            <a className="group flex items-center gap-3" href="#top" aria-label="PULSELINE home">
              <span className="brand-mark"><span /></span>
              <span className="font-display text-[17px] font-bold tracking-[0.22em] text-white">PULSELINE</span>
            </a>
            <nav className="hidden items-center gap-7 text-[12px] font-medium uppercase tracking-[0.18em] text-[#8e9b98] lg:flex">
              <a className="text-[#eef5f2]" href="#live">Live now</a>
              <a className="transition hover:text-[#5ee6e3]" href="#upcoming">Upcoming</a>
              <a className="transition hover:text-[#5ee6e3]" href="#pulse">Pulse data</a>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="icon-button hidden sm:grid" aria-label="Search"><Search size={17} /></button>
            <button className="icon-button hidden sm:grid" aria-label="Notifications"><Bell size={17} /></button>
            <button className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a9b7b3] transition hover:border-[#5ee6e3]/50 hover:text-[#eef5f2] sm:flex">
              <UserRound size={14} /> Sign in
            </button>
            <button className="rounded-full bg-[#5ee6e3] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#0b0f10] transition hover:brightness-110 active:scale-[0.97]" onClick={() => toast.info("Registration flow coming next")}>Join free</button>
            <button className="icon-button lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-white/[0.08] px-5 py-4 lg:hidden"><div className="flex flex-col gap-4 text-xs uppercase tracking-[0.18em] text-[#a9b7b3]"><a href="#live">Live now</a><a href="#upcoming">Upcoming</a><a href="#pulse">Pulse data</a></div></div>}
      </header>

      <section id="top" className="relative border-b border-white/[0.08]">
        <div className="hero-glow" />
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-24 lg:pt-24">
          <div className="relative z-10 max-w-3xl self-center">
            <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5ee6e3]"><span className="live-dot" /> The live sports signal</div>
            <h1 className="font-display max-w-4xl text-5xl font-bold leading-[0.94] tracking-[-0.055em] text-[#f3f8f5] sm:text-7xl lg:text-[92px]">Feel the game<br /><span className="text-gradient">before it moves.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#93a19d] sm:text-lg">PULSELINE turns live fixtures, sharp odds, and match momentum into one clear signal — so every decision starts with better context.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#live" className="inline-flex items-center gap-3 rounded-full bg-[#5ee6e3] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0b0f10] transition hover:brightness-110 active:scale-[0.97]">Explore live events <ArrowUpRight size={16} /></a>
              <button onClick={() => toast.info("Demo mode is ready — explore the live cards")} className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#d8e4df] transition hover:border-[#5ee6e3]/50 hover:bg-white/[0.07]">Watch how it works <Play size={14} fill="currentColor" /></button>
            </div>
            <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.08] pt-5 text-[11px] uppercase tracking-[0.16em] text-[#71807b]"><span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#5ee6e3]" /> Built for clarity</span><span className="flex items-center gap-2"><LockKeyhole size={14} className="text-[#ff9d4d]" /> Secure by design</span><span>18+ · Play responsibly</span></div>
          </div>

          <div className="relative z-10 lg:pt-5">
            <div className="signal-card mx-auto max-w-[540px] overflow-hidden rounded-[28px] border border-white/10 bg-[#12191a]/90 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6"><div className="flex items-center gap-2.5"><div className="mini-pulse"><span /></div><span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Live signal</span></div><span className="rounded-full bg-[#ff9d4d]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ffb574]">updating now</span></div>
              <div className="signal-grid p-5 sm:p-7">
                <div className="mb-8 flex items-end justify-between"><div><p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#75827e]">Premier League · 68:24</p><h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">North London <span className="text-[#66736f]">v</span> West Ham</h2></div><div className="flex items-center gap-2 text-[#5ee6e3]"><Activity size={16} /><span className="font-mono text-xs">+18%</span></div></div>
                <div className="relative mb-8 flex items-center justify-between"><div className="absolute left-7 right-7 top-1/2 h-px bg-gradient-to-r from-[#5ee6e3]/50 via-white/10 to-[#ff9d4d]/50" /><div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5ee6e3]/30 bg-[#162627] font-display text-lg font-bold text-[#5ee6e3]">NL</div><div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1b2324] text-[10px] font-bold text-[#8e9b98]">68&apos;</div><div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff9d4d]/30 bg-[#2a2019] font-display text-lg font-bold text-[#ffb574]">WH</div></div>
                <div className="mb-7 grid grid-cols-3 gap-2"><div className="score-block"><span>North London</span><strong>2</strong></div><div className="score-block"><span>Draw</span><strong>—</strong></div><div className="score-block"><span>West Ham</span><strong>1</strong></div></div>
                <div className="flex items-center justify-between border-t border-white/[0.08] pt-4"><span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#83908c]"><span className="h-1.5 w-1.5 rounded-full bg-[#5ee6e3]" /> Market confidence</span><span className="font-mono text-xs text-[#dce9e4]">74.8 / 100</span></div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-3 hidden rounded-2xl border border-white/10 bg-[#172021] px-4 py-3 shadow-xl sm:block"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ff9d4d]/10 text-[#ffb574]"><Flame size={16} /></span><div><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#ffb574]">Hot signal</p><p className="mt-1 text-xs text-[#c8d5d0]">Momentum is shifting</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.08] bg-[#0f1415]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 overflow-x-auto px-5 py-4 lg:px-10"><span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#64716d]">Browse sport</span>{sports.map((sport) => { const Icon = sport.icon; const active = activeSport === sport.name; return <button key={sport.name} onClick={() => setActiveSport(sport.name)} className={`sport-pill ${active ? "sport-pill-active" : ""}`}><Icon size={15} /><span>{sport.name}</span><em>{sport.count}</em></button>; })}</div>
      </section>

      <section id="live" className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow"><span className="live-dot" /> Live board</div><h2 className="section-title">The pulse right now</h2></div><div className="flex items-center gap-2 text-xs text-[#75827e]"><span className="font-mono text-[#5ee6e3]">{activeSport}</span><ChevronRight size={14} /><span>Auto-refreshing</span></div></div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-3">{selectedFixtures.map((fixture) => <FixtureCard key={fixture.home} fixture={fixture} addToSlip={addToSlip} />)}</div>
          <aside className="bet-slip-card rounded-[24px] border border-white/10 bg-[#12191a] p-5 lg:sticky lg:top-5 lg:self-start"><div className="mb-6 flex items-center justify-between"><div><p className="eyebrow text-[#ffb574]">Your selections</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em]">Pulse slip <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5ee6e3] px-1.5 align-middle font-mono text-[10px] text-[#0b0f10]">{slip.length}</span></h3></div><Zap size={21} className="text-[#ff9d4d]" /></div>{slip.length === 0 ? <div className="empty-slip"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-[#71807b]"><Sparkles size={20} /></div><p className="text-sm font-medium text-[#d8e4df]">Your slip is quiet.</p><p className="mt-2 max-w-[210px] text-xs leading-5 text-[#71807b]">Tap any live price to build a focused selection.</p></div> : <div className="space-y-2">{slip.map((pick) => <div key={pick} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-xs text-[#d8e4df]"><span>{pick}</span><button aria-label={`Remove ${pick}`} onClick={() => setSlip((current) => current.filter((item) => item !== pick))}><X size={14} className="text-[#71807b] hover:text-white" /></button></div>)}</div>}<div className="mt-7 border-t border-white/[0.08] pt-5"><div className="mb-4 flex items-center justify-between text-xs"><span className="text-[#71807b]">Potential return</span><span className="font-mono text-[#eef5f2]">{slip.length ? `${(slip.length * 1.74).toFixed(2)}x` : "—"}</span></div><button disabled={!slip.length} onClick={() => toast.success("Demo selection saved", { description: "No real money is involved in this preview." })} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5ee6e3] py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0b0f10] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30">Save pulse slip <ArrowUpRight size={15} /></button></div></aside>
        </div>
      </section>

      <section id="upcoming" className="border-y border-white/[0.08] bg-[#101617]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20"><div><div className="eyebrow"><CalendarDays size={14} /> Next on the line</div><h2 className="section-title max-w-md">Plan your<br /><span className="text-[#5ee6e3]">next watch.</span></h2><p className="mt-5 max-w-sm text-sm leading-6 text-[#83908c]">Save the fixtures you care about and arrive with the context already mapped. No noise, just the next signal.</p><button onClick={() => toast.info("Calendar reminders are coming soon")} className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#ffb574] transition hover:text-[#ffd0a4]">View calendar <ArrowUpRight size={15} /></button></div><div className="grid gap-3 sm:grid-cols-2"><div className="upcoming-card"><div className="mb-10 flex items-center justify-between"><span className="rounded-full bg-[#5ee6e3]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5ee6e3]">Tomorrow</span><Clock3 size={16} className="text-[#71807b]" /></div><p className="text-[10px] uppercase tracking-[0.18em] text-[#71807b]">ATP 500 · Tokyo</p><h3 className="mt-3 font-display text-xl font-bold text-white">Shelton <span className="text-[#66736f]">v</span> Rune</h3><div className="mt-6 flex items-center justify-between text-xs text-[#9ba8a4]"><span>09:30 UTC</span><span className="flex items-center gap-1.5 text-[#5ee6e3]"><Bell size={13} /> Remind me</span></div></div><div className="upcoming-card upcoming-card-orange"><div className="mb-10 flex items-center justify-between"><span className="rounded-full bg-[#ff9d4d]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ffb574]">Featured</span><Gift size={16} className="text-[#71807b]" /></div><p className="text-[10px] uppercase tracking-[0.18em] text-[#71807b]">Weekend boost</p><h3 className="mt-3 font-display text-xl font-bold text-white">Double the signal</h3><div className="mt-6 flex items-center justify-between text-xs text-[#9ba8a4]"><span>For new members</span><span className="text-[#ffb574]">Learn more <ArrowUpRight className="ml-1 inline" size={13} /></span></div></div></div></div>
      </section>

      <section id="pulse" className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><div className="eyebrow"><Radio size={14} /> Data, not drama</div><h2 className="section-title">A clearer way<br />to stay <span className="text-gradient">in play.</span></h2></div><div><div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#71807b]"><span>Signal feed</span><span className="flex items-center gap-2 text-[#5ee6e3]"><span className="live-dot" /> Live</span></div><div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12191a]">{pulseItems.map((item, index) => <div key={item} className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-4 py-4 last:border-b-0 sm:px-5"><div className="flex items-center gap-3"><span className="font-mono text-[10px] text-[#5ee6e3]">0{index + 1}</span><span className="text-sm text-[#cbd8d3]">{item}</span></div><ChevronRight size={15} className="shrink-0 text-[#71807b]" /></div>)}</div></div></div></section>

      <footer className="border-t border-white/[0.08] bg-[#0b0f10]"><div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-10"><div><a className="flex items-center gap-3" href="#top"><span className="brand-mark"><span /></span><span className="font-display text-[15px] font-bold tracking-[0.22em] text-white">PULSELINE</span></a><p className="mt-4 max-w-sm text-xs leading-5 text-[#71807b]">Live sports intelligence for fans who want to follow the signal, not chase the noise.</p></div><div className="flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-[#71807b]"><a href="#live" className="hover:text-[#5ee6e3]">Responsible play</a><a href="#pulse" className="hover:text-[#5ee6e3]">Terms</a><a href="#pulse" className="hover:text-[#5ee6e3]">Privacy</a><a href="#pulse" className="flex items-center gap-1.5 hover:text-[#5ee6e3]"><CircleHelp size={13} /> Help centre</a></div><p className="font-mono text-[10px] text-[#52605c]">© 2026 PULSELINE / v1.0</p></div></footer>
    </main>
  );
}

function FixtureCard({ fixture, addToSlip }: { fixture: Fixture; addToSlip: (fixture: Fixture, index: number) => void }) {
  const isLive = fixture.state === "In play";
  return <article className="fixture-card group rounded-[22px] border border-white/[0.08] bg-[#12191a] p-4 transition hover:border-white/20 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.17em] text-[#75827e]"><span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-[#5ee6e3] shadow-[0_0_12px_#5ee6e3]" : "bg-[#ff9d4d]"}`} /> {fixture.league}</div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isLive ? "bg-[#5ee6e3]/10 text-[#5ee6e3]" : "bg-white/[0.06] text-[#9ba8a4]"}`}>{fixture.time}</span></div><div className="grid items-center gap-5 py-5 md:grid-cols-[1fr_auto_1fr]"><div className="flex items-center gap-3"><span className={`team-badge team-badge-${fixture.accent}`}>{fixture.homeCode}</span><div><p className="font-display text-base font-bold text-white">{fixture.home}</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#71807b]">{isLive ? "Home" : "Player 1"}</p></div></div><div className="flex items-center justify-between gap-5 md:flex-col md:gap-1"><div className="font-display text-2xl font-bold tracking-[-0.04em] text-white">{fixture.homeScore ?? "—"} <span className="text-[#66736f]">:</span> {fixture.awayScore ?? "—"}</div><span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.13em] text-[#5ee6e3]"><Activity size={12} /> {fixture.trend}</span></div><div className="flex items-center justify-end gap-3 text-right"><div><p className="font-display text-base font-bold text-white">{fixture.away}</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#71807b]">{isLive ? "Away" : "Player 2"}</p></div><span className={`team-badge team-badge-${fixture.accent}`}>{fixture.awayCode}</span></div></div><div className="grid grid-cols-3 gap-2"><button onClick={() => addToSlip(fixture, 0)} className="odds-button"><span>1</span><strong>{fixture.odds[0]}</strong></button><button onClick={() => addToSlip(fixture, 1)} className="odds-button"><span>X</span><strong>{fixture.odds[1]}</strong></button><button onClick={() => addToSlip(fixture, 2)} className="odds-button"><span>2</span><strong>{fixture.odds[2]}</strong></button></div></article>;
}

export function BrandNote() {
  return null;
}
