import { getCollected, isPersistent } from '../state/logStore.js';

/**
 * Log overlay — toggled by J. Reads the log store and lists every collected
 * card's title + body across both grounds, or a "No cards collected yet"
 * empty state. Blocking modal is fine here: it's an explicit pause the
 * player opens and closes (prd.md > The collected-cards log).
 *
 * `allCards` is a flat id -> card lookup assembled from the stadium data.
 */
export class LogOverlay {
  constructor(overlayRoot, allCards) {
    this.allCards = allCards;
    this.open = false;

    this.el = document.createElement('div');
    this.el.id = 'log-overlay';
    Object.assign(this.el.style, {
      position: 'fixed',
      inset: '0',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,7,15,0.82)',
      pointerEvents: 'auto',
      zIndex: '15',
    });

    this.el.innerHTML = `
      <div class="log-panel" style="
        width:min(560px,90vw);max-height:80vh;overflow:auto;
        background:#0c142a;border:1px solid rgba(255,255,255,0.12);
        border-radius:14px;padding:1.6rem 1.8rem;
        color:#f6f8ff;font-family:'Trebuchet MS','Segoe UI',sans-serif;
        box-shadow:0 20px 60px rgba(0,0,0,0.5);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
          <h2 style="margin:0;font-size:1.4rem;letter-spacing:0.03em;">Collected Cards</h2>
          <span style="opacity:0.6;font-size:0.85rem;">press J to close</span>
        </div>
        <div class="log-list"></div>
        <div class="log-note" style="margin-top:1rem;font-size:0.75rem;opacity:0.55;"></div>
      </div>
    `;
    overlayRoot.appendChild(this.el);
    this._listEl = this.el.querySelector('.log-list');
    this._noteEl = this.el.querySelector('.log-note');
  }

  toggle() {
    this.open ? this.hide() : this.show();
  }

  show() {
    this._render();
    this.el.style.display = 'flex';
    this.open = true;
  }

  hide() {
    this.el.style.display = 'none';
    this.open = false;
  }

  _render() {
    const ids = getCollected();
    if (!ids.length) {
      this._listEl.innerHTML = `
        <div style="padding:2rem 0;text-align:center;opacity:0.7;">
          No cards collected yet.<br>
          <span style="font-size:0.85rem;">Walk into the glowing zones around the ground to collect rivalry cards.</span>
        </div>`;
    } else {
      this._listEl.innerHTML = ids
        .map((id) => this.allCards[id])
        .filter(Boolean)
        .map(
          (c) => `
          <div style="padding:0.8rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">
            <div style="font-weight:800;font-size:1.05rem;margin-bottom:0.2rem;">${c.title}</div>
            <div style="font-size:0.9rem;line-height:1.4;opacity:0.9;">${c.body}</div>
          </div>`
        )
        .join('');
    }
    this._noteEl.textContent = isPersistent()
      ? 'Saved to this browser — your log is here when you return.'
      : 'This browser blocks storage, so the log lasts only this session.';
  }
}
