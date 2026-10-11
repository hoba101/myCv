import {
  Asterisk,
  Blocks,
  Box,
  Braces,
  Code2,
  Cloud,
  Compass,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Globe,
  Hash,
  Heart,
  Layers,
  Layout,
  Lightbulb,
  Palette,
  Paintbrush,
  PenTool,
  Rocket,
  Server,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ACCENT_KEYS, type AccentKey } from "./types";

export const ICON_CHOICES: Record<string, LucideIcon> = {
  star: Star,
  hash: Hash,
  heart: Heart,
  asterisk: Asterisk,
  code: Code2,
  zap: Zap,
  terminal: Terminal,
  layout: Layout,
  paintbrush: Paintbrush,
  palette: Palette,
  database: Database,
  sparkles: Sparkles,
  pen: PenTool,
  wrench: Wrench,
  rocket: Rocket,
  cpu: Cpu,
  cloud: Cloud,
  branch: GitBranch,
  blocks: Blocks,
  layers: Layers,
  bulb: Lightbulb,
  compass: Compass,
  gauge: Gauge,
  globe: Globe,
  server: Server,
  phone: Smartphone,
  box: Box,
  braces: Braces,
};

export const ICON_OPTIONS = Object.keys(ICON_CHOICES);

export function getIcon(name: string): LucideIcon {
  return ICON_CHOICES[name] ?? Sparkles;
}

export const ACCENT_CLASSES: Record<AccentKey, string> = {
  highlight: "bg-accent-highlight",
  pink: "bg-accent-pink",
  blue: "bg-accent-blue",
  green: "bg-accent-green",
};

export const ACCENT_OPTIONS = ACCENT_KEYS;

export const ACCENT_SWATCH: Record<AccentKey, string> = {
  highlight: "bg-accent-highlight",
  pink: "bg-accent-pink",
  blue: "bg-accent-blue",
  green: "bg-accent-green",
};