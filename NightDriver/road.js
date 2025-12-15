// road.js
export class Road {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        // Constants for perspective rendering
        this.cameraZ = 1200; // Focal length for projection
        this.segmentLength = 100; // "Real-world" length of a segment
        this.roadWidth = 2000; // "Real-world" width of the road
        this.segments = [];
        
        // Road generation constants
        this.LOOKAHEAD_SEGMENTS = 300; // Number of segments to generate ahead
        this.MIN_CURVE_DURATION = 15; // Minimum segments before curve change
        this.CURVE_DURATION_REDUCTION = 0.2; // Rate of curve frequency increase
        
        // Curve generation state
        this.curveIntensity = 0.2; // Starting curve intensity
        this.currentCurve = 0;
        this.curveTimer = 0;
        this.curveDuration = 30; // Segments before changing curve
        
        this.generateTrack();
    }

    generateTrack() {
        // Create initial segments to draw far into the distance
        for (let i = 0; i < this.LOOKAHEAD_SEGMENTS; i++) {
            this.segments.push({
                z: i * this.segmentLength, // Distance from camera
                curve: 0, // Start straight
                y: 0 
            });
        }
    }
    
    // Extend the road infinitely as the player progresses
    extendRoad(playerZ) {
        const neededSegments = Math.floor(playerZ / this.segmentLength) + this.LOOKAHEAD_SEGMENTS;
        
        while (this.segments.length < neededSegments) {
            // Update curve generation timer
            this.curveTimer++;
            
            // Change curve direction periodically
            if (this.curveTimer >= this.curveDuration) {
                this.curveTimer = 0;
                
                // Choose new curve: straight, left, or right
                const r = Math.random();
                if (r < 0.2) {
                    this.currentCurve = 0; // Straight (less common now)
                } else if (r < 0.6) {
                    this.currentCurve = this.curveIntensity;
                } else {
                    this.currentCurve = -this.curveIntensity;
                }
                
                // Gradually increase difficulty
                this.curveIntensity = Math.min(0.6, this.curveIntensity + 0.005);
                this.curveDuration = Math.max(this.MIN_CURVE_DURATION, this.curveDuration - this.CURVE_DURATION_REDUCTION);
            }
            
            this.segments.push({
                z: this.segments.length * this.segmentLength,
                curve: this.currentCurve,
                y: 0
            });
        }
    }

    // --- Core Perspective Logic ---
    project(p, cameraX, cameraY, cameraZ) {
        // Z is relative to the camera
        const z = p.z - cameraZ; 
        const scale = this.cameraZ / z;

        // Screen X and Y
        const screenX = this.width / 2 + (p.x - cameraX) * scale;
        const screenY = this.height / 2 - (p.y - cameraY) * scale;

        // Perspective-scaled width
        const roadW = this.roadWidth * scale;
        
        return { 
            x: screenX, 
            y: screenY, 
            scale: scale, 
            w: roadW,
            z: z // Return relative Z
        };
    }

    draw(playerZ, playerX) {
        // Extend road as player progresses
        this.extendRoad(playerZ);
        
        // Simple fixed camera Y for a flat road
        const cameraY = 1400; 

        // Calculate which segment the player is on
        const baseSegment = Math.floor(playerZ / this.segmentLength);
        
        // Draw segments from far to near (painters algorithm)
        // Draw a range of segments ahead of the player
        const drawDistance = 200; // Number of segments to draw ahead
        
        for (let i = baseSegment + drawDistance; i >= baseSegment; i--) {
            if (i < 0 || i >= this.segments.length - 1) continue;
            
            const current = this.segments[i];
            const next = this.segments[i + 1];

            // 1. Calculate perspective for the start point
            let p1 = this.project(
                { x: current.curve * this.roadWidth, y: current.y, z: current.z },
                playerX, cameraY, playerZ
            );
            
            // 2. Calculate perspective for the end point
            let p2 = this.project(
                { x: next.curve * this.roadWidth, y: next.y, z: next.z },
                playerX, cameraY, playerZ
            );
            
            // Optimization: Skip if both points are behind camera (AND condition)
            if (p1.z <= 0 || p2.z <= 0) continue; 
            
            // --- DRAWING: Trapezoid Road ---
            this.ctx.beginPath();
            
            // Far Left Corner (P1)
            this.ctx.moveTo(p1.x - p1.w / 2, p1.y);
            // Near Left Corner (P2)
            this.ctx.lineTo(p2.x - p2.w / 2, p2.y);
            // Near Right Corner (P2)
            this.ctx.lineTo(p2.x + p2.w / 2, p2.y);
            // Far Right Corner (P1)
            this.ctx.lineTo(p1.x + p1.w / 2, p1.y);

            this.ctx.closePath();
            
            // Alternating color for "stripes" - EXTENSIBILITY: Add other visual elements here
            this.ctx.fillStyle = (i % 2 === 0) ? '#444' : '#555';
            this.ctx.fill();
        }
    }
}
