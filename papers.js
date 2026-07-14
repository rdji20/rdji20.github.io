/* Papers — a laptop that opens to show the selected paper on its screen.
   Click a paper in a list to open the laptop; click the laptop to go to the
   paper's link.

   Edit this list. status ∈ "reading" | "queue" | "read", and every paper
   needs a url. NOTE: starter set from Roberto's Lake-lab application —
   replace/split it with the real lists and links. */
(function () {
  var LABELS = { reading: "Currently reading", queue: "In the queue", read: "Read" };

  var PAPERS = [
    {
      status: "reading",
      title: "On the Measure of Intelligence",
      authors: "François Chollet",
      venue: "arXiv, 2019",
      url: "https://arxiv.org/abs/1911.01547"
    },
    {
      status: "queue",
      title: "Are They Human? Detecting Large Language Models by Probing Human Memory Constraints",
      authors: "Simon Schug & Brenden M. Lake",
      venue: "arXiv, 2026",
      url: "https://arxiv.org/abs/2604.00016"
    },
    {
      status: "queue",
      title: "Building Machines That Learn and Think Like People",
      authors: "Lake, Ullman, Tenenbaum & Gershman",
      venue: "Behavioral and Brain Sciences, 2017",
      url: "https://arxiv.org/abs/1604.00289"
    },
    {
      status: "queue",
      title: "Using Probabilistic Programs to Train Inductive Reasoning in Large Language Models",
      authors: "Zhang, Jagadish, Lake & Griffiths",
      venue: "arXiv, 2026",
      url: "https://arxiv.org/abs/2606.09856"
    },
    {
      status: "queue",
      title: "The Notorious Difficulty of Comparing Human and Machine Perception",
      authors: "Funke, Borowski, Stosio, Brendel, Wallis & Bethge",
      venue: "arXiv, 2020",
      url: "https://arxiv.org/abs/2004.09406"
    },
    {
      status: "read",
      fav: true,
      title: "Whither Symbols in the Era of Advanced Neural Networks?",
      authors: "Griffiths, Lake, McCoy, Pavlick & Webb",
      venue: "Trends in Cognitive Sciences, 2026",
      url: "https://arxiv.org/abs/2508.05776"
    },
    {
      status: "read",
      fav: true,
      title: "Performance vs. Competence in Human–Machine Comparisons",
      authors: "Chaz Firestone",
      venue: "PNAS, 2020",
      url: "https://doi.org/10.1073/pnas.1905334117"
    },
    {
      status: "read",
      title: "Serial Position Effects of Large Language Models",
      authors: "Xiaobo Guo & Soroush Vosoughi",
      venue: "ACL Findings, 2025",
      url: "https://arxiv.org/abs/2406.15981"
    },
    {
      status: "read",
      title: "A Retrieved Context Model of Serial Recall and Free Recall",
      authors: "Lynn J. Lohnas",
      venue: "Computational Brain & Behavior, 2024",
      url: "https://link.springer.com/article/10.1007/s42113-024-00221-9"
    }
  ];

  var STATUS_ORDER = { read: 0, reading: 1, queue: 2 };   // read first

  var stage = document.getElementById("laptop");
  var screen = document.getElementById("screen");
  var elStatus = document.getElementById("screen-status");
  var elTitle = document.getElementById("screen-title");
  var elAuthors = document.getElementById("screen-authors");
  var elOpen = document.getElementById("screen-open");
  var strip = document.getElementById("papers-strip");
  if (!stage || !screen || !strip) return;

  var current = null;

  function buildStrip() {
    strip.innerHTML = "";
    var firstCard = null, firstIndex = null;
    PAPERS
      .map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) { return STATUS_ORDER[a.p.status] - STATUS_ORDER[b.p.status]; })
      .forEach(function (row) {
        var p = row.p, i = row.i;
        var card = document.createElement("button");
        card.type = "button";
        card.className = "paper-card status-" + p.status;
        card.dataset.i = String(i);
        card.innerHTML =
          '<span class="pc-tag">' + LABELS[p.status] + '</span>' +
          '<span class="pc-title">' + (p.fav ? '<span class="fav">★</span> ' : '') + p.title + '</span>' +
          '<span class="pc-authors">' + p.authors + '</span>' +
          '<span class="pc-venue">' + p.venue + '</span>';
        card.addEventListener("click", function () { select(i, card); });
        strip.appendChild(card);
        if (firstCard === null) { firstCard = card; firstIndex = i; }
      });
    // open the laptop on the first paper so it starts selected
    if (firstCard !== null) select(firstIndex, firstCard);
  }

  function markActive(card) {
    Array.prototype.forEach.call(strip.querySelectorAll(".paper-card.active"),
      function (c) { c.classList.remove("active"); });
    if (card) card.classList.add("active");
  }

  function select(i, card) {
    if (current === i) { close(); return; }
    var p = PAPERS[i];
    current = i;
    stage.classList.remove("open");
    elStatus.textContent = LABELS[p.status] || "";
    elTitle.textContent = (p.fav ? "★ " : "") + p.title;
    elAuthors.textContent = p.authors;
    elOpen.textContent = "Open paper ↗";
    screen.classList.toggle("unread", p.status === "queue");   // gray if not read
    markActive(card);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add("open"); });
    });
  }

  function close() {
    current = null;
    stage.classList.remove("open");
    screen.classList.remove("unread");
    markActive(null);
    elStatus.textContent = "";
    elTitle.textContent = "pick a paper →";
    elAuthors.textContent = "";
    elOpen.textContent = "";
  }

  // click the laptop -> open the paper's link
  screen.addEventListener("click", function () {
    if (current == null) return;
    var url = PAPERS[current].url;
    if (url) window.open(url, "_blank", "noopener");
  });

  buildStrip();
})();
