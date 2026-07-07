/* Papers — a laptop that opens and lifts the selected paper out.
   Edit this list: set status to "reading" or "read". The two columns and
   the laptop are driven entirely from PAPERS below.

   NOTE: this is a starter set pulled from Roberto's Lake-lab application —
   replace/split it with the real "read" vs "currently reading" lists. */
(function () {
  var PAPERS = [
    {
      status: "reading",
      title: "Whither Symbols in the Era of Advanced Neural Networks?",
      authors: "Griffiths, Lake, McCoy, Pavlick & Webb",
      venue: "2024",
      note: "Symbols still describe the problems a mind must solve, even if the process underneath isn't symbolic — so the question shifts to how each system reaches its answer."
    },
    {
      status: "reading",
      title: "A Distributed Representation of Temporal Context",
      authors: "Howard & Kahana",
      venue: "J. Math. Psychology, 2002",
      note: "Retrieved-context account of memory — temporal contiguity in serial and free recall."
    },
    {
      status: "read",
      title: "The Unity and Diversity of Executive Functions",
      authors: "Miyake, Friedman, Emerson, Witzki, Howerter & Wager",
      venue: "Cognitive Psychology, 2000",
      note: "Shifting, updating, and inhibition as separable-but-related executive functions."
    },
    {
      status: "read",
      title: "Executive Functions",
      authors: "Adele Diamond",
      venue: "Annual Review of Psychology, 2013",
      note: "Working memory, inhibitory control, and cognitive flexibility as the core of self-regulation."
    }
  ];

  var stage = document.getElementById("laptop");
  var screenTitle = document.getElementById("screen-title");
  var poTitle = document.getElementById("po-title");
  var poMeta = document.getElementById("po-meta");
  var poNote = document.getElementById("po-note");
  var closeBtn = document.getElementById("paper-close");
  var readingUl = document.getElementById("papers-reading");
  var readUl = document.getElementById("papers-read");
  if (!stage || !readingUl || !readUl) return;

  var current = null;

  function buildList(ul, status) {
    ul.innerHTML = "";
    var any = false;
    PAPERS.forEach(function (p, i) {
      if (p.status !== status) return;
      any = true;
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "paper-item";
      btn.dataset.i = String(i);
      btn.innerHTML = '<span class="pi-title">' + p.title + '</span>' +
                      '<span class="pi-authors">' + p.authors + '</span>';
      btn.addEventListener("click", function () { select(i, btn); });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    if (!any) {
      var empty = document.createElement("li");
      empty.className = "paper-empty";
      empty.textContent = "—";
      ul.appendChild(empty);
    }
  }

  function markActive(btn) {
    Array.prototype.forEach.call(document.querySelectorAll(".paper-item.active"),
      function (b) { b.classList.remove("active"); });
    if (btn) btn.classList.add("active");
  }

  function select(i, btn) {
    if (current === i) { close(); return; }
    var p = PAPERS[i];
    current = i;
    // stage the open: if already open, briefly reset so the lift replays
    stage.classList.remove("open");
    screenTitle.textContent = p.title;
    poTitle.textContent = p.title;
    poMeta.textContent = p.authors + " · " + p.venue;
    poNote.textContent = p.note;
    markActive(btn);
    // next frame -> trigger the transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add("open"); });
    });
  }

  function close() {
    current = null;
    stage.classList.remove("open");
    markActive(null);
    screenTitle.textContent = "select a paper";
  }

  if (closeBtn) closeBtn.addEventListener("click", close);

  buildList(readingUl, "reading");
  buildList(readUl, "read");
})();
