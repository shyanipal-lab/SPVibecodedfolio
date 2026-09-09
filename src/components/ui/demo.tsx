import React, { useState, useRef } from "react";
import {
  Palette,
  Film,
  Compass,
  Play,
  Sparkles,
  X,
  UploadCloud,
} from "lucide-react";
import Lottie from "lottie-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

import illustrationAsset1 from "@/assets/images/regenerated_image_1779998255814.png";
import illustrationAsset2 from "@/assets/images/regenerated_image_1779998441461.png";
import illustrationAsset3 from "@/assets/images/regenerated_image_1780031428336.png";
import flow10Lottie from "@/assets/lottie/flow10.json";

function sanitizeLottieData(raw: any) {
  if (!raw) return null;
  const data = raw.default || raw;
  return {
    v: "5.7.0",
    fr: 30,
    ip: 0,
    op: 80,
    w: 400,
    h: 300,
    assets: [],
    layers: [],
    ...data
  };
}

export type MediaItem = 
  | { type: "image" | "video"; src: string }
  | { type: "lottie"; data: object };

interface InteractiveBackgroundProps {
  placeholderType: "illustration" | "animation" | "storyboard" | "motion" | "vfx";
  title: string;
  expectedFormat: string;
  initialItems?: MediaItem[];
  initialSrcs?: string[];
  initialLottieData?: object;
}

function InteractiveBackground({ 
  placeholderType, 
  title, 
  expectedFormat,
  initialItems,
  initialSrcs,
  initialLottieData
}: InteractiveBackgroundProps) {
  const getCombinedInitialItems = (): MediaItem[] => {
    if (initialItems && initialItems.length > 0) return initialItems;
    const items: MediaItem[] = [];
    if (initialLottieData) {
      items.push({ type: "lottie", data: initialLottieData });
    }
    if (initialSrcs) {
      initialSrcs.forEach((src) => items.push({ type: "image", src }));
    }
    return items;
  };

  const [gallery, setGallery] = useState<MediaItem[]>(getCombinedInitialItems());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    
    if (file.name.endsWith(".json") || file.type.includes("json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setGallery((prev) => [{ type: "lottie", data: json }, ...prev]);
          setCurrentIndex(0);
        } catch {
          alert("Invalid Lottie JSON file.");
        }
      };
      reader.readAsText(file);
    } else if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setGallery((prev) => [{ type: "image", src: url }, ...prev]);
      setCurrentIndex(0);
    } else if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setGallery((prev) => [{ type: "video", src: url }, ...prev]);
      setCurrentIndex(0);
    } else {
      alert("Please upload an image, video, or Lottie JSON file.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearCurrentMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gallery.length <= 1) {
      setGallery([]);
      setCurrentIndex(0);
    } else {
      const updated = gallery.filter((_, idx) => idx !== currentIndex);
      setGallery(updated);
      setCurrentIndex((prev) => (prev >= updated.length ? updated.length - 1 : prev));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentItem = gallery[currentIndex] || null;

  const getPlaceholderIcon = () => {
    switch (placeholderType) {
      case "illustration":
        return <Palette className="w-8 h-8 text-zinc-400 group-hover:text-brand-primary transition-colors duration-300" />;
      case "animation":
        return <Film className="w-8 h-8 text-zinc-400 group-hover:text-brand-primary transition-colors duration-300" />;
      case "storyboard":
        return <Compass className="w-8 h-8 text-zinc-400 group-hover:text-brand-primary transition-colors duration-300" />;
      case "motion":
        return <Play className="w-8 h-8 text-zinc-400 group-hover:text-brand-primary transition-colors duration-300" />;
      case "vfx":
        return <Sparkles className="w-8 h-8 text-zinc-400 group-hover:text-brand-primary transition-colors duration-300" />;
    }
  };

  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center border-b border-zinc-150/60 dark:border-zinc-850/50 ${
        isDragActive 
          ? "bg-brand-primary/10 border-2 border-dashed border-brand-primary/60 scale-[0.98] rounded-xl z-20" 
          : "bg-zinc-50 dark:bg-zinc-950/40 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/30"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*,video/*,.json" 
        className="hidden" 
        onChange={handleFileInputChange}
      />

      {currentItem ? (
        <div className="absolute inset-0 w-full h-full group/media overflow-hidden">
          {currentItem.type === "lottie" ? (
            <div className="w-full h-full flex items-center justify-center bg-[#0b132b] p-4 overflow-hidden">
              <div className="w-full h-full max-w-full max-h-[280px] flex items-center justify-center">
                <Lottie 
                  animationData={sanitizeLottieData(currentItem.data)} 
                  loop={true} 
                  autoplay={true} 
                  style={{ width: '100%', height: '100%', maxHeight: '280px' }}
                />
              </div>
            </div>
          ) : currentItem.type === "image" ? (
            <img 
              src={currentItem.src} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <video 
              src={currentItem.src} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          )}
          
          {/* Top Left Media Type Tag */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/10 shadow-sm">
              {currentItem.type === "lottie" ? "Lottie Animation" : currentItem.type === "image" ? "Artwork" : "Video"}
            </span>
          </div>

          {/* Subtle Dark Vignette Overlay on Hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
            <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto hover:bg-black/80 transition-colors">
              Click or drag to add
            </span>
          </div>

          {/* Dots/Switcher if multiple items */}
          {gallery.length > 1 && (
            <div 
              className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? "bg-white w-5" : "bg-white/40 hover:bg-white/70 w-2"
                  }`}
                  title={`View ${item.type === "lottie" ? "Lottie" : "Media"} ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={clearCurrentMedia}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-red-500/90 hover:bg-red-600 text-white shadow-md transition-all duration-200 transform scale-90 group-hover/media:scale-100 pointer-events-auto"
            title="Clear item"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="text-center p-6 select-none pointer-events-none flex flex-col items-center gap-3 max-w-[280px]">
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            {getPlaceholderIcon()}
          </div>
        </div>
      )}
    </div>
  );
}

const features = [
  {
    Icon: Palette,
    name: "Character Design & Illustration",
    description: "Original character development, keyframes, and rich digital painting with a focus on distinct visual styling and emotive storytelling.",
    href: "#",
    cta: "View Gallery",
    background: (
      <InteractiveBackground 
        placeholderType="illustration" 
        title="ILLUSTRATION FRAME" 
        expectedFormat="Lottie JSON, PNG, JPG or GIF" 
        initialItems={[
          { type: "lottie", data: flow10Lottie },
          { type: "image", src: illustrationAsset1 },
          { type: "image", src: illustrationAsset2 },
          { type: "image", src: illustrationAsset3 },
        ]}
      />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Film,
    name: "2D & Frame-by-Frame Animation",
    description: "Fluid hand-drawn and digital frame animations, loops, and micro-interactions with custom timing curves and dynamic motion paths.",
    href: "#",
    cta: "Watch Animatic",
    background: (
      <InteractiveBackground 
        placeholderType="animation" 
        title="ANIMATION FRAME" 
        expectedFormat="Lottie JSON, MP4, WEBM or GIF" 
        initialItems={[
          { type: "lottie", data: flow10Lottie },
          { type: "image", src: illustrationAsset2 },
        ]}
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Compass,
    name: "Storyboard & Concept Art",
    description: "Visual scripting, layout sketching, and worldbuilding concepts mapped from raw script ideas into actionable screen direction.",
    href: "#",
    cta: "View Storyboards",
    background: (
      <InteractiveBackground 
        placeholderType="storyboard" 
        title="STORYBOARD FRAME" 
        expectedFormat="Lottie JSON, PNG, JPG or PDF Sketch" 
        initialItems={[
          { type: "lottie", data: flow10Lottie },
          { type: "image", src: illustrationAsset3 },
        ]}
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Play,
    name: "Motion Design & Loops",
    description: "Sleek SVG animations, vector physics, and modern UI transition choreographies.",
    href: "#",
    cta: "Watch Loop",
    background: (
      <InteractiveBackground 
        placeholderType="motion" 
        title="MOTION GRAPHICS FRAME" 
        expectedFormat="Lottie JSON, SVG, MP4 or WEBM" 
        initialItems={[
          { type: "lottie", data: flow10Lottie },
        ]}
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Sparkles,
    name: "Experimental VFX & Assets",
    description: "Abstract particles, custom shader overlays, and generative visuals pushing the boundaries of digital canvases.",
    href: "#",
    cta: "Explore Assets",
    background: (
      <InteractiveBackground 
        placeholderType="vfx" 
        title="VFX & ASSETS FRAME" 
        expectedFormat="Lottie JSON, PNG, MP4 or Interactive" 
        initialItems={[
          { type: "lottie", data: flow10Lottie },
          { type: "image", src: illustrationAsset1 },
        ]}
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard 
          key={feature.name} 
          name={feature.name}
          className={feature.className}
          background={feature.background}
          Icon={feature.Icon}
          description={feature.description}
          href={feature.href}
          cta={feature.cta}
        />
      ))}
    </BentoGrid>
  );
}

import VideoPlayer from "@/components/ui/video-player";
import { SocialIcons } from "@/components/ui/social-icons";

const VideoPlayerDemo = () => {
  return <VideoPlayer src="https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4" />;
};

export function SocialIconsDemo() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 w-full">
      <div className="flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Connect with me</h1>
          <p className="text-sm text-neutral-400">Hover over the icons below</p>
        </div>

        <SocialIcons />
      </div>
    </main>
  );
}

export { BentoDemo, VideoPlayerDemo };
export default SocialIconsDemo;


