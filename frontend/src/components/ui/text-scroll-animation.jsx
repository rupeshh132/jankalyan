"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

  return (
    <motion.span
      className={cn("inline-block text-primary", isSpace && "w-4 md:w-8")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 50, 0]);

  return (
    <motion.img
      src={char}
      alt="Community Member"
      className="h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-full object-cover shadow-xl border-4 border-white will-change-transform"
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  );
};

const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 90, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [-Math.abs(distanceFromCenter) * 20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.img
      src={char}
      alt="Community Member"
      className="h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-full object-cover shadow-xl border-4 border-white will-change-transform"
      style={{ x, rotate, y, scale, transformOrigin: "center" }}
    />
  );
};

const Bracket = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className}>
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      />
    </svg>
  );
};

export const ScrollShowcase = () => {
  const targetRef = useRef(null);
  const targetRef2 = useRef(null);
  const targetRef3 = useRef(null);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: targetRef2 });
  const { scrollYProgress: scrollYProgress3 } = useScroll({ target: targetRef3 });
  
  const text = "empower your city";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);
  
  const issueImages = [
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80", // Pothole/texture
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15f?auto=format&fit=crop&w=300&q=80", // Trash/Waste
    "https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&w=300&q=80", // Broken infrastructure
    "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=300&q=80", // Pipes/Water
    "https://images.unsplash.com/photo-1473655551229-da395bd7e7bd?auto=format&fit=crop&w=300&q=80", // Urban gritty street
    "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=300&q=80"  // Congestion
  ];
  
  const resolutionImages = [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=300&q=80", // Clean city
    "https://images.unsplash.com/photo-1504307651254-35680f35aa27?auto=format&fit=crop&w=300&q=80", // Construction worker/fixing
    "https://images.unsplash.com/photo-1593113580332-628880628e81?auto=format&fit=crop&w=300&q=80", // Volunteers cleaning
    "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=300&q=80", // Park / Greenery
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=80", // Bright streetlights
    "https://images.unsplash.com/photo-1461280360983-bd93eaa5051b?auto=format&fit=crop&w=300&q=80"  // Happy citizens
  ];

  const iconCenterIndex = Math.floor(issueImages.length / 2);

  return (
    <ReactLenis root>
      <section className="w-full bg-background relative z-20 overflow-hidden">
        {/* Helper text */}
        <div className="top-22 absolute left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-foreground mt-12">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-background after:to-foreground after:content-['']">
            Scroll to see more
          </span>
        </div>

        {/* Block 1 - Animated Text */}
        <div
          ref={targetRef}
          className="relative box-border flex h-[210vh] items-center justify-center gap-[2vw] bg-background p-[2vw]"
        >
          <div
            className="w-full max-w-5xl text-center text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-foreground leading-tight"
            style={{ perspective: "500px" }}
          >
            {characters.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Block 2 - Animated Icons V2 */}
        <div
          ref={targetRef2}
          className="relative -mt-[70vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] bg-background p-[2vw] z-10"
        >
          <p className="flex items-center justify-center gap-3 text-2xl md:text-4xl font-medium tracking-tight text-foreground px-4 text-center">
            <Bracket className="h-8 md:h-12 text-primary" />
            <span className="font-medium text-center">report urban issues.</span>
            <Bracket className="h-8 md:h-12 scale-x-[-1] text-primary" />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-12">
            {issueImages.map((icon, index) => (
              <CharacterV2
                key={index}
                char={icon}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress2}
              />
            ))}
          </div>
        </div>

        {/* Block 3 - Animated Icons V3 */}
        <div
          ref={targetRef3}
          className="relative -mt-[70vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] bg-background p-[2vw] z-20"
        >
          <p className="flex items-center justify-center gap-3 text-2xl md:text-4xl font-medium tracking-tight text-foreground px-4 text-center">
            <Bracket className="h-8 md:h-12 text-primary" />
            <span className="font-medium text-center">track community progress.</span>
            <Bracket className="h-8 md:h-12 scale-x-[-1] text-primary" />
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-12" style={{ perspective: "500px" }}>
            {resolutionImages.map((icon, index) => (
              <CharacterV3
                key={index}
                char={icon}
                index={index}
                centerIndex={iconCenterIndex}
                scrollYProgress={scrollYProgress3}
              />
            ))}
          </div>
        </div>
      </section>
    </ReactLenis>
  );
};
