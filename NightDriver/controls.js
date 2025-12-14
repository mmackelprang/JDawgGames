// controls.js
export class Controls {
    constructor() {
        this.isLeft = false;
        this.isRight = false;
        this.setupKeyboard();
        this.setupTouch();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') this.isLeft = true;
            if (e.key === 'ArrowRight' || e.key === 'd') this.isRight = true;
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
    }
}
