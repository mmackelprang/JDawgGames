/**
 * TouchControls
 * Manages touch input controls for mobile devices
 */

export interface TouchState {
  left: boolean;
  right: boolean;
  launch: boolean;
}

export class TouchControls {
  private touchState: TouchState = {
    left: false,
    right: false,
    launch: false
  };

  private leftBtn: HTMLElement | null = null;
  private rightBtn: HTMLElement | null = null;
  private launchBtn: HTMLElement | null = null;
  private touchControlsDiv: HTMLElement | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Get references to touch control elements
    this.leftBtn = document.getElementById('leftBtn');
    this.rightBtn = document.getElementById('rightBtn');
    this.launchBtn = document.getElementById('launchBtn');
    this.touchControlsDiv = document.getElementById('touchControls');

    // Detect touch device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (isTouchDevice && this.touchControlsDiv) {
      this.touchControlsDiv.style.display = 'block';
      this.setupTouchListeners();
    }
  }

  private setupTouchListeners(): void {
    if (this.leftBtn) {
      this.leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchState.left = true;
      });
      this.leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.touchState.left = false;
      });
      this.leftBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        this.touchState.left = false;
      });
    }

    if (this.rightBtn) {
      this.rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchState.right = true;
      });
      this.rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.touchState.right = false;
      });
      this.rightBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        this.touchState.right = false;
      });
    }

    if (this.launchBtn) {
      this.launchBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.touchState.launch = true;
      });
      this.launchBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.touchState.launch = false;
      });
      this.launchBtn.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        this.touchState.launch = false;
      });
    }
  }

  public getState(): TouchState {
    return this.touchState;
  }

  public isLeftPressed(): boolean {
    return this.touchState.left;
  }

  public isRightPressed(): boolean {
    return this.touchState.right;
  }

  public isLaunchPressed(): boolean {
    return this.touchState.launch;
  }

  public wasLaunchJustPressed(): boolean {
    // For detecting single press events, we need to track previous state
    // This is a simplified version - the scene will handle the debouncing
    return this.touchState.launch;
  }

  public resetLaunch(): void {
    this.touchState.launch = false;
  }
}
