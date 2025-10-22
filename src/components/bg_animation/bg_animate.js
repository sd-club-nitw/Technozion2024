import React, { useRef, useEffect, useState } from "react";

    export const WebCanvas = () => {
        const canvasRef = useRef(null);
        const mousePos = useRef({ x: 0, y: 0 });
        const [ctx, setCtx] = useState(null);
        const [points, setPoints] = useState([]);

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            setCtx(context);

            // Set canvas dimensions
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                setPoints([]); // Clear points
                initPoints(); // Reinitialize points
            };

            const initPoints = () => {
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const screenArea = screenWidth * screenHeight;
                const baseArea = 1000000;  // Set a base area, e.g., 1000000 pixels (1000x1000)
                const numPoints = Math.floor((screenArea / baseArea) * 500);
                const newPoints = [];
                for (let i = 0; i < numPoints; i++) {
                    newPoints.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 1.5, // Random speed
                        vy: (Math.random() - 0.5) * 1.5,
                        isFollowing: false, // Flag to track if the point is following the cursor
                    });
                }
                setPoints(newPoints);
            };

            window.addEventListener('resize', handleResize);
            initPoints();

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, []);

        const drawLines = (pointA, pointB) => {
            const dist = Math.sqrt(
                Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
            );
            if (dist < 100) {  // Distance threshold for drawing lines
                ctx.beginPath();
                ctx.moveTo(pointA.x, pointA.y);
                ctx.lineTo(pointB.x, pointB.y);
                ctx.strokeStyle = `rgba(22, 246, 243, ${1 - dist / 100})`; // Changed to #16f6f3
                ctx.lineWidth = 0.5; // Thinner lines
                ctx.stroke();
            }
        };

        const movePoints = () => {
            points.forEach(point => {
                if (point.isFollowing) {
                    // Move point towards the cursor with increased speed
                    point.x += (mousePos.current.x - point.x) * 0.15;
                    point.y += (mousePos.current.y - point.y) * 0.15;
                } else {
                    point.x += point.vx;
                    point.y += point.vy;

                    // Bounce off edges
                    if (point.x > canvasRef.current.width || point.x < 0) point.vx *= -1;
                    if (point.y > canvasRef.current.height || point.y < 0) point.vy *= -1;
                }
            });
        };

        useEffect(() => {
            const animate = () => {
                const canvas = canvasRef.current;
                if (ctx && points.length > 0 && canvas) { // Check for null
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    movePoints();

                    // Draw lines between nearby points
                    points.forEach((pointA, index) => {
                        points.forEach((pointB, i) => {
                            if (i > index) {
                                drawLines(pointA, pointB);
                            }
                        });
                    });
                    window.requestAnimationFrame(animate);
                }
            };
            window.requestAnimationFrame(animate);
        }, [ctx, points]);

        // Track mouse movement
        const handleMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;
            points.forEach(point => {
                const dist = Math.sqrt(
                    Math.pow(point.x - mousePos.current.x, 2) + Math.pow(point.y - mousePos.current.y, 2)
                );
                point.isFollowing = dist < 50; // Set isFollowing to true if cursor is close
            });
        };

        return <canvas ref={canvasRef} onMouseMove={handleMouseMove}></canvas>;
    };