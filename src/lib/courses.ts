export interface Course {
  key: string
  name: string
  tag: string
  category: 'children' | 'teen' | 'adult' | 'online'
  description: string
  features: string[]
  price: number
  priceDisplay: string
  duration: string
  image: string
  popular?: boolean
}

export const COURSES: Course[] = [
  {
    key: 'children-etiquette',
    name: "Children's Etiquette Programme",
    tag: 'Ages 6 – 12',
    category: 'children',
    description: 'A fun, engaging foundation course that builds manners, social confidence, and graceful habits in young children.',
    features: [
      'Table manners & greeting skills',
      'Respect & kindness in action',
      'Digital & social media basics',
      'Certificate of completion',
    ],
    price: 3500000,
    priceDisplay: '₦35,000',
    duration: '8 weeks · In-person',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=75',
  },
  {
    key: 'teen-finishing',
    name: 'Teen Finishing School',
    tag: 'Ages 13 – 17',
    category: 'teen',
    description: 'Equip your teenager with the social intelligence, poise, and presence that will distinguish them in school, interviews, and life.',
    features: [
      'Public speaking & confidence',
      'Formal dining skills',
      'Personal presentation & grooming',
      'Social media & digital etiquette',
    ],
    price: 4500000,
    priceDisplay: '₦45,000',
    duration: '10 weeks · In-person',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=75',
  },
  {
    key: 'corporate-etiquette',
    name: 'Corporate Etiquette & Professional Development',
    tag: 'Adults',
    category: 'adult',
    description: 'Master business protocol, meeting manners, workplace communication, and the executive presence that accelerates careers.',
    features: [
      'Business meeting protocol',
      'Email & written communication',
      'Networking & client hosting',
      'International business protocol',
    ],
    price: 7500000,
    priceDisplay: '₦75,000',
    duration: '6 weeks · In-person / Online',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=75',
  },
  {
    key: 'dining-etiquette',
    name: 'Dining Etiquette Masterclass',
    tag: 'Adults',
    category: 'adult',
    description: 'From table settings to multi-course meals — master the fine art of dining with grace, confidence, and cultural fluency.',
    features: [
      'Formal & informal table settings',
      'Cutlery & napkin usage',
      'International dining customs',
      'Hosting & dining conversation',
    ],
    price: 2500000,
    priceDisplay: '₦25,000',
    duration: '1-day intensive · In-person',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=75',
  },
  {
    key: 'personal-branding',
    name: 'Personal Branding & Image Consulting',
    tag: 'Adults',
    category: 'adult',
    description: 'Build a powerful, authentic personal brand — from wardrobe strategy and grooming to body language and first impressions.',
    features: [
      'Wardrobe styling & colour analysis',
      'Grooming & personal hygiene',
      'Body language & posture',
      'Personal brand strategy',
    ],
    price: 8500000,
    priceDisplay: '₦85,000',
    duration: '8 weeks · In-person',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=700&q=75',
  },
  {
    key: 'online-certification',
    name: 'Online Certification Programme',
    tag: 'Online · All Ages',
    category: 'online',
    description: 'Become a certified etiquette consultant from anywhere in the world. A comprehensive 5-week programme with live sessions and lifetime access.',
    features: [
      'Internationally recognised certificate',
      'Live weekly coaching calls',
      'Lifetime access to course materials',
      'Business launch toolkit included',
    ],
    price: 6000000,
    priceDisplay: '₦60,000',
    duration: '5 weeks · 100% Online',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=75',
    popular: true,
  },
]
