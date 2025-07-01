"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface Oval {
  id: number;
  cx: number;
  cy: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  direction: number;
}

export default function HeroAnimation({ className }: { className?: string }) {
  const [ovals, setOvals] = useState<Oval[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize ovals on component mount
  useEffect(() => {
    // Get container dimensions instead of window dimensions
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      return { width, height };
    };

    // Create oval objects based on container size
    const createOvals = () => {
      const { width, height } = updateDimensions() || dimensions;

      // Define center point relative to container
      const centerX = width / 2;
      const centerY = height / 2;

      const colors = [
        "rgba(255, 105, 180, 0.5)", // hot pink
        "rgba(65, 105, 225, 0.5)", // royal blue
        // "rgba(50, 205, 50, 0.5)", // lime green
        "rgba(255, 165, 0, 0.5)", // orange
        "rgba(138, 43, 226, 0.5)", // purple
        "rgba(0, 191, 255, 0.5)", // deep sky blue
      ];

      // Calculate the maximum radius that fits within the container
      // Using 80% of half the smallest dimension to leave some room for movement
      const maxRadius = Math.min(width, height) * 0.4;

      // Fixed proportions for ovals that will be scaled to maximum size
      const ovalSizes = [
        { rx: 100, ry: 60 },
        { rx: 90, ry: 70 },
        { rx: 85, ry: 55 },
        { rx: 110, ry: 65 },
        { rx: 95, ry: 75 },
        { rx: 80, ry: 60 },
        { rx: 105, ry: 50 },
        { rx: 75, ry: 55 },
        { rx: 115, ry: 65 },
        { rx: 85, ry: 70 },
        { rx: 95, ry: 60 },
        { rx: 70, ry: 45 },
      ];

      // Find the largest radius value to use for scaling
      const largestRx = Math.max(...ovalSizes.map((size) => size.rx));

      // Calculate scaling factor to fit all ovals within the container
      const scaleFactor = maxRadius / largestRx;

      const rotationSpeeds = [
        0.3, 0.4, 0.25, 0.35, 0.45, 0.5, 0.28, 0.32, 0.42, 0.38, 0.47, 0.22,
      ];
      const directions = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1];

      const newOvals: Oval[] = [];
      const count = 8; // Fixed count for more control

      // Scale offset based on container size (smaller offset for denser grouping)
      const maxOffset = maxRadius * 0.25;

      for (let i = 0; i < count; i++) {
        // Calculate a slight offset from the center
        const offsetX = Math.random() * maxOffset * 2 - maxOffset;
        const offsetY = Math.random() * maxOffset * 2 - maxOffset;

        newOvals.push({
          id: i,
          cx: centerX + offsetX,
          cy: centerY + offsetY,
          radiusX: ovalSizes[i].rx * scaleFactor, // Scale to fit container
          radiusY: ovalSizes[i].ry * scaleFactor, // Scale to fit container
          rotation: (i / count) * 360, // Evenly distribute initial angles
          rotationSpeed: rotationSpeeds[i],
          color: colors[i % colors.length],
          direction: directions[i],
        });
      }

      setOvals(newOvals);
    };

    // Initialize after a brief delay to ensure container is mounted and sized
    const initTimer = setTimeout(() => {
      createOvals();
    }, 100);

    // Handle resize events
    const handleResize = () => {
      if (containerRef.current) {
        createOvals();
      }
    };

    // Use ResizeObserver for more accurate container size changes
    let resizeObserver: ResizeObserver;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize events
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Animation effect
  useEffect(() => {
    if (ovals.length === 0) return;

    let animationFrame: number;
    let lastTime = 0;

    const animate = (time: number) => {
      // Control animation speed
      if (lastTime === 0 || time - lastTime > 25) {
        lastTime = time;

        setOvals((prevOvals) =>
          prevOvals.map((oval) => ({
            ...oval,
            rotation: oval.rotation + oval.rotationSpeed * oval.direction,
          }))
        );
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [ovals.length]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      <svg
        width="100%"
        height="100%"
        className="absolute top-0 left-0 w-full h-full"
        style={{ filter: "blur(0.5px)" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g style={{ mixBlendMode: "screen" }}>
          {ovals.map((oval) => (
            <ellipse
              key={oval.id}
              cx={oval.cx}
              cy={oval.cy}
              rx={oval.radiusX}
              ry={oval.radiusY}
              fill={oval.color}
              transform={`rotate(${oval.rotation}, ${oval.cx}, ${oval.cy})`}
              filter="url(#glow)"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
