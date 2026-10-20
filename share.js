"use strict";
// Adds small share links (copy link, X, Facebook, WhatsApp, Pinterest) under every quote on a topic page.
// Each quote has a stable id, so the shared link opens the page at that exact quote.
(function () {
  const script = document.currentScript;
  const siteName = script?.dataset.site || document.title;
  const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href.split("#")[0];
  const image = document.querySelector('meta[property="og:image"]')?.content || "";
  const pop = (url) => window.open(url, "_blank", "noopener,noreferrer,width=720,height=620");

  async function copy(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const area = document.createElement("textarea");
    area.value = text; area.style.position = "fixed"; area.style.opacity = "0";
    document.body.append(area); area.select(); document.execCommand("copy"); area.remove();
  }

  document.querySelectorAll("[data-share-quote]").forEach((entry, i) => {
    if (!entry.id) entry.id = `q-${i + 1}`;
    const quoteEl = entry.querySelector("blockquote");
    if (!quoteEl) return;
    const by = entry.dataset.by ? ` — ${entry.dataset.by}` : ` — ${siteName}`;
    const text = `“${quoteEl.textContent.trim()}”${by}`;
    const url = `${canonical}#${entry.id}`;
    const u = encodeURIComponent(url), t = encodeURIComponent(text);
    const targets = [
      ["X", `https://twitter.com/intent/tweet?text=${t}&url=${u}`],
      ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
      ["WhatsApp", `https://wa.me/?text=${t}%0A%0A${u}`],
      ["Pinterest", `https://www.pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(image)}&description=${t}`]
    ];
    const row = document.createElement("div");
    row.className = "share-row";
    row.setAttribute("aria-label", "Share this quote");
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "Copy link";
    copyBtn.addEventListener("click", async () => {
      try { await copy(`${text}\n\n${url}`); copyBtn.textContent = "Copied ✓"; }
      catch { copyBtn.textContent = "Copy unavailable"; }
      setTimeout(() => { copyBtn.textContent = "Copy link"; }, 1600);
    });
    row.append(copyBtn);
    targets.forEach(([label, href]) => {
      const a = document.createElement("a");
      a.href = href; a.textContent = label; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", `Share on ${label}`);
      a.addEventListener("click", (e) => { e.preventDefault(); pop(href); });
      row.append(a);
    });
    entry.append(row);
  });

  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
