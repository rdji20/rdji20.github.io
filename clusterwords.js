/* Clusterwords — the 2×2 probe.
   Four words, three possible pairings. There isn't one right answer:
   the point is which split you commit to, and whether you can say why.
   Several boards to try — each has more than one defensible split. */
(function () {
  var BOARDS = [
    {
      words: ["fire", "house", "work", "place"],
      note: "Two of the three splits are real compounds — <i>fireplace / housework</i> and <i>firehouse / workplace</i> — so more than one answer is defensible."
    },
    {
      words: ["foot", "ball", "base", "board"],
      note: "Both <i>football / baseboard</i> and <i>footboard / baseball</i> are real compound pairs — two equally defensible splits."
    },
    {
      words: ["key", "board", "black", "white"],
      note: "<i>Keyboard</i> pairs key + board; but <i>blackboard</i> and <i>whiteboard</i> also work, with key going to the other piano-key colour. Several defensible cuts."
    },
    {
      words: ["bat", "ball", "cave", "vampire"],
      note: "“Bat” is the hinge: bat + ball (sport), bat + cave (where bats live), or bat + vampire (both nocturnal). Which sense you commit to is the data."
    },
    {
      words: ["spring", "bank", "note", "draft"],
      note: "Every word is a pun — spring (season / coil / water), bank (money / river), note (music / memo), draft (beer / breeze / plan). Almost any pairing can be argued."
    }
  ];

  var grid = document.getElementById("cw-grid");
  var statusEl = document.getElementById("cw-status");
  var whyEl = document.getElementById("cw-why");
  var commitBtn = document.getElementById("cw-commit");
  var resetBtn = document.getElementById("cw-reset");
  var nextBtn = document.getElementById("cw-next");
  var resultEl = document.getElementById("cw-result");
  if (!grid) return;

  var boardIdx = 0;
  var selected = [];

  function words() { return BOARDS[boardIdx].words; }

  function render() {
    grid.innerHTML = "";
    words().forEach(function (w) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.textContent = w;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { toggle(w); });
      grid.appendChild(b);
    });
    paint();
  }

  function toggle(word) {
    var i = selected.indexOf(word);
    if (i !== -1) selected.splice(i, 1);
    else if (selected.length < 2) selected.push(word);
    else return; // already two; deselect one first
    statusEl.textContent = "";
    paint();
  }

  function paint() {
    var tiles = grid.querySelectorAll(".tile");
    Array.prototype.forEach.call(tiles, function (t) {
      var on = selected.indexOf(t.textContent) !== -1;
      t.classList.toggle("sel", on);
      t.classList.toggle("pairb", selected.length === 2 && !on);
      t.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function commit() {
    if (selected.length !== 2) { statusEl.textContent = "Pick two."; return; }
    var reason = (whyEl.value || "").trim();
    var pairA = selected.slice();
    var pairB = words().filter(function (w) { return selected.indexOf(w) === -1; });

    var html = "";
    html += "<p class=\"res-line\">You committed to <b>" + pairA.join(" · ") +
            "</b> <span class=\"res-bar\">|</span> <b>" + pairB.join(" · ") + "</b>.</p>";
    if (reason) html += "<p class=\"res-why\">Because: &ldquo;" + escapeHtml(reason) + "&rdquo;</p>";
    html += "<p class=\"res-note\">" + BOARDS[boardIdx].note +
            " Which one you commit to, and the reason you give, is exactly what the 2×2 probe records.</p>";

    resultEl.innerHTML = html;
    resultEl.hidden = false;
    statusEl.textContent = "";
  }

  function reset() {
    selected = [];
    whyEl.value = "";
    resultEl.hidden = true;
    resultEl.innerHTML = "";
    statusEl.textContent = "";
    render();
  }

  function nextBoard() {
    boardIdx = (boardIdx + 1) % BOARDS.length;
    reset();
    whyEl.focus();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  commitBtn.addEventListener("click", commit);
  resetBtn.addEventListener("click", reset);
  if (nextBtn) nextBtn.addEventListener("click", nextBoard);
  whyEl.addEventListener("keydown", function (e) { if (e.key === "Enter") commit(); });
  render();
})();
