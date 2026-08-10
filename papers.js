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
    },

    /* --- From the "To Read" list --- */
    {
      status: "queue",
      title: "Choices, Values, and Frames",
      authors: "Daniel Kahneman & Amos Tversky",
      venue: "American Psychologist, 1984",
      url: "https://www.psy.miami.edu/_assets/pdf/rpo-articles/kahneman-and-tversky-1984.pdf"
    },
    {
      status: "queue",
      title: "Decision Making Under Deep Uncertainty for Pandemic Policy Planning",
      authors: "",
      venue: "PMC, 2023",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10156381/"
    },
    {
      status: "queue",
      title: "Rats and Humans Can Optimally Accumulate Evidence for Decision Making",
      authors: "Brunton, Botvinick & Brody",
      venue: "Science, 2013",
      url: "https://web.archive.org/web/20160305005810/http://www.princeton.edu/~matthewb/Publications/Science-2013-Brunton-95-8.pdf"
    },
    {
      status: "queue",
      type: "book",
      title: "Descartes' Error",
      authors: "Antonio Damasio",
      venue: "1994",
      url: "https://archive.org/details/descarteserrorem00dama/page/n5/mode/2up"
    },
    {
      status: "reading",
      type: "page",
      title: "Decision Theory",
      authors: "Stanford Encyclopedia of Philosophy",
      venue: "",
      url: "https://plato.stanford.edu/entries/decision-theory/"
    },
    {
      status: "queue",
      type: "book",
      title: "The Foundations of Statistics",
      authors: "Leonard J. Savage",
      venue: "1954",
      url: "https://ia801702.us.archive.org/0/items/in.ernet.dli.2015.228997/2015.228997.Fundamrntal-Of.pdf"
    },
    {
      status: "queue",
      title: "Rational Metareasoning for Language Models",
      authors: "",
      venue: "arXiv, 2024",
      url: "https://arxiv.org/pdf/2410.05563"
    },
    {
      status: "queue",
      type: "book",
      title: "Architectural Intelligence",
      authors: "Molly Wright Steenson",
      venue: "MIT Press, 2017",
      url: "https://direct.mit.edu/books/book/3643/Architectural-IntelligenceHow-Designers-and"
    },
    {
      status: "queue",
      type: "resource",
      title: "The Unawareness Bibliography",
      authors: "Burkhard C. Schipper (ed.)",
      venue: "UC Davis",
      url: "https://faculty.econ.ucdavis.edu/faculty/schipper/unaw.htm"
    },
    {
      status: "queue",
      fav: true,
      title: "People Construct Simplified Mental Representations to Plan",
      authors: "Ho, Abel, Correa, Littman, Cohen & Griffiths",
      venue: "Nature, 2022",
      url: "https://arxiv.org/pdf/2105.06948"
    },
    {
      status: "queue",
      title: "Differential Diagnosis Checklists Reduce Diagnostic Error Differentially: A Randomised Experiment",
      authors: "Kämmer, Schauber, Hautz, Stroben & Hautz",
      venue: "Medical Education, 2021",
      url: "https://pubmed.ncbi.nlm.nih.gov/34291481/"
    },
    {
      status: "reading",
      title: "Similar Failures of Consideration Arise in Human and Machine Planning",
      authors: "Zhang, Langenkamp, Kleiman-Weiner, Oikarinen & Cushman",
      venue: "Cognition, 2025",
      url: "https://www.sciencedirect.com/science/article/pii/S0010027725000484"
    },
    {
      status: "queue",
      type: "book",
      title: "Decision Making: Descriptive, Normative, and Prescriptive Interactions",
      authors: "Bell, Raiffa & Tversky (eds.)",
      venue: "Cambridge University Press, 1988",
      url: "https://www.amazon.com/dp/0521368510"
    },
    {
      status: "queue",
      title: "Decision Theory, Reinforcement Learning, and the Brain",
      authors: "Peter Dayan & Nathaniel D. Daw",
      venue: "Cognitive, Affective, & Behavioral Neuroscience, 2008",
      url: "https://www.princeton.edu/~ndaw/dd08.pdf"
    },
    {
      status: "queue",
      type: "book",
      title: "Money-Pump Arguments",
      authors: "Johan E. Gustafsson",
      venue: "Cambridge Elements, 2022",
      url: "https://www.cambridge.org/core/elements/moneypump-arguments/1515273BD710F308151F5BEC3695FEE6"
    },
    {
      status: "queue",
      title: "Prospect Theory: An Analysis of Decision under Risk",
      authors: "Daniel Kahneman & Amos Tversky",
      venue: "Econometrica, 1979",
      url: "https://courses.washington.edu/pbafhall/514/514%20Readings/ProspectTheory.pdf"
    },
    {
      status: "reading",
      title: "A New Intuitionism: Meaning, Memory, and Development in Fuzzy-Trace Theory",
      authors: "Valerie F. Reyna",
      venue: "Judgment and Decision Making, 2012",
      url: "https://journal.sjdm.org/11/111031/jdm111031.pdf"
    },
    {
      status: "reading",
      title: "Algorithms of Adaptation in Inductive Inference",
      authors: "Fränken, Theodoropoulos & Bramley",
      venue: "Cognitive Psychology, 2022",
      url: "https://doi.org/10.1016/j.cogpsych.2022.101506"
    },
    {
      status: "reading",
      title: "Formalizing Neurath's Ship: Approximate Algorithms for Online Causal Learning",
      authors: "Bramley, Dayan, Griffiths & Lagnado",
      venue: "Psychological Review, 2017",
      url: "https://doi.org/10.1037/rev0000061"
    },
    {
      status: "reading",
      title: "Hypothesis Testing Governs Strategic Motor Learning",
      authors: "Ding, Niyogi, Taylor & Tsay",
      venue: "npj Science of Learning, 2026",
      url: "https://www.nature.com/articles/s41539-026-00428-4"
    },
    {
      status: "reading",
      title: "Generative Behaviors as Key Targets for Cognitive Models",
      authors: "Judith E. Fan",
      venue: "Current Directions in Psychological Science, 2026",
      url: "https://journals.sagepub.com/doi/10.1177/09637214261416790"
    },
    {
      status: "reading",
      title: "Meta-Learned Models of Cognition",
      authors: "Binz, Dasgupta, Jagadish, Botvinick, Wang & Schulz",
      venue: "Behavioral and Brain Sciences, 2024",
      url: "https://arxiv.org/abs/2304.06729"
    }
  ];

  var STATUS_ORDER = { read: 0, reading: 1, queue: 2 };   // read first
  var SHORT = { reading: "Reading", queue: "Queue", read: "Read" };
  var TYPE = { book: "Book", page: "Page", resource: "Resource" };   // default: "Article"
  var OPEN_LABEL = { book: "Open book ↗", page: "Open page ↗", resource: "Open resource ↗" };   // default: "Open article ↗"

  // small line icons per type (default = article)
  var IC = {
    article: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="14" y2="17"/></svg>',
    page: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h14"/></svg>',
    resource: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><circle cx="2.5" cy="7" r=".6" fill="currentColor" stroke="none"/><circle cx="2.5" cy="12" r=".6" fill="currentColor" stroke="none"/><circle cx="2.5" cy="17" r=".6" fill="currentColor" stroke="none"/></svg>'
  };
  var TYPE_ALT = { book: "Book", page: "Web page", article: "Article", resource: "Resource" };
  var PER_PAGE = 5;

  var stage = document.getElementById("laptop");
  var screen = document.getElementById("screen");
  var elStatus = document.getElementById("screen-status");
  var elTitle = document.getElementById("screen-title");
  var elType = document.getElementById("screen-type");
  var elOpen = document.getElementById("screen-open");
  var list = document.getElementById("papers-list");
  if (!stage || !screen || !list) return;

  var current = null;
  var page = 0;

  // papers in display order: read first, then reading, then queue
  var ORDERED = PAPERS
    .map(function (p, i) { return { p: p, i: i }; })
    .sort(function (a, b) { return STATUS_ORDER[a.p.status] - STATUS_ORDER[b.p.status]; });

  function buildList() {
    list.innerHTML = "";
    var pages = Math.max(1, Math.ceil(ORDERED.length / PER_PAGE));
    if (page > pages - 1) page = pages - 1;
    var start = page * PER_PAGE;
    var rows = ORDERED.slice(start, start + PER_PAGE);

    var table = document.createElement("table");
    table.className = "papers-table";
    var tbody = document.createElement("tbody");

    rows.forEach(function (row) {
      var p = row.p, i = row.i;
      var tr = document.createElement("tr");
      tr.className = "status-" + p.status + (current === i ? " active" : "");
      tr.dataset.i = String(i);

      var tdTitle = document.createElement("td");
      tdTitle.className = "pt-title";
      tdTitle.innerHTML = (p.fav ? '<span class="fav">★</span> ' : '') + p.title;

      var tdType = document.createElement("td");
      tdType.className = "pt-type";
      tdType.textContent = TYPE[p.type] || "Article";

      var tdStatus = document.createElement("td");
      tdStatus.className = "pt-status";
      tdStatus.textContent = SHORT[p.status] || "";

      tr.appendChild(tdTitle);
      tr.appendChild(tdType);
      tr.appendChild(tdStatus);
      tr.addEventListener("click", function () { select(i); });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    list.appendChild(table);

    if (pages > 1) {
      var nav = document.createElement("div");
      nav.className = "papers-pager";

      var prev = document.createElement("button");
      prev.type = "button";
      prev.className = "pager-btn";
      prev.textContent = "Prev";
      prev.disabled = page === 0;
      prev.addEventListener("click", function () { page--; buildList(); });

      var info = document.createElement("span");
      info.className = "pager-info";
      info.textContent = (page + 1) + " / " + pages;

      var next = document.createElement("button");
      next.type = "button";
      next.className = "pager-btn";
      next.textContent = "Next";
      next.disabled = page >= pages - 1;
      next.addEventListener("click", function () { page++; buildList(); });

      nav.appendChild(prev);
      nav.appendChild(info);
      nav.appendChild(next);
      list.appendChild(nav);
    }
  }

  function markActive() {
    Array.prototype.forEach.call(list.querySelectorAll("tr.active"),
      function (r) { r.classList.remove("active"); });
    if (current != null) {
      var r = list.querySelector('tr[data-i="' + current + '"]');
      if (r) r.classList.add("active");
    }
  }

  function select(i) {
    if (current === i) { close(); return; }
    var p = PAPERS[i];
    current = i;
    stage.classList.remove("open");
    elStatus.textContent = LABELS[p.status] || "";
    elTitle.textContent = (p.fav ? "★ " : "") + p.title;
    var ty = p.type || "article";
    elType.innerHTML = IC[ty] || IC.article;
    elType.title = TYPE_ALT[ty] || "Article";
    elOpen.textContent = OPEN_LABEL[p.type] || "Open article ↗";
    screen.classList.toggle("unread", p.status === "queue");   // gray if not read
    markActive();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.add("open"); });
    });
  }

  function close() {
    current = null;
    stage.classList.remove("open");
    screen.classList.remove("unread");
    markActive();
    elStatus.textContent = "";
    elTitle.textContent = "pick a paper →";
    elType.innerHTML = "";
    elOpen.textContent = "";
  }

  // click the laptop -> open the paper's link
  screen.addEventListener("click", function () {
    if (current == null) return;
    var url = PAPERS[current].url;
    if (url) window.open(url, "_blank", "noopener");
  });

  buildList();
  // start with the first paper selected on the laptop
  if (ORDERED.length) select(ORDERED[0].i);
})();
