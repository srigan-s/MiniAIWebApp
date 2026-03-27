import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  shellClassName: string;
  glowClassName: string;
  accentClassName: string;
  trimClassName: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'mini',
    name: 'Mini',
    title: 'The Brain Bot',
    tagline: 'Bright green guide with a glowing brain core.',
    description: 'Mini is a cheerful emerald robot with a transparent brain dome, built to lead curious explorers into the world of AI.',
    shellClassName: 'from-emerald-300 via-emerald-400 to-green-600',
    glowClassName: 'shadow-[0_22px_50px_rgba(16,185,129,0.35)]',
    accentClassName: 'bg-emerald-100',
    trimClassName: 'from-lime-200 to-emerald-100',
  },
  {
    id: 'astro',
    name: 'Astro',
    title: 'The Cosmic Dreamer',
    tagline: 'Purple robot with a magical unicorn touch.',
    description: 'Astro glides in with a shimmering violet finish, tiny galaxy lights, and a unicorn friend charm for extra imagination.',
    shellClassName: 'from-violet-300 via-fuchsia-400 to-purple-700',
    glowClassName: 'shadow-[0_22px_50px_rgba(147,51,234,0.35)]',
    accentClassName: 'bg-violet-100',
    trimClassName: 'from-pink-200 to-violet-100',
  },
  {
    id: 'oldie',
    name: 'Oldie',
    title: 'The Wise Builder',
    tagline: 'Classic robot elder with a polished cane.',
    description: 'Oldie is a silver-and-bronze mentor bot with a vintage faceplate, kind eyes, and a trusty cane from years of invention.',
    shellClassName: 'from-stone-200 via-slate-300 to-amber-700',
    glowClassName: 'shadow-[0_22px_50px_rgba(120,113,108,0.28)]',
    accentClassName: 'bg-stone-100',
    trimClassName: 'from-amber-100 to-stone-100',
  },
  {
    id: 'tiny',
    name: 'Tiny',
    title: 'The Little Explorer',
    tagline: 'Baby robot rolling around with a stroller.',
    description: 'Tiny is a playful sky-blue baby bot with oversized eyes, tiny wheels, and a mini stroller packed with future ideas.',
    shellClassName: 'from-sky-200 via-cyan-300 to-blue-500',
    glowClassName: 'shadow-[0_22px_50px_rgba(14,165,233,0.32)]',
    accentClassName: 'bg-sky-100',
    trimClassName: 'from-cyan-100 to-sky-100',
  },
  {
    id: 'swifty',
    name: 'Swifty',
    title: 'The Stylish Navigator',
    tagline: 'Elegant robot with a smart purse and quick ideas.',
    description: 'Swifty is a confident rose-gold robot with sleek lines, quick-thinking circuits, and a polished purse full of clever tools.',
    shellClassName: 'from-rose-200 via-pink-300 to-rose-600',
    glowClassName: 'shadow-[0_22px_50px_rgba(244,114,182,0.32)]',
    accentClassName: 'bg-rose-100',
    trimClassName: 'from-amber-100 to-rose-100',
  },
];

export const getAvatarOptionById = (avatarId?: string) =>
  AVATAR_OPTIONS.find((option) => option.id === avatarId) ?? AVATAR_OPTIONS[0];

interface RobotAvatarProps {
  avatarId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    frame: 'h-14 w-14',
    head: 'h-8 w-8',
    body: 'h-7 w-10',
    eye: 'h-1.5 w-1.5',
    accessory: 'text-[10px]',
  },
  md: {
    frame: 'h-20 w-20',
    head: 'h-11 w-11',
    body: 'h-9 w-14',
    eye: 'h-2 w-2',
    accessory: 'text-xs',
  },
  lg: {
    frame: 'h-24 w-24',
    head: 'h-14 w-14',
    body: 'h-11 w-[4.25rem]',
    eye: 'h-2.5 w-2.5',
    accessory: 'text-sm',
  },
  xl: {
    frame: 'h-28 w-28',
    head: 'h-16 w-16',
    body: 'h-12 w-[4.75rem]',
    eye: 'h-3 w-3',
    accessory: 'text-base',
  },
};

const Accessory: React.FC<{ avatarId: string; textSize: string }> = ({ avatarId, textSize }) => {
  if (avatarId === 'mini') {
    return (
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-white/80 p-1 shadow-md">
        <Brain className="h-4 w-4 text-emerald-600" />
      </div>
    );
  }

  if (avatarId === 'astro') {
    return (
      <>
        <div className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 rounded-tl-full bg-gradient-to-br from-fuchsia-100 to-violet-400 shadow-sm"></div>
        <div className={`absolute -right-1 top-0 ${textSize}`}>🦄</div>
      </>
    );
  }

  if (avatarId === 'oldie') {
    return (
      <div className="absolute -right-2 bottom-2 flex items-end gap-1">
        <div className="h-8 w-1 rounded-full bg-amber-700 shadow-sm"></div>
        <div className="mb-7 h-2 w-2 rounded-full border-2 border-amber-700 border-b-0"></div>
      </div>
    );
  }

  if (avatarId === 'tiny') {
    return (
      <div className="absolute -bottom-1 -right-3 flex items-end gap-1">
        <div className="h-4 w-5 rounded-t-full border-2 border-sky-300 bg-white/80"></div>
        <div className="-ml-4 flex gap-2 pt-4">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute -right-2 bottom-2">
      <div className="h-5 w-5 rounded-md bg-gradient-to-br from-amber-200 to-rose-400 shadow-md"></div>
      <div className="absolute -top-1 left-1 h-2 w-3 rounded-t-full border-2 border-rose-300 border-b-0"></div>
    </div>
  );
};

export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  avatarId,
  size = 'md',
  animated = false,
  className = '',
}) => {
  const option = getAvatarOptionById(avatarId);
  const dimensions = sizeClasses[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions.frame} ${className}`}>
      <div
        className={`absolute inset-0 rounded-[35%] bg-gradient-to-br ${option.shellClassName} ${option.glowClassName} ${animated ? 'animate-float-avatar' : ''}`}
      ></div>
      <div className="absolute inset-[10%] rounded-[32%] bg-white/18"></div>
      <div className="absolute inset-x-[20%] bottom-[12%] h-3 rounded-full bg-black/10 blur-sm"></div>

      <div className="relative flex flex-col items-center justify-center">
        <div className={`relative ${dimensions.head} rounded-[32%] bg-gradient-to-br ${option.shellClassName} border border-white/50`}>
          <div className="absolute inset-[14%] rounded-[28%] bg-gradient-to-br from-white/80 to-white/20"></div>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2">
            <span className={`${dimensions.eye} rounded-full bg-slate-800 shadow-[0_0_12px_rgba(255,255,255,0.45)]`}></span>
            <span className={`${dimensions.eye} rounded-full bg-slate-800 shadow-[0_0_12px_rgba(255,255,255,0.45)]`}></span>
          </div>
          <div className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full bg-white/50"></div>
          <Accessory avatarId={option.id} textSize={dimensions.accessory} />
        </div>

        <div className={`relative -mt-1 ${dimensions.body} rounded-[28%] bg-gradient-to-br ${option.trimClassName} border border-white/70`}>
          <div className="absolute inset-[14%] rounded-[24%] bg-white/45"></div>
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-inner"></div>
          <div className="absolute -left-3 top-2 h-1.5 w-3 rounded-full bg-white/70"></div>
          <div className="absolute -right-3 top-2 h-1.5 w-3 rounded-full bg-white/70"></div>
          <div className="absolute -bottom-2 left-2 h-3 w-1 rounded-full bg-slate-400"></div>
          <div className="absolute -bottom-2 right-2 h-3 w-1 rounded-full bg-slate-400"></div>
        </div>
      </div>

      {option.id === 'astro' && (
        <Sparkles className="absolute -left-1 top-2 h-4 w-4 text-violet-100 drop-shadow" />
      )}
    </div>
  );
};
