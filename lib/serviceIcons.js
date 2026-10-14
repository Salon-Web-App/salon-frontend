import {
  Crown,
  Sparkles,
  Scissors,
  Palette,
  Hand,
  Heart,
  Eye,
  Droplet,
} from "lucide-react";

const ICON_MAP = {
  crown: Crown,
  sparkles: Sparkles,
  scissors: Scissors,
  palette: Palette,
  hand: Hand,
  heart: Heart,
  eye: Eye,
  droplet: Droplet,
};

export function getServiceIcon(iconName) {
  return ICON_MAP[iconName] || Sparkles;
}
