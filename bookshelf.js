/* Reading shelf.
   Plain-looking, but the motion is the point: pointer-drag scrolling with
   velocity + inertia and rubber-band bounds, and a book that pulls off the
   shelf when selected. No dependencies. */
(function () {
  var BOOKS = [
    { title: "A Brief History of Intelligence", author: "Max Bennett", year: 2023, color: "#3a5566", h: 182,
      note: "How evolution built minds, one breakthrough at a time." },
    { title: "Overloaded", author: "Ginny Smith", year: 2021, color: "#6b3b4a", h: 168,
      note: "How brain chemistry shapes everyday thought and feeling." },
    { title: "Six Easy Pieces", author: "Richard P. Feynman", year: 1994, color: "#5a4a2e", h: 176,
      note: "The essentials of physics, explained from first principles." },
    { title: "Bayesian Statistics the Fun Way", author: "Will Kurt", year: 2019, color: "#3f5a3a", h: 172,
      note: "Reasoning about uncertainty with priors and evidence." },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: 2011, color: "#2f3a4a", h: 186,
      note: "Two systems behind human judgment and its biases." },
    { title: "Code", author: "Charles Petzold", year: 1999, color: "#45407a", h: 178,
      note: "The hidden language of computer hardware and software." },
    { title: "Thinking in Systems", author: "Donella H. Meadows", year: 2008, color: "#2e6b5c", h: 170,
      note: "Stocks, flows, and feedback as a way of seeing." },
    { title: "Nexus", author: "Yuval Noah Harari", year: 2024, color: "#6a3a2e", h: 184,
      note: "A history of information networks, from myth to AI." },
    { title: "The Master Algorithm", author: "Pedro Domingos", year: 2015, color: "#5a2e5a", h: 174,
      note: "The five tribes of machine learning and a unifying dream." }
  ];

  var shelf = document.getElementById("shelf");
  var track = document.getElementById("shelf-track");
  var detail = document.getElementById("book-detail");
  if (!shelf || !track) return;

  // ---- build spines ----
  BOOKS.forEach(function (b, i) {
    var s = document.createElement("button");
    s.type = "button";
    s.className = "spine";
    s.style.setProperty("--c", b.color);
    s.style.height = b.h + "px";
    s.dataset.i = String(i);
    s.innerHTML =
      '<span class="spine-title">' + b.title + '</span>' +
      '<span class="spine-author">' + b.author + '</span>';
    track.appendChild(s);
  });

  // ---- motion engine ----
  var offset = 0, vel = 0, min = 0, max = 0;
  var dragging = false, moved = false, startX = 0, startOffset = 0, lastX = 0, lastT = 0, raf = null;

  function measure() {
    var pad = 24; // breathing room past the last book
    max = 0;
    min = Math.min(0, shelf.clientWidth - track.scrollWidth - pad);
    if (offset < min) offset = min;
    if (offset > max) offset = max;
    apply();
  }
  function apply() { track.style.transform = "translateX(" + offset + "px)"; }

  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  function momentum() {
    stop();
    function step() {
      if (dragging) return;
      var springing = false;
      if (offset > max) { offset += (max - offset) * 0.2; vel = 0; springing = Math.abs(offset - max) > 0.5; if (!springing) offset = max; }
      else if (offset < min) { offset += (min - offset) * 0.2; vel = 0; springing = Math.abs(offset - min) > 0.5; if (!springing) offset = min; }
      else { offset += vel; vel *= 0.93; }
      apply();
      if (springing || Math.abs(vel) > 0.15) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  shelf.addEventListener("pointerdown", function (e) {
    dragging = true; moved = false;
    startX = lastX = e.clientX; startOffset = offset;
    lastT = performance.now(); vel = 0;
    stop();
    shelf.setPointerCapture(e.pointerId);
    shelf.classList.add("grabbing");
  });

  shelf.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    offset = startOffset + dx;
    // resistance past the edges
    if (offset > max) offset = max + (offset - max) * 0.4;
    else if (offset < min) offset = min + (offset - min) * 0.4;
    var now = performance.now(), dt = now - lastT;
    if (dt > 0) vel = (e.clientX - lastX) / dt * 16;
    lastX = e.clientX; lastT = now;
    apply();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    shelf.classList.remove("grabbing");
    try { shelf.releasePointerCapture(e.pointerId); } catch (err) {}
    if (moved) { momentum(); }
    else {
      var spine = e.target.closest ? e.target.closest(".spine") : null;
      if (spine) select(Number(spine.dataset.i), spine);
    }
  }
  shelf.addEventListener("pointerup", endDrag);
  shelf.addEventListener("pointercancel", endDrag);

  // horizontal wheel / trackpad swipe, without hijacking vertical page scroll
  shelf.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    stop();
    offset -= e.deltaX;
    if (offset > max) offset = max;
    if (offset < min) offset = min;
    apply();
  }, { passive: false });

  // ---- selection: pull the book off the shelf ----
  var current = -1;
  function select(i, spine) {
    if (current === i) { clear(); return; }
    clear();
    current = i;
    spine.classList.add("out");
    var b = BOOKS[i];
    detail.innerHTML =
      '<div class="bd-cover" style="--c:' + b.color + '">' + b.title + '</div>' +
      '<div class="bd-body">' +
        '<p class="bd-title">' + b.title + '</p>' +
        '<p class="bd-meta">' + b.author + ' · ' + b.year + '</p>' +
        '<p class="bd-note">' + b.note + '</p>' +
      '</div>';
    detail.hidden = false;
  }
  function clear() {
    current = -1;
    var out = track.querySelector(".spine.out");
    if (out) out.classList.remove("out");
    detail.hidden = true;
    detail.innerHTML = "";
  }

  window.addEventListener("resize", measure);
  // spines have no images, so layout is ready synchronously
  measure();
})();
