// popup.js - demo-mode UI wiring. Replace demoScanLink() with real API call scanLink(url) later.

const scanBtn = document.getElementById('scanBtn');
const resultsList = document.getElementById('resultsList');
const summary = document.getElementById('summary');
const progressRow = document.getElementById('progressRow');
const spinner = document.getElementById('spinner');
const progressText = document.getElementById('progressText');
const autoScanToggle = document.getElementById('autoScan');

let lastResults = [];

document.addEventListener('DOMContentLoaded', () => {
  // restore auto-scan preference
  chrome.storage.local.get(['autoScanEnabled'], (res) => {
    if (res.autoScanEnabled) {
      autoScanToggle.checked = true;
      // optional: trigger initial scan for dev
      // triggerScan();
    }
  });
});

// Scan button click
scanBtn.addEventListener('click', triggerScan);

// auto-scan toggle
autoScanToggle.addEventListener('change', (e) => {
  chrome.storage.local.set({ autoScanEnabled: e.target.checked });
});

// trigger scan flow
async function triggerScan() {
  showProgress(true, 'Collecting links on page…');

  // get active tab and inject a script to collect links
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) { showError('No active tab'); return; }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: collectLinksFromPage,
    }, async (results) => {
      const links = (results && results[0] && results[0].result) || [];
      if (!links.length) {
        showProgress(false);
        summary.textContent = 'No links found on this page';
        resultsList.innerHTML = '';
        return;
      }

      showProgress(true, `Scanning ${links.length} links…`);
      // sanitize / dedupe
      const uniq = Array.from(new Set(links)).slice(0, 80); // limit for UI/perf
      // Demo: call demoScanLink for each link (replace with scanLink)
      const scanned = [];
      for (let i = 0; i < uniq.length; i++) {
        const url = uniq[i];
        progressText.textContent = `Scanning ${i+1}/${uniq.length}`;
        const verdict = await demoScanLink(url); // swap this with real API
        scanned.push({ url, verdict });
      }

      lastResults = scanned;
      renderResults(scanned);
      showProgress(false);
    });
  });
}

// Collect links from the page context
function collectLinksFromPage() {
  const anchors = Array.from(document.querySelectorAll('a'));
  const hrefs = anchors.map(a => a.href).filter(Boolean);
  // also try data from text nodes for plain URLs (simple)
  const textUrls = Array.from(document.body.innerText.matchAll(/https?:\/\/[^\s/$.?#].[^\s)('"<>]*/g) || []).map(m => m[0]);
  return hrefs.concat(textUrls);
}

// Demo verdict generator (replace with real backend call)
async function demoScanLink(url) {
  // small delay to simulate network
  await new Promise(r => setTimeout(r, 220 + Math.random()*400));
  // heuristics-ish random for demo
  if (url.includes('login') || url.includes('verify') || url.includes('pay') || url.includes('secure')) {
    // 30% malicious, 40% suspicious, 30% safe
    const r = Math.random();
    if (r < 0.35) return 'malicious';
    if (r < 0.75) return 'suspicious';
    return 'safe';
  } else {
    // mostly safe
    const r = Math.random();
    if (r < 0.05) return 'malicious';
    if (r < 0.15) return 'suspicious';
    return 'safe';
  }
}

// UI rendering
function renderResults(items) {
  resultsList.innerHTML = '';
  const totals = { safe: 0, suspicious: 0, malicious: 0 };
  items.forEach(it => {
    totals[it.verdict] = (totals[it.verdict]||0) + 1;
    const li = document.createElement('li');

    const left = document.createElement('div');
    left.className = 'left';
    const domain = document.createElement('div');
    domain.className = 'domain';
    domain.title = it.url;
    domain.textContent = trimUrl(it.url);
    left.appendChild(domain);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = new URLSafeNote(it.url);
    left.appendChild(meta);

    const badge = document.createElement('div');
    badge.className = 'badge ' + (it.verdict === 'safe' ? 'safe' : (it.verdict === 'suspicious' ? 'suspicious' : 'malicious'));
    badge.textContent = (it.verdict === 'safe' ? 'SAFE' : (it.verdict === 'suspicious' ? 'SUSP' : 'MAL'));
    li.appendChild(left);
    li.appendChild(badge);

    // clicking opens in a new tab (real extension should optionally open in sandbox)
    li.addEventListener('click', () => {
      chrome.tabs.create({ url: it.url });
    });

    resultsList.appendChild(li);
  });

  summary.textContent = `${totals.malicious || 0} ⚠️ ${totals.suspicious || 0} ⚠ ${totals.safe || 0} safe`;
}

// small helpers
function showProgress(show, text){
  progressRow.hidden = !show;
  if (show) progressText.textContent = text || 'Working…';
}

function showError(msg){
  showProgress(false);
  summary.textContent = msg;
  resultsList.innerHTML = '';
}

function trimUrl(u){
  try {
    const parsed = new URL(u);
    return parsed.hostname + (parsed.pathname.length > 1 ? parsed.pathname.slice(0,22)+'...' : '');
  } catch(e){ return u.length>38? u.slice(0,36)+'...':u; }
}

function newURLSafeNote(u){
  try { return new URL(u).origin; } catch(e){ return ''; }
}
// minor fallback for older name
function URLSafeNote(u){ try { return new URL(u).origin; } catch(e){ return ''; } }
