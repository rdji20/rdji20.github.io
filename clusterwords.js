/* Clusterwords — the 2×2 probe.
   Four words, three possible pairings. There isn't one right answer:
   the point is which split you commit to, and whether you can say why.
   Board: fire · house · work · place — two of the three splits form real
   compound words, so more than one answer is genuinely defensible. */
(function () {
  var WORDS = ["fire", "house", "work", "place"];

  // sorted-pair -> compound reading (when one exists)
  var COMPOUND = {
    "fire+place": "fireplace",
    "house+work": "housework",
    "fire+house": "firehouse",
    "place+work": "workplace",
    "fire+work":  "fireworks"
  };

  var grid = document.getElementById("cw-grid");
  var statusEl = document.getElementById("cw-status");
  var whyEl = document.getElementById("cw-why");
  var commitBtn = document.getElementById("cw-commit");
  var resetBtn = document.getElementById("cw-reset");
  var resultEl = document.getElementById("cw-result");
  if (!grid) return;

  var selected = [];

  function key(a, b) { return [a, b].slice().sort().join("+"); }
  function reading(a, b) { return COMPOUND[key(a, b)] || null; }

  function render() {
    grid.innerHTML = "";
    WORDS.forEach(function (w) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.textContent = w;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { toggle(b, w); });
      grid.appendChild(b);
    });
    paint();
  }

  function toggle(btn, word) {
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
      // when two are chosen, mark the other two as the counterpart pair
      t.classList.toggle("pairb", selected.length === 2 && !on);
      t.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function commit() {
    if (selected.length !== 2) { statusEl.textContent = "Pick two."; return; }
    var reason = (whyEl.value || "").trim();
    var pairA = selected.slice();
    var pairB = WORDS.filter(function (w) { return selected.indexOf(w) === -1; });

    var readA = reading(pairA[0], pairA[1]);
    var readB = reading(pairB[0], pairB[1]);

    var html = "";
    html += "<p class=\"res-line\">You committed to <b>" + pairA.join(" · ") +
            "</b> <span class=\"res-bar\">|</span> <b>" + pairB.join(" · ") + "</b>.</p>";
    if (reason) html += "<p class=\"res-why\">Because: &ldquo;" + escapeHtml(reason) + "&rdquo;</p>";
    if (readA && readB) {
      html += "<p class=\"res-read\">Both sides read as compounds: <i>" + readA +
              "</i> and <i>" + readB + "</i>.</p>";
    } else if (readA) {
      html += "<p class=\"res-read\"><i>" + readA + "</i> works; the other pair doesn't form one.</p>";
    }
    html += "<p class=\"res-note\">Two of the three possible splits here are real compound words — " +
            "<i>fireplace / housework</i> and <i>firehouse / workplace</i> — so more than one answer " +
            "is defensible. Which one you commit to, and the reason you give, is exactly what the " +
            "2×2 probe records.</p>";

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
    whyEl.focus();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  commitBtn.addEventListener("click", commit);
  resetBtn.addEventListener("click", reset);
  whyEl.addEventListener("keydown", function (e) { if (e.key === "Enter") commit(); });
  render();
})();
