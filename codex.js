/* Codex replaying one 32-word board (Pilot 0E, interference condition).
   Act 1: six groups found in a row (tiles light up, snap into a coloured bar,
   energy -1 each). Act 2: three wrong tries on the last eight words (tiles
   shake red and fall back, energy -1 each; CHOWDER, never picked, glows).
   Act 3: STOP with 27 energy and 4 apples unused; then the two groups it
   never found are revealed. Loops while on screen; pauses on hover.
   Reduced motion: shows the final board. */
(function () {
  var fig = document.getElementById("codex");
  if (!fig || !fig.classList.contains("cxb")) return;
  var boardEl = fig.querySelector(".cxb-board");
  var srEl = fig.querySelector(".cxb-sr");
  var fillEl = fig.querySelector(".cxb-fill");
  var numEl = fig.querySelector(".cxb-num");

  var GROUPS = [
    { name: "Out of ___", color: "#f1e7b0", words: ["NOWHERE", "THIN AIR", "LEFT FIELD", "THE BLUE"] },
    { name: "Five-sided things", color: "#cfe5d6", words: ["HOME PLATE", "THE PENTAGON", "SCHOOL CROSSING SIGN", "JEANS BACK POCKET"] },
    { name: "Pellet-filled things", color: "#d4e2f5", words: ["HACKY SACK", "EYE PILLOW", "BEANIE BABY", "DESICCANT PACKET"] },
    { name: "Tender-hearted person", color: "#f5d3dd", words: ["SOFTIE", "TEDDY BEAR", "MARSHMALLOW", "SWEETHEART"] },
    { name: "Canoodling", color: "#e3daf3", words: ["MAKING OUT", "TONSIL HOCKEY", "NECKING", "FIRST BASE"] },
    { name: "Things with knobs", color: "#ece1c2", words: ["RADIO", "STOVE", "ETCH A SKETCH", "CONTROL PANEL"] },
    { name: "Starting with dog names", color: "#d9cdf0", words: ["CHOWDER", "DOODLEBUG", "LABUBU", "PITTER-PATTER"], missed: true },
    { name: "Ending in candy brands minus S", color: "#fbd6ae", words: ["MEMENTO", "FILM NERD", "PITCHER'S MOUND", "BURGER KING WHOPPER"], missed: true }
  ];
  var TRIES = [
    { label: "Repeated syllable sounds", words: ["DOODLEBUG", "PITTER-PATTER", "MEMENTO", "LABUBU"] },
    { label: "Nolan associations", words: ["DOODLEBUG", "MEMENTO", "PITCHER'S MOUND", "FILM NERD"] },
    { label: "Names with repeated sounds", words: ["PITTER-PATTER", "MEMENTO", "LABUBU", "BURGER KING WHOPPER"] }
  ];
  // a fixed shuffle for the starting board
  var ORDER = [
    "THIN AIR", "RADIO", "CHOWDER", "HACKY SACK", "SOFTIE", "THE PENTAGON", "MAKING OUT", "MEMENTO",
    "EYE PILLOW", "NOWHERE", "STOVE", "TEDDY BEAR", "DOODLEBUG", "HOME PLATE", "NECKING", "FILM NERD",
    "BEANIE BABY", "LEFT FIELD", "SCHOOL CROSSING SIGN", "MARSHMALLOW", "ETCH A SKETCH", "TONSIL HOCKEY", "LABUBU", "PITCHER'S MOUND",
    "DESICCANT PACKET", "THE BLUE", "JEANS BACK POCKET", "SWEETHEART", "CONTROL PANEL", "FIRST BASE", "PITTER-PATTER", "BURGER KING WHOPPER"
  ];
  var START_ENERGY = 36, CAP = 48;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var tiles = {}, bars = [];
  ORDER.forEach(function (w) {
    var t = document.createElement("span");
    t.className = "cxb-tile";
    t.textContent = w;
    if (w.split(" ").some(function (x) { return x.length >= 11; })) t.dataset.long = "1";
    boardEl.appendChild(t);
    tiles[w] = t;
  });
  GROUPS.forEach(function (g) {
    var b = document.createElement("span");
    b.className = "cxb-bar" + (g.missed ? " missed" : "");
    if (!g.missed) b.style.background = g.color;                    // missed groups get one shared look (CSS)
    b.innerHTML = "<b>" + (g.missed ? "not found: " : "") + g.name + "</b><small>" + g.words.join(" · ") + "</small>";
    boardEl.appendChild(b);
    bars.push(b);
  });

  var solved = [], remaining = ORDER.slice(), energy = START_ENERGY;

  /* ---- layout: 8 columns on wide screens, 4 on phones; a found group is a bar 4 tiles wide ---- */
  function place() {
    var W = boardEl.clientWidth;
    var cols = W < 520 ? 4 : 8, gap = 5;
    var th = cols === 8 ? 46 : 42;
    var tw = (W - gap * (cols - 1)) / cols;
    var rows = 32 / cols;
    boardEl.style.height = (rows * th + (rows - 1) * gap) + "px";
    function xy(slot) { return [(slot % cols) * (tw + gap), Math.floor(slot / cols) * (th + gap)]; }
    solved.forEach(function (gi, k) {
      var p = xy(k * 4), b = bars[gi];
      b.style.width = (tw * 4 + gap * 3) + "px";
      b.style.height = th + "px";
      b.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
      GROUPS[gi].words.forEach(function (w, j) {                 // its tiles sit under the bar
        var q = xy(k * 4 + j);
        tiles[w].style.transform = "translate(" + q[0] + "px," + q[1] + "px)";
      });
    });
    remaining.forEach(function (w, i) {
      var p = xy(solved.length * 4 + i), t = tiles[w];
      t.style.width = tw + "px";
      t.style.height = th + "px";
      t.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
    });
    ORDER.forEach(function (w) { tiles[w].style.width = tw + "px"; tiles[w].style.height = th + "px"; });
  }

  function setEnergy(v, tick) {
    energy = v;
    numEl.textContent = v;
    fillEl.style.width = (v / CAP * 100) + "%";
    if (tick) { numEl.classList.add("tick"); setTimeout(function () { numEl.classList.remove("tick"); }, 300); }
  }
  /* one notice at a time: showing a new one removes the old one and restarts
     the countdown; each show builds a fresh pill so its entrance replays */
  var NOTICE_MS = 1000, pillEl = null, pillTimer = null;
  function notice(text, ms, kind) {
    clearNotice();
    pillEl = document.createElement("div");
    pillEl.className = "cxb-pill" + (kind ? " " + kind : "");
    pillEl.setAttribute("aria-hidden", "true");   // announced through the status line
    pillEl.textContent = text;
    boardEl.appendChild(pillEl);
    srEl.textContent = text;
    if (ms !== 0) pillTimer = setTimeout(clearNotice, ms || NOTICE_MS);
  }
  function clearNotice() {
    clearTimeout(pillTimer); pillTimer = null;
    if (pillEl) { pillEl.remove(); pillEl = null; }
  }
  function cls(words, c, on) { words.forEach(function (w) { tiles[w].classList.toggle(c, on); }); }

  function solve(gi) {
    var g = GROUPS[gi];
    solved.push(gi);
    remaining = remaining.filter(function (w) { return g.words.indexOf(w) < 0; });
    place();
  }

  function reset() {
    solved = []; remaining = ORDER.slice();
    fig.classList.remove("stopped");
    ORDER.forEach(function (w) { tiles[w].className = "cxb-tile" + (tiles[w].dataset.long ? " long" : ""); });
    bars.forEach(function (b) { b.classList.remove("on"); });
    setEnergy(START_ENERGY);
    clearNotice();
    place();
  }

  /* ---- pausable timeline ---- */
  var gen = 0, paused = false, hovering = false, onScreen = false;
  function sleep(ms, my) {
    return new Promise(function (res, rej) {
      var left = ms, last = performance.now();
      (function tick() {
        if (my !== gen) return rej("stop");
        var now = performance.now();
        if (!paused) left -= now - last;
        last = now;
        if (left <= 0) res(); else setTimeout(tick, 40);
      })();
    });
  }
  function updatePause() { paused = hovering || !onScreen || document.hidden; }

  async function run(my) {
    for (;;) {
      reset();
      await sleep(1000, my);
      // Act 1: six groups in a row
      for (var gi = 0; gi < 6; gi++) {
        cls(GROUPS[gi].words, "pick", true);
        await sleep(650, my);
        solve(gi);
        setEnergy(energy - 1, true);
        await sleep(520, my);
        bars[gi].classList.add("on");
        cls(GROUPS[gi].words, "gone", true);
        await sleep(450, my);
      }
      // Act 2: three wrong tries on the last eight
      tiles["CHOWDER"].classList.add("unused");
      await sleep(700, my);
      for (var k = 0; k < TRIES.length; k++) {
        var tr = TRIES[k];
        notice("try " + (k + 1) + ": “" + tr.label + "”");
        cls(tr.words, "pick", true);
        await sleep(900, my);
        cls(tr.words, "pick", false);
        cls(tr.words, "wrong", true);
        setEnergy(energy - 1, true);
        await sleep(700, my);
        cls(tr.words, "wrong", false);
        await sleep(450, my);
      }
      // Act 3: STOP with resources left, then the reveal
      notice("STOP · " + energy + " energy and 4 apples unused", 2600, "stop");
      await sleep(1100, my);
      fig.classList.add("stopped");
      await sleep(1800, my);
      tiles["CHOWDER"].classList.remove("unused");
      notice("the two groups it never found", 1600);
      for (var r = 6; r < 8; r++) {
        cls(GROUPS[r].words, "pick", true);
        await sleep(500, my);
        solve(r);
        await sleep(520, my);
        bars[r].classList.add("on");
        cls(GROUPS[r].words, "gone", true);
        await sleep(600, my);
      }
      await sleep(4200, my);
    }
  }

  function start() { gen++; run(gen).catch(function () {}); }

  function showFinal() {
    reset();
    for (var gi = 0; gi < 8; gi++) { solve(gi); bars[gi].classList.add("on"); cls(GROUPS[gi].words, "gone", true); }
    setEnergy(27);
    fig.classList.add("stopped");
    notice("STOP · 27 energy and 4 apples unused", 0, "stop");
  }

  window.addEventListener("resize", place);
  if (reduce) { showFinal(); return; }

  fig.addEventListener("mouseenter", function () { hovering = true; updatePause(); });
  fig.addEventListener("mouseleave", function () { hovering = false; updatePause(); });
  document.addEventListener("visibilitychange", updatePause);
  var started = false;
  function onVis(vis) {
    onScreen = vis; updatePause();
    if (vis && !started) { started = true; start(); }
  }
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) { onVis(es[0].isIntersecting); }, { threshold: 0.3 }).observe(fig);
  } else { onVis(true); }
  reset();
})();
