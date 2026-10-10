import { addCard } from '../state/logStore.js';

/**
 * Card overlay — a non-blocking panel that slides in from the right when a
 * zone is entered, shows that zone's rivalry fact, writes the card to the
 * log store, and auto-dismisses after ~7s. Movement never stops: the panel
 * has pointer-events disabled and sits in a corner (prd.md > Geofence
 * info-zones and cards; spec.md > Card Overlay).
 */
export class CardOverlay {
  constructor(overlayRoot) {
    this.el = document.createElement('div');
    this.el.id = 'card-overlay';
    Object.assign(this.el.style, {
      position: 'fixed',
      top: '5%',
      right: '0',
      width: 'min(340px, 80vw)',
      padding: '1rem 1.2rem',
      marginRight: '1.2rem',
      background: 'linear-gradient(135deg, rgba(12,20,42,0.94), rgba(8,14,30,0.94))',
      borderLeft: '4px solid var(--accent, #7fb0ff)',
      borderRadius: '10px 4px 4px 10px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
      color: '#f6f8ff',
      font: "0.95rem/1.45 'Trebuchet MS', 'Segoe UI', sans-serif",
      transform: 'translateX(120%)',
      transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
      pointerEvents: 'none',
      zIndex: '13',
    });
    this.el.innerHTML = `
      <div class="card-label" style="font-size:0.72rem;letter-spacing:0.16em;text-transform:uppercase;opacity:0.7;margin-bottom:0.3rem;"></div>
      <div class="card-title" style="font-size:1.15rem;font-weight:800;margin-bottom:0.4rem;"></div>
      <div class="card-body"></div>
    `;
    overlayRoot.appendChild(this.el);

    this._labelEl = this.el.querySelector('.card-label');
    this._titleEl = this.el.querySelector('.card-title');
    this._bodyEl = this.el.querySelector('.card-body');
    this._hideTimer = null;
  }

  /** Set the per-ground accent colour used for the card's border. */
  setAccent(cssColor) {
    this.el.style.setProperty('--accent', cssColor);
    this.el.style.borderLeftColor = cssColor;
  }

  /** Show a card (zone label + card content) and record it to the log. */
  show(zoneLabel, card) {
    addCard(card.id);
    this._labelEl.textContent = zoneLabel;
    this._titleEl.textContent = card.title;
    this._bodyEl.textContent = card.body;
    // Force reflow so re-triggering restarts the slide animation.
    this.el.style.transform = 'translateX(120%)';
    void this.el.offsetWidth;
    this.el.style.transform = 'translateX(0)';
    if (this._hideTimer) clearTimeout(this._hideTimer);
    this._hideTimer = setTimeout(() => this.hide(), 7000);
  }

  hide() {
    this.el.style.transform = 'translateX(120%)';
  }
}
