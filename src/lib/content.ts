// Editable marketing copy for the Home and About pages. Rendered as plain text.
export interface HomeStat {
  n: number
  suffix: string
  label: string
}

export interface SiteContent {
  home: {
    heroBadge: string
    heroTitleLine1: string
    heroTitleLine2: string // highlighted second line
    heroSubtitle: string
    stats: HomeStat[]
  }
  about: {
    heroTitle: string
    heroSubtitle: string
    storyHeading: string
    storyParagraphs: string[]
    ctaTitle: string
    ctaText: string
  }
}

export const SEED_CONTENT: SiteContent = {
  home: {
    heroBadge: 'Welcome to Image Refining Academy',
    heroTitleLine1: 'Refine Your Image.',
    heroTitleLine2: 'Elevate Your Life.',
    heroSubtitle:
      'World-class etiquette education for children, teens, and adults. We empower you to present your best self — with grace, confidence, and timeless elegance.',
    stats: [
      { n: 500, suffix: '+', label: 'Students Trained' },
      { n: 100, suffix: '+', label: 'Teens Trained Free' },
      { n: 6, suffix: '+', label: 'Years of Impact' },
    ],
  },
  about: {
    heroTitle: 'About Us',
    heroSubtitle:
      'Transforming lives through etiquette, personal development and purposeful refinement since 2020.',
    storyHeading: 'Built on Passion for Polished Excellence',
    storyParagraphs: [
      'Chinenye Juliet Nmerole is a Certified Etiquette and Personal Development Consultant, speaker, trainer and transformational coach passionate about helping people become the best version of themselves.',
      'As the Founder of Image Refining Academy, she has dedicated her work to equipping teenagers, women, young adults, schools, churches, organisations and professionals with the knowledge, character and practical life skills needed to thrive in today’s world without compromising their values.',
      'Her teaching goes beyond knowing the right etiquette. She believes true refinement begins from within — through character, confidence, emotional intelligence, purpose discovery and a relationship with God. Her training combines timeless etiquette principles with practical personal development, leadership, communication, digital citizenship, financial literacy and future-ready skills.',
      'She is especially passionate about raising a generation of teenagers who are confident, responsible and purpose-driven, while empowering women to rediscover their identity, build healthy self-esteem and lead with elegance and influence.',
    ],
    ctaTitle: 'Ready to Begin Your Journey?',
    ctaText:
      'Join over 1,200 individuals who have transformed their image and elevated their lives with us.',
  },
}
