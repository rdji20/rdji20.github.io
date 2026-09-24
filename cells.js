/* Working papers / Other projects / Background as one liquid body.
   One cell is always open. Choosing another sends a drop of orange through
   the membrane to it; it swells and wobbles as it fills, the others shrink,
   and the panel sloshes to its new height while the new content buds out.
   The panel itself is a liquid surface (drawn below, every frame): its edges
   ripple, and its top rises into a hill that fuses with the open cell and
   flows to the next one on a spring. Arrow keys are left to the laptop. */
(function () {
  var wrap = document.getElementById("cells");
  if (!wrap) return;
  var row = wrap.querySelector(".cells-row");
  var tabs = Array.prototype.slice.call(row.querySelectorAll(".cell"));
  var shapes = Array.prototype.slice.call(wrap.querySelectorAll(".cell-shape"));
  var drop = wrap.querySelector(".cell-drop");
  var wave = wrap.querySelector(".panel-wave");
  var wavePath = wave && wave.querySelector("path");
  var box = wrap.querySelector(".cell-panels");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canAnimate = !reduce && typeof Element.prototype.animate === "function";
  // phones / touch: no idle ripple, the liquid only moves during a switch (keeps scrolling smooth)
  var lite = window.matchMedia && window.matchMedia("(max-width: 34rem), (pointer: coarse)").matches;
  var busyUntil = 0;
  var active = 0;

  function panelOf(t) { return document.getElementById(t.getAttribute("aria-controls")); }

  // centre of cell i right now
  function centreNow(i) {
    var r = tabs[i].getBoundingClientRect();
    return r.left - row.getBoundingClientRect().left + r.width / 2;
  }

  // centre of cell i once the swell has finished
  function centreFinal(i) {
    var cs = getComputedStyle(row);
    var gap = parseFloat(cs.columnGap || cs.gap) || 0;
    var on = parseFloat(getComputedStyle(wrap).getPropertyValue("--grow-on")) || 2.4;
    var grows = tabs.map(function (_, k) { return k === i ? on : 1; });
    var total = grows.reduce(function (a, b) { return a + b; }, 0);
    // flex hands out the space left after each cell's padding, by grow factor
    var tcs = getComputedStyle(tabs[0]);
    var pad = parseFloat(tcs.paddingLeft) + parseFloat(tcs.paddingRight);
    var free = row.clientWidth - gap * (tabs.length - 1) - pad * tabs.length;
    var widths = grows.map(function (g) { return pad + free * g / total; });
    var x = 0;
    for (var k = 0; k < i; k++) x += widths[k] + gap;
    return x + widths[i] / 2;
  }

  /* ---- the liquid surface ---- */
  var W = 0, H = 0;              // svg size in px
  var LIFT = 12;                 // svg starts this far above the cells' bottom edge
  var GAP = 16;                  // cells -> panel gap (matches --gap-y)
  var R = 22;                    // corner radius
  var hill = { x: 0, v: 0, target: 0 };
  var phase = 0, last = 0, running = false, visible = true;

  function measure() {
    var r = wave.getBoundingClientRect();
    W = r.width; H = r.height;
    wave.setAttribute("viewBox", "0 0 " + W + " " + H);
  }

  // rounded corner: how far the edge dips at distance x from a side
  function corner(x) {
    var d = Math.min(x, W - x);
    if (d >= R) return 0;
    return R - Math.sqrt(R * R - (R - d) * (R - d));
  }

  function draw() {
    if (!W || !H) return;
    var top0 = LIFT + GAP;                 // resting top edge
    var bot0 = H - 4;                      // resting bottom edge
    var speed = Math.abs(hill.v);
    var lift = GAP + LIFT * 0.6 - Math.min(speed * 0.35, 12);   // hill thins while it flows
    var width = 34 + Math.min(speed * 0.9, 30);                 // and stretches
    var pts = [], x, y, step = 6;
    for (x = 0; x <= W + 0.1; x += step) {
      var wob = 2.2 * Math.sin(x * 0.021 + phase) + 1.4 * Math.sin(x * 0.047 - phase * 1.35);
      var h = lift * Math.exp(-Math.pow((x - hill.x) / width, 2));
      y = top0 + wob - h + corner(x);
      pts.push(x.toFixed(1) + " " + y.toFixed(1));
    }
    var back = [];
    for (x = W; x >= -0.1; x -= step) {
      var wob2 = 1.8 * Math.sin(x * 0.018 - phase * 0.8) + 1.0 * Math.sin(x * 0.041 + phase);
      y = bot0 + wob2 - corner(x);
      back.push(x.toFixed(1) + " " + y.toFixed(1));
    }
    wavePath.setAttribute("d", "M" + pts.join(" L") + " L" + back.join(" L") + " Z");
  }

  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
    last = t;
    phase += dt * 1.1;
    // spring: overshoots a little and settles, like liquid
    var a = (hill.target - hill.x) * 90 - hill.v * 11;
    hill.v += a * dt;
    hill.x += hill.v * dt;
    draw();
    // lite: stop once the switch has settled; the next switch starts it again
    if (lite && performance.now() > busyUntil &&
        Math.abs(hill.v) < 1 && Math.abs(hill.target - hill.x) < 0.5) {
      running = false;
      return;
    }
    requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce || !visible || document.hidden) return;
    running = true; last = 0;
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  function moveHill(x, jump) {
    hill.target = x;
    if (jump || reduce) { hill.x = x; hill.v = 0; draw(); }
  }

  function open(i, opts) {
    opts = opts || {};
    var from = active;
    var animate = canAnimate && !opts.quiet && from !== i;
    var x0 = centreNow(from);
    var x1 = centreFinal(i);
    var h0 = box.offsetHeight;

    tabs.forEach(function (t, k) {
      var on = k === i;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = 0;
      shapes[k].classList.toggle("active", on);
      var p = panelOf(t);
      if (p) p.hidden = !on;
    });
    active = i;
    moveHill(x1, opts.quiet);
    if (!opts.quiet) { busyUntil = performance.now() + 1200; start(); }
    if (opts.focus) tabs[i].focus();
    if (!animate) return;

    // 1. a drop of orange flows through the membrane to the new cell
    var d = drop.offsetWidth / 2;
    var mid = (x0 + x1) / 2;
    drop.animate([
      { transform: "translateX(" + (x0 - d) + "px) scale(1.2, 1)", opacity: 1 },
      { transform: "translateX(" + (mid - d) + "px) scale(1.7, .7)", opacity: 1, offset: 0.5 },
      { transform: "translateX(" + (x1 - d) + "px) scale(1.1, 1.05)", opacity: 1 }
    ], { duration: 560, easing: "cubic-bezier(.55, 0, .3, 1)" });

    // 2. the old cell lets go, the new one wobbles as it fills
    shapes[from].animate([
      { transform: "scale(1, 1)" },
      { transform: "scale(.97, 1.1)", offset: 0.35 },
      { transform: "scale(1.01, .96)", offset: 0.7 },
      { transform: "scale(1, 1)" }
    ], { duration: 650, easing: "ease-out" });
    shapes[i].animate([
      { transform: "scale(1, 1)" },
      { transform: "scale(1.05, .78)", offset: 0.3 },
      { transform: "scale(.98, 1.12)", offset: 0.6 },
      { transform: "scale(1.01, .97)", offset: 0.82 },
      { transform: "scale(1, 1)" }
    ], { duration: 900, delay: 280, easing: "ease-out", fill: "backwards" });

    // 3. the panel sloshes to its new height
    box.style.height = "";
    var h1 = box.offsetHeight;
    if (Math.abs(h1 - h0) > 1) {
      box.style.height = h0 + "px";
      void box.offsetHeight;
      box.style.height = h1 + "px";
      // fallback in case transitionend never fires (hidden tab, interrupted)
      clearTimeout(box._settle);
      box._settle = setTimeout(function () { box.style.height = ""; }, 900);
    }
    hill.v += (x1 > x0 ? 1 : -1) * 40;   // a shove, so the surface sloshes

    // 4. the new content buds out from under its cell
    var p = panelOf(tabs[i]);
    if (p) {
      var ox = row.getBoundingClientRect().left - p.getBoundingClientRect().left + x1;
      p.style.setProperty("--ox", ox + "px");
      p.classList.remove("enter");
      void p.offsetWidth;
      p.classList.add("enter");
    }
  }

  box.addEventListener("transitionend", function (e) {
    if (e.target === box && e.propertyName === "height") box.style.height = "";
  });

  tabs.forEach(function (t, k) {
    t.addEventListener("click", function () { if (k !== active) open(k); });
    // hover lightens the blob underneath (it lives in the filtered layer)
    t.addEventListener("mouseenter", function () { shapes[k].classList.add("hover"); });
    t.addEventListener("mouseleave", function () { shapes[k].classList.remove("hover"); });
  });

  // keep the surface sized to the panel (it sloshes, and the page reflows)
  // (height changes every frame while it sloshes; only a width change re-anchors the hill)
  function resized() {
    var w = W;
    measure();
    if (Math.abs(W - w) > 0.5) moveHill(centreFinal(active), true);
    else if (!running) draw();
  }
  if (window.ResizeObserver) new ResizeObserver(resized).observe(wave);
  window.addEventListener("resize", resized);

  // only animate while the cells are on screen and the tab is visible
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(wrap);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  measure();
  open(0, { quiet: true });
  start();
})();
