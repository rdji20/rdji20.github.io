/* Clusterwords quick play — a tiny 4×4 Connections-style taster.
   Pick four words that share a hidden group. Minimal, no dependencies. */
(function () {
  var GROUPS = [
    { name: "shades of brown", words: ["amber", "gold", "ochre", "rust"] },
    { name: "trees",           words: ["oak", "elm", "ash", "fir"] },
    { name: "in the sky",      words: ["moon", "mars", "venus", "sun"] },
    { name: "norse gods",      words: ["odin", "thor", "loki", "freya"] }
  ];

  var grid = document.getElementById("cw-grid");
  var solvedEl = document.getElementById("cw-solved");
  var statusEl = document.getElementById("cw-status");
  var checkBtn = document.getElementById("cw-check");
  var newBtn = document.getElementById("cw-new");
  if (!grid) return;

  var solved, mistakes, selected;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function groupOf(word) {
    for (var i = 0; i < GROUPS.length; i++) {
      if (GROUPS[i].words.indexOf(word) !== -1) return i;
    }
    return -1;
  }

  function setStatus(msg) { statusEl.textContent = msg || ""; }

  function render() {
    grid.innerHTML = "";
    var remaining = [];
    GROUPS.forEach(function (g, gi) {
      if (solved.indexOf(gi) === -1) remaining = remaining.concat(g.words);
    });
    shuffle(remaining).forEach(function (w) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.textContent = w;
      b.addEventListener("click", function () { toggle(b, w); });
      grid.appendChild(b);
    });
  }

  function toggle(btn, word) {
    var i = selected.indexOf(word);
    if (i !== -1) {
      selected.splice(i, 1);
      btn.classList.remove("sel");
    } else if (selected.length < 4) {
      selected.push(word);
      btn.classList.add("sel");
    }
    setStatus("");
  }

  function addSolvedRow(gi) {
    var g = GROUPS[gi];
    var row = document.createElement("div");
    row.className = "solved-row";
    row.innerHTML = "<span class=\"solved-name\">" + g.name + "</span> " + g.words.join(" · ");
    solvedEl.appendChild(row);
  }

  function check() {
    if (selected.length !== 4) { setStatus("Pick four."); return; }
    var g0 = groupOf(selected[0]);
    var ok = selected.every(function (w) { return groupOf(w) === g0; });
    if (ok) {
      solved.push(g0);
      selected = [];
      addSolvedRow(g0);
      if (solved.length === GROUPS.length) {
        grid.innerHTML = "";
        setStatus("Solved. That is the move Clusterwords measures.");
      } else {
        render();
        setStatus("Group found.");
      }
    } else {
      mistakes++;
      selected = [];
      Array.prototype.forEach.call(grid.querySelectorAll(".sel"), function (t) {
        t.classList.remove("sel");
      });
      if (mistakes >= 4) {
        setStatus("Out of tries — shuffle to try again.");
      } else {
        setStatus("Not a group. Tries left: " + (4 - mistakes) + ".");
      }
    }
  }

  function reset() {
    solved = []; mistakes = 0; selected = [];
    solvedEl.innerHTML = "";
    setStatus("");
    render();
  }

  checkBtn.addEventListener("click", check);
  newBtn.addEventListener("click", reset);
  reset();
})();
