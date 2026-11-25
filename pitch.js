(() => {
  const S = window.SITE;
  const NS = "http://www.w3.org/2000/svg";
  const board = document.getElementById("pitch");
  const panel = document.getElementById("panel");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const routeById = Object.fromEntries(S.routes.map((r) => [r.id, r]));
  const onPitch = S.players.filter((p) => p.route !== "code");
  const byId = Object.fromEntries([S.keeper, S.goal, ...S.players].map((p) => [p.id, p]));
  // The ball's run: from the keeper, through every project oldest to newest, into the net.
  const chain = [S.keeper, ...[...onPitch].sort((a, b) => b.y - a.y), S.goal];

  let selected = null;
  let ballAt = { x: S.keeper.x, y: S.keeper.y };
  let anim = 0;

  // ---------- helpers ----------
  const f = (n) => n.toFixed(2);

  function el(tag, attrs = {}, parent) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.appendChild(node);
    return node;
  }

  function html(tag, attrs = {}, text) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text != null) node.textContent = text;
    return node;
  }

  function swatch(color) {
    const s = html("span", { class: "swatch" });
    s.style.background = color;
    return s;
  }

  // ---------- draw the pitch ----------
  const defs = el("defs", {}, board);
  const net = el("pattern", { id: "net", width: 1.2, height: 1.2, patternUnits: "userSpaceOnUse" }, defs);
  el("path", { d: "M0,0L1.2,1.2M1.2,0L0,1.2", class: "net-line" }, net);

  const X0 = 3, X1 = 97, Y0 = 3, Y1 = 137, CX = 50;
  for (let i = 0; i < 10; i++) {
    const h = (Y1 - Y0) / 10;
    el("rect", { x: X0, y: Y0 + i * h, width: X1 - X0, height: h + 0.05, class: i % 2 ? "grass-b" : "grass-a" }, board);
  }
  const lines = el("g", { class: "lines" }, board);
  el("rect", { x: X0, y: Y0, width: X1 - X0, height: Y1 - Y0 }, lines);
  el("line", { x1: X0, y1: 70, x2: X1, y2: 70 }, lines);
  el("circle", { cx: CX, cy: 70, r: 12.5 }, lines);
  el("circle", { cx: CX, cy: 70, r: 0.5, class: "spot" }, lines);
  for (const [edge, dir] of [[Y0, 1], [Y1, -1]]) {
    const box = (half, depth) => el("rect", { x: CX - half, y: dir > 0 ? edge : edge - depth, width: half * 2, height: depth }, lines);
    box(27.9, 21);
    box(12.7, 7);
    el("circle", { cx: CX, cy: edge + dir * 14, r: 0.5, class: "spot" }, lines);
    const ay = edge + dir * 21;
    el("path", { d: `M${CX - 10.36},${ay} A12.5,12.5 0 0 ${dir > 0 ? 0 : 1} ${CX + 10.36},${ay}` }, lines);
  }
  // Corner arcs: full circles clipped to the pitch.
  const clip = el("clipPath", { id: "pitch-clip" }, defs);
  el("rect", { x: X0 - 0.4, y: Y0 - 0.4, width: X1 - X0 + 0.8, height: Y1 - Y0 + 0.8 }, clip);
  lines.setAttribute("clip-path", "url(#pitch-clip)");
  for (const x of [X0, X1]) for (const y of [Y0, Y1]) el("circle", { cx: x, cy: y, r: 1.5 }, lines);
  el("rect", { x: CX - 5, y: Y1, width: 10, height: 2.4, fill: "url(#net)", class: "goal-frame" }, board);

  // Time axis down the right side: a tick for every project, the year wherever it changes,
  // and "Today" level with the goal.
  {
    const AX = 101.5;
    const axis = el("g", { class: "axis", "aria-hidden": "true" }, board);
    const oldest = chain[1];
    el("line", { x1: AX, y1: oldest.y + 2, x2: AX, y2: 5.2 }, axis);
    el("path", { d: `M${AX - 1.3},6.6 L${AX},4 L${AX + 1.3},6.6 Z`, class: "axis-head" }, axis);
    // Label the year when it changes, otherwise the month when it changes.
    let lastYear = null, lastDate = null;
    for (const p of chain.slice(1, -1)) {
      el("line", { x1: AX - 1.2, y1: p.y, x2: AX + 1.2, y2: p.y }, axis);
      const year = p.date.slice(-4);
      const text = year !== lastYear ? year : p.date !== lastDate ? p.date.slice(0, 3) : null;
      if (text) el("text", { x: AX + 2.4, y: p.y + 1, class: year !== lastYear ? "axis-year" : "axis-month" }, axis).textContent = text;
      lastYear = year;
      lastDate = p.date;
    }
    el("text", { x: AX + 2.4, y: 5.6, class: "axis-today" }, axis).textContent = "Today";
  }

  const trail = el("path", { class: "trail", "aria-hidden": "true" }, board);
  const people = el("g", { class: "players" }, board);

  // The goal we attack doubles as a contact link.
  {
    const g = el("g", { class: "player goal", "data-id": "goal", tabindex: 0, role: "button", "aria-label": "Today: what I'm working on now, and how to reach me" }, people);    el("rect", { x: CX - 5, y: 0.4, width: 10, height: 2.6, fill: "url(#net)", class: "goal-frame" }, g);
    el("rect", { x: CX - 9, y: -1, width: 18, height: 11, class: "hit" }, g);
    el("text", { x: CX, y: 7.6, class: "name" }, g).textContent = "Today";
    S.goal.node = g;
  }

  for (const p of [S.keeper, ...onPitch]) {
    const kit = p === S.keeper ? "var(--keeper)" : routeById[p.route].color;
    const g = el("g", { class: "player", "data-id": p.id, tabindex: 0, role: "button", "aria-label": `${p.name}, ${p.kind}` }, people);
    el("circle", { cx: p.x, cy: p.y, r: p.size + 2.4, class: "hit" }, g);
    el("circle", { cx: p.x + 0.45, cy: p.y + 0.6, r: p.size, class: "shadow" }, g);
    el("circle", { cx: p.x, cy: p.y, r: p.size, fill: kit, class: "body" }, g);
    el("circle", { cx: p.x - p.size * 0.3, cy: p.y - p.size * 0.32, r: p.size * 0.34, class: "sheen" }, g);
    el("circle", { cx: p.x, cy: p.y, r: p.size + 1.2, class: "ring" }, g);
    el("text", { x: p.x, y: p.y + p.size + 3.8, class: "name" }, g).textContent = p.short || p.name;
    if (p.date) el("text", { x: p.x, y: p.y + p.size + 6.8, class: "date" }, g).textContent = p.date;
    p.node = g;
  }

  const ball = el("g", { class: "ball", "aria-hidden": "true" }, board);
  el("circle", { r: 1.5, class: "ball-body" }, ball);
  el("path", { d: "M-0.5,-0.6L0.5,-0.6L0.8,0.3L0,0.9L-0.8,0.3Z", class: "ball-patch" }, ball);

  // ---------- the ball ----------
  function placeBall(p) {
    ballAt = { x: p.x, y: p.y };
    ball.setAttribute("transform", `translate(${f(p.x)},${f(p.y)})`);
  }

  // A single pass from wherever the ball is to p (used when someone taps a player).
  function passTo(p, duration) {
    cancelAnimationFrame(anim);
    const a = { ...ballAt };
    if (reduceMotion || (a.x === p.x && a.y === p.y)) { placeBall(p); return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const k = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      placeBall({ x: a.x + (p.x - a.x) * k, y: a.y + (p.y - a.y) * k });
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  const trailPath = (pts) => pts.map((q, k) => `${k ? "L" : "M"}${f(q.x)},${f(q.y)}`).join("");

  // Mark a player as reached: its date fades in. The goal ripples instead.
  function reach(p) {
    if (p !== S.goal) { p.node.classList.add("reached"); return; }
    p.node.classList.remove("scored");
    void p.node.getBBox();
    p.node.classList.add("scored");
  }

  function finishKickoff() {
    chain.forEach((p) => p.node.classList.add("reached"));
    trail.setAttribute("d", trailPath(chain));
  }

  // The opening run: one pass at a time, a short touch on each player, the date
  // appearing as the ball arrives.
  function kickoff() {
    if (reduceMotion) { finishKickoff(); placeBall(S.goal); return; }
    // Unhurried: about a second per pass and a beat on each player, ~13 s in total.
    const PAUSE = 250;
    const legs = chain.slice(1).map((b, i) => {
      const a = chain[i];
      return { a, b, ms: 450 + Math.hypot(b.x - a.x, b.y - a.y) * 14 };
    });
    let leg = 0, legStart = performance.now(), reachedLeg = -1;
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
    reach(S.keeper);
    const step = (now) => {
      const { a, b, ms } = legs[leg];
      const t = Math.min(1, (now - legStart) / ms);
      const k = ease(t);
      const tip = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
      trail.setAttribute("d", trailPath([...chain.slice(0, leg + 1), tip]));
      placeBall(tip);
      if (t === 1 && reachedLeg !== leg) { reach(b); reachedLeg = leg; }
      if (now - legStart >= ms + PAUSE) {
        if (leg === legs.length - 1) return;
        leg += 1;
        legStart = now;
      }
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  // ---------- the panel ----------
  function linkList(links) {
    const p = html("p", { class: "links" });
    for (const l of links) {
      const a = html("a", { href: l.href, class: "btn" }, l.label);
      if (/^https?:/.test(l.href)) { a.target = "_blank"; a.rel = "noopener"; }
      p.appendChild(a);
    }
    return p;
  }

  function contactLinks() {
    const c = S.contact;
    return linkList([
      { label: "Email", href: `mailto:${c.email}` },
      { label: "GitHub", href: c.github },
      { label: "LinkedIn", href: c.linkedin },
      { label: "Resume (PDF)", href: c.resume },
    ]);
  }

  function backButton() {
    const b = html("button", { type: "button", class: "back" }, "All projects");
    b.addEventListener("click", () => showIndex({ focus: true }));
    return b;
  }

  function showIndex({ focus = false } = {}) {
    selected?.node.classList.remove("is-selected");
    selected = null;
    const nodes = [html("h2", { class: "panel-title" }, "Projects")];
    for (const r of S.routes.filter((r) => r.id !== "code")) {
      const h3 = html("h3", { class: "group" });
      h3.append(swatch(r.color), document.createTextNode(r.name));
      const ul = html("ul", { class: "index" });
      onPitch.filter((p) => p.route === r.id).sort((a, b) => a.y - b.y).forEach((p) => {
        const b = html("button", { type: "button", class: "row", "data-id": p.id });
        b.append(html("span", { class: "row-name" }, p.name), html("span", { class: "row-kind" }, `${p.kind}, ${p.when}`));
        if (p.tag) b.appendChild(html("span", { class: "row-tag" }, p.tag));
        b.addEventListener("click", () => select(p.id, { focusPanel: true }));
        const li = html("li", {});
        li.appendChild(b);
        ul.appendChild(li);
      });
      nodes.push(h3, ul);
    }
    panel.replaceChildren(...nodes);
    panel.dataset.route = "";
    history.replaceState(null, "", location.pathname);
    if (focus) panel.querySelector(".row")?.focus();
  }

  function showPlayer(p) {
    if (p === S.goal || p === S.keeper) {
      panel.replaceChildren(
        backButton(),
        html("h2", {}, p === S.goal ? "Today" : "Stanley Chen"),
        html("p", {}, p === S.goal ? S.today : S.intro),
        ...(p === S.goal ? [html("p", {}, `The fastest way to reach me is ${S.contact.email}.`)] : []),
        contactLinks(),
      );
      panel.dataset.route = "";
      return;
    }
    const r = routeById[p.route];
    const nodes = [backButton(), html("p", { class: "card-route" }, r.name), html("h2", {}, p.name)];
    nodes.push(html("p", { class: "kind" }, `${p.kind}, ${p.when}`));
    if (p.tag) nodes.push(html("p", { class: "tag" }, p.tag));
    if (p.title) nodes.push(html("p", { class: "paper-title" }, p.title));
    if (p.summary) nodes.push(html("p", {}, p.summary));
    if (p.facts) {
      const ul = html("ul", { class: "facts" });
      p.facts.forEach((t) => ul.appendChild(html("li", {}, t)));
      nodes.push(ul);
    }
    if (p.stack) nodes.push(html("p", { class: "stack" }, `Built with ${p.stack.join(", ")}`));
    if (p.links.length) nodes.push(linkList(p.links));
    panel.replaceChildren(...nodes);
    panel.dataset.route = p.route;
  }

  function select(id, { fromPitch = false, focusPanel = false } = {}) {
    const p = byId[id];
    if (!p) return;
    selected?.node.classList.remove("is-selected");
    selected = p;
    p.node.classList.add("is-selected");
    finishKickoff(); // in case the opening run was cut short
    passTo(p, 600);
    showPlayer(p);
    history.replaceState(null, "", `#${id}`);
    if (fromPitch && matchMedia("(max-width: 860px)").matches) {
      panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
    if (focusPanel) panel.querySelector(".back")?.focus();
  }

  // ---------- interaction ----------
  const target = (e) => e.target.closest(".player");
  people.addEventListener("click", (e) => { const g = target(e); if (g) select(g.dataset.id, { fromPitch: true }); });
  people.addEventListener("keydown", (e) => {
    const g = target(e);
    if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(g.dataset.id, { fromPitch: true }); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) showIndex(); });

  // ---------- more code + contact, below the pitch ----------
  const code = document.getElementById("code-list");
  [...S.players.filter((p) => p.route === "code")].reverse().forEach((p) => {
    const li = html("li", {});
    const a = html("a", { href: p.links[0].href, target: "_blank", rel: "noopener" }, p.name);
    li.append(a, html("span", { class: "code-kind" }, `${p.kind}, ${p.when}`));
    code.appendChild(li);
  });
  document.getElementById("contact-email").textContent = S.contact.email;
  document.getElementById("contact-links").replaceWith(contactLinks());

  // ---------- start ----------
  document.getElementById("intro").textContent = S.intro;
  const fromHash = byId[decodeURIComponent(location.hash.slice(1))];
  if (fromHash) {
    showPlayer(fromHash);
    selected = fromHash;
    fromHash.node.classList.add("is-selected");
  } else {
    showIndex();
  }
  kickoff();
})();
