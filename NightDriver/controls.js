// controls.js
export class Controls {
    constructor() {
        this.isLeft = false;
        this.isRight = false;
        this.onRestart = null; // Callback for restart action
        this.setupKeyboard();
        this.setupTouch();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.isLeft = true;
            if (e.key === 'ArrowRight' || e.key === 'd') this.isRight = true;
            if (e.key === ' ' && this.onRestart) {
                e.preventDefault();
                this.onRestart();
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.isLeft = false;
            if (e.key === 'ArrowRight' || e.key === 'd') this.isRight = false;
        });
    }

    setupTouch() {
        const controls = document.getElementById('mobile-controls');
        
        const setAction = (action, state) => {
            if (action === 'left') this.isLeft = state;
            if (action === 'right') this.isRight = state;
        };

        controls.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling on mobile
            for (let touch of e.changedTouches) {
                // Determine which control pad was touched
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                const action = target?.dataset?.action;
                setAction(action, true);
            }
        });

        controls.addEventListener('touchend', (e) => {
            e.preventDefault();
            // A safer way to reset state on touchend is to check touches
            // For simplicity, we assume release means stopping
            this.isLeft = false;
            this.isRight = false;
            // A more complex implementation would track multi-touch IDs
        });
        
        // Handle touchleave for more robust mobile control
        controls.addEventListener('touchcancel', () => {
             this.isLeft = false;
             this.isRight = false;
        });
        
        // Add tap-to-restart functionality (tap anywhere on canvas when game is over)
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => {
                // Only call restart if callback exists and touch is on canvas
                // The callback in game.js checks state.gameOver before actually restarting
                // This prevents interference with mobile steering controls (which are separate divs)
                if (e.target === canvas && this.onRestart) {
                    e.preventDefault(); // Prevent default touch behavior
                    e.stopPropagation(); // Stop event from bubbling
                    this.onRestart();
                }
            });
        }
    }
}
