const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../public/maxwin-espn-feed.js"), "utf8");

function loadFeed(fetchImpl) {
  const window = { setTimeout };
  vm.runInNewContext(source, { window, fetch: fetchImpl, AbortSignal, setTimeout });
  return window.maxwinEspnFeed;
}

test("normalizes ESPN fixtures into MAXWIN's existing match-card props", async () => {
  const requested = [];
  const feed = loadFeed(async (url, options) => {
    requested.push({ url, options });
    return {
      ok: true,
      status: 200,
      json: async () => ({
        count: 1,
        data: [
          {
            id: "espn-event-1",
            sport: "football",
            league: "college-football",
            status: "upcoming",
            startTime: "Sat, 26 Sep 2026 16:00:00 GMT",
            homeTeam: { name: "Ohio State Buckeyes" },
            awayTeam: { name: "Illinois Fighting Illini" },
            score: { home: 0, away: 0 },
            odds: { home: "1.02", draw: null, away: "17.00" },
          },
        ],
      }),
    };
  });

  const [match] = await feed.loadUpcoming();
  assert.equal(requested.length, 1);
  assert.match(requested[0].url, /\/api\/public\/football\/matches\/upcoming$/);
  assert.equal(requested[0].options.cache, "no-store");
  assert.equal(match.id, "espn-event-1");
  assert.equal(match.homeTeam, "Ohio State Buckeyes");
  assert.equal(match.awayTeam, "Illinois Fighting Illini");
  assert.equal(match.league, "college-football");
  assert.equal(match.status, "upcoming");
  assert.equal(match.odds1, "1.02");
  assert.equal(match.oddsX, undefined);
  assert.equal(match.odds2, "17.00");
  assert.deepEqual(JSON.parse(JSON.stringify(match.odds_data)), { "1": "1.02", X: "-", "2": "17.00" });
});

test("retries a failed ESPN request once, then returns the fixture list", async () => {
  let attempts = 0;
  const feed = loadFeed(async () => {
    attempts += 1;
    if (attempts === 1) return { ok: false, status: 503 };
    return { ok: true, status: 200, json: async () => ({ data: [] }) };
  });

  assert.deepEqual(await feed.loadUpcoming(), []);
  assert.equal(attempts, 2);
});

test("rejects an invalid ESPN response shape instead of silently inventing matches", async () => {
  const feed = loadFeed(async () => ({ ok: true, status: 200, json: async () => ({ data: null }) }));
  await assert.rejects(feed.loadUpcoming(), /unexpected response/);
});
