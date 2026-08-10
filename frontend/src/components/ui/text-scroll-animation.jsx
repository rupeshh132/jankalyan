"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, Trash2, Droplets, Flame, Hammer, MapPin,
  CheckCircle2, Heart, Users, TreePine, ShieldCheck, Trophy
} from "lucide-react";

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
    <motion.div
      className="h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-full shadow-2xl border-4 border-white will-change-transform flex items-center justify-center text-white"
      style={{ x, scale, y, transformOrigin: "center", background: char.gradient }}
    >
      {char.icon}
    </motion.div>
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
    <motion.div
      className="h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-full shadow-2xl border-4 border-white will-change-transform flex items-center justify-center text-white"
      style={{ x, rotate, y, scale, transformOrigin: "center", background: char.gradient }}
    >
      {char.icon}
    </motion.div>
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
  
  const issueIcons = [
    { icon: <AlertTriangle size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
    { icon: <Trash2 size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
    { icon: <Droplets size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
    { icon: <Flame size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
    { icon: <Hammer size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { icon: <MapPin size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }
  ];
  
  const resolutionIcons = [
    { icon: <CheckCircle2 size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { icon: <Heart size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
    { icon: <Users size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { icon: <TreePine size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
    { icon: <ShieldCheck size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
    { icon: <Trophy size={48} strokeWidth={1.5} />, gradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)" }
  ];

  const iconCenterIndex = Math.floor(issueIcons.length / 2);

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
            {issueIcons.map((item, index) => (
              <CharacterV2
                key={index}
                char={item}
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
            {resolutionIcons.map((item, index) => (
              <CharacterV3
                key={index}
                char={item}
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
