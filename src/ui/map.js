import { MAP_PINS, TRAVEL_MODES } from '../data/mapConfig.js';

/**
 * Map overlay — toggled by M (prd.md > The map and travel selection).
 * A stylized London atlas/compass with a labeled pin per ground and a
 * "You are here" marker on the current stadium. Clicking the destination
 * pin reveals travel-mode choices (Bus); selecting Bus launches the
 * journey. Clicking the current pin does nothing but a brief nudge.
 */
export class MapOverlay {
  constructor(overlayRoot, { getCurrentId, onTravel }) {
    this.getCurrentId = getCurrentId;
    this.onTravel = onTravel;
    this.open = false;
    this._selectedDest = null;

    this.el = document.createElement('div');
    this.el.id = 'map-overlay';
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
      <div class="map-panel" style="
        position:relative;width:min(680px,92vw);height:min(520px,80vh);
        background:
          repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 40px),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 40px),
          radial-gradient(circle at 50% 40%, #16305a, #0a1a33);
        border:1px solid rgba(255,255,255,0.14);border-radius:16px;
        box-shadow:0 24px 70px rgba(0,0,0,0.55);overflow:hidden;
        font-family:'Trebuchet MS','Segoe UI',sans-serif;color:#f6f8ff;">
        <div style="position:absolute;top:1rem;left:1.2rem;font-size:1.2rem;font-weight:800;letter-spacing:0.08em;">LONDON</div>
        <div style="position:absolute;top:1rem;right:1.2rem;font-size:0.8rem;opacity:0.65;">N \u2191 · press M to close</div>
        <div class="map-pins"></div>
        <div class="map-travel" style="
          position:absolute;left:50%;bottom:1.1rem;transform:translateX(-50%);
          display:none;gap:0.6rem;align-items:center;
          background:rgba(8,14,30,0.85);padding:0.6rem 0.9rem;border-radius:999px;
          border:1px solid rgba(255,255,255,0.18);"></div>
        <div class="map-nudge" style="
          position:absolute;left:50%;top:1.1rem;transform:translateX(-50%);
          opacity:0;transition:opacity 0.25s;font-size:0.85rem;
          background:rgba(8,14,30,0.9);padding:0.3rem 0.8rem;border-radius:999px;"></div>
      </div>
    `;
    overlayRoot.appendChild(this.el);
    this._pinsEl = this.el.querySelector('.map-pins');
    this._travelEl = this.el.querySelector('.map-travel');
    this._nudgeEl = this.el.querySelector('.map-nudge');
  }

  toggle() {
    this.open ? this.hide() : this.show();
  }

  show() {
    this._selectedDest = null;
    this._travelEl.style.display = 'none';
    this._renderPins();
    this.el.style.display = 'flex';
    this.open = true;
  }

  hide() {
    this.el.style.display = 'none';
    this.open = false;
  }

  _renderPins() {
    const currentId = this.getCurrentId();
    this._pinsEl.innerHTML = '';
    for (const pin of Object.values(MAP_PINS)) {
      const isCurrent = pin.id === currentId;
      const el = document.createElement('div');
      Object.assign(el.style, {
        position: 'absolute',
        left: pin.x + '%',
        top: pin.y + '%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        cursor: isCurrent ? 'default' : 'pointer',
      });
      el.innerHTML = `
        <div style="width:20px;height:20px;margin:0 auto;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);background:${pin.color};
          box-shadow:0 0 0 4px rgba(255,255,255,0.15), 0 4px 10px rgba(0,0,0,0.5);"></div>
        <div style="margin-top:0.5rem;font-weight:800;font-size:0.95rem;">${pin.name}</div>
        <div style="font-size:0.72rem;opacity:0.75;">${pin.sub}</div>
        ${isCurrent ? '<div style="margin-top:0.2rem;font-size:0.7rem;letter-spacing:0.1em;color:#9fe0a0;">\u25CF YOU ARE HERE</div>' : ''}
      `;
      el.addEventListener('click', () => {
        if (isCurrent) this._nudge("You're already here.");
        else this._selectDest(pin);
      });
      this._pinsEl.appendChild(el);
    }
  }

  _selectDest(pin) {
    this._selectedDest = pin.id;
    this._travelEl.innerHTML =
      `<span style="font-size:0.85rem;opacity:0.8;">Travel to <b>${pin.name}</b>:</span>`;
    for (const mode of TRAVEL_MODES) {
      const b = document.createElement('button');
      b.textContent = `${mode.emoji} ${mode.label}`;
      b.disabled = !mode.available;
      Object.assign(b.style, {
        padding: '0.45rem 1rem',
        background: mode.available ? '#1f6fe0' : 'rgba(255,255,255,0.1)',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        font: "700 0.9rem 'Trebuchet MS','Segoe UI',sans-serif",
        cursor: mode.available ? 'pointer' : 'not-allowed',
      });
      if (mode.available) {
        b.addEventListener('click', () => {
          this.hide();
          this.onTravel(this._selectedDest, mode.id);
        });
      }
      this._travelEl.appendChild(b);
    }
    this._travelEl.style.display = 'flex';
  }

  _nudge(text) {
    this._nudgeEl.textContent = text;
    this._nudgeEl.style.opacity = '1';
    clearTimeout(this._nudgeTimer);
    this._nudgeTimer = setTimeout(() => (this._nudgeEl.style.opacity = '0'), 1600);
  }
}
