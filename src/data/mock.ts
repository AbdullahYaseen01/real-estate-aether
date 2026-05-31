import { IMAGES } from './images'

export interface Colorway {
  id: string
  name: string
  upper: string
  accent: string
  bg: string
}

export interface HeroProduct {
  name: string
  subtitle: string
  price: number
}


export const HERO_PRODUCT: HeroProduct = {
  name: 'Velocity Pro',
  subtitle: 'Drop 01 — Hyper Strike',
  price: 220,
}

export interface DropProduct {
  id: string
  name: string
  price: number
  image: string
  tag: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
}

export interface StatItem {
  id: string
  label: string
  value: number
  suffix: string
  decimals?: number
}

export interface ExplodedPart {
  id: string
  label: string
  description: string
}

export const COLORWAYS: Colorway[] = [
  {
    id: 'volt',
    name: 'Volt Strike',
    upper: '#f4f4f0',
    accent: '#ceff00',
    bg: '#0d0d0d',
  },
  {
    id: 'ember',
    name: 'Ember Flux',
    upper: '#1a1a1a',
    accent: '#ff4d00',
    bg: '#0a0806',
  },
  {
    id: 'azure',
    name: 'Azure Pulse',
    upper: '#e8eef5',
    accent: '#0066ff',
    bg: '#060810',
  },
  {
    id: 'ghost',
    name: 'Ghost Protocol',
    upper: '#888880',
    accent: '#ffffff',
    bg: '#111111',
  },
]

export const DROPS: DropProduct[] = [
  {
    id: '1',
    name: 'Velocity Pro',
    price: 220,
    tag: 'New',
    image: IMAGES.drop1,
  },
  {
    id: '2',
    name: 'Neon Apex',
    price: 185,
    tag: 'Limited',
    image: IMAGES.drop2,
  },
  {
    id: '3',
    name: 'Nova Glide',
    price: 195,
    tag: 'Drop 02',
    image: IMAGES.drop3,
  },
  {
    id: '4',
    name: 'Stealth Core',
    price: 210,
    tag: 'Exclusive',
    image: IMAGES.drop4,
  },
]

export const STATS: StatItem[] = [
  { id: 'sold', label: 'Pairs Sold', value: 48200, suffix: '+' },
  { id: 'drops', label: 'Exclusive Drops', value: 24, suffix: '' },
  { id: 'cities', label: 'Cities Worldwide', value: 38, suffix: '' },
  { id: 'rating', label: 'Average Rating', value: 4.9, suffix: '/5', decimals: 1 },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'The most responsive silhouette we have tested this year. A masterclass in motion design.',
    author: 'Sneaker Chronicle',
    role: 'Editorial',
  },
  {
    id: '2',
    quote:
      'VELOCITY redefines what a drop campaign can feel like online. Pure kinetic energy.',
    author: 'Design Weekly',
    role: 'Press',
  },
  {
    id: '3',
    quote:
      'Lightweight, bold, and impossible to ignore. This is the future of athletic design.',
    author: 'Maya Chen',
    role: 'Pro Athlete',
  },
  {
    id: '4',
    quote:
      'Every detail feels intentional — from the knit upper to the energy-return midsole.',
    author: 'Kicks Lab',
    role: 'Review',
  },
]

export const PRESS_LOGOS = [
  'HYPEBEAST',
  'COMPLEX',
  'VOGUE',
  'WIRED',
  'GQ',
  'HIGHSNOB',
]

export const EXPLODED_PARTS: ExplodedPart[] = [
  {
    id: 'upper',
    label: 'Knit Upper',
    description: 'Breathable engineered mesh with adaptive lockdown',
  },
  {
    id: 'midsole',
    label: 'React Cushion',
    description: 'Dual-density foam for 87% energy return',
  },
  {
    id: 'outsole',
    label: 'Grip Outsole',
    description: 'Multi-directional traction pattern',
  },
  {
    id: 'swoosh',
    label: 'Support Frame',
    description: 'Torsion plate for lateral stability',
  },
]

export const MARQUEE_ITEMS = [
  'ENGINEERED',
  'LIGHTWEIGHT',
  'LIMITED',
  'DROP 01',
  'VELOCITY',
  'PREMIUM',
]

export const SPECS = [
  { label: 'Weight', value: 248, suffix: 'g', unit: '' },
  { label: 'Drop', value: 8, suffix: 'mm', unit: '' },
  { label: 'Energy Return', value: 87, suffix: '%', unit: '' },
]
