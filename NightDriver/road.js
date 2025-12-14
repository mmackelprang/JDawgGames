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
        this.generateTrack();
    }

    generateTrack() {
        // Create 500 segments to draw far into the distance
        for (let i = 0; i < 500; i++) {
            this.segments.push({
                z: i * this.segmentLength, // Distance from camera
                curve: Math.sin(i / 50) * 0.2, // Simple sine curve track
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
            if (p1.z <= 0 && p2.z <= 0) continue; 
            
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
