/**
 * Contextual tutorial.
 * Reveals control hints progressively, in the order the player naturally
 * needs them, and never blocks movement (spec.md > Components: Tutorial;
 * prd.md > Exploring a stadium). The hint is a small non-blocking HTML
 * caption at the bottom of the screen.
 *
 * Flow: look -> move -> interact. Each step shows briefly, then the next
 * step waits for the matching player action before appearing.
 */
export class Tutorial {
  constructor(overlayRoot) {
    this.el = document.createElement('div');
    this.el.id = 'tutorial-hint';
    Object.assign(this.el.style, {
      position: 'fixed',
      left: '50%',
      bottom: '7%',
      transform: 'translateX(-50%)',
      padding: '0.6rem 1.1rem',
      background: 'rgba(10,16,32,0.72)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: '999px',
      font: "600 0.95rem 'Trebuchet MS', 'Segoe UI', sans-serif",
      color: '#f6f8ff',
      letterSpacing: '0.02em',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap',
      zIndex: '12',
    });
    overlayRoot.appendChild(this.el);

    this._step = 0;
    this._hideTimer = null;
  }

  _show(text, autoHideMs = 0) {
    this.el.textContent = text;
    this.el.style.opacity = '1';
    if (this._hideTimer) clearTimeout(this._hideTimer);
    if (autoHideMs) {
      this._hideTimer = setTimeout(() => (this.el.style.opacity = '0'), autoHideMs);
    }
  }

  /** Called once pointer lock is first engaged. */
  begin() {
    if (this._step === 0) {
      this._step = 1;
      this._show('Move your mouse to look around', 0);
    }
  }

  /** Player looked around for the first time. */
  onLook() {
    if (this._step === 1) {
      this._step = 2;
      this._show('Use W A S D to walk — try approaching the stadium', 0);
    }
  }

  /** Player moved for the first time. */
  onMove() {
    if (this._step === 2) {
      this._step = 3;
      this._show('Great — walk through the entrance and explore. Press J for your log · M for the map', 6000);
    }
  }
}
