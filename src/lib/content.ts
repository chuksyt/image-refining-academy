// Editable marketing copy for the Home and About pages. Rendered as plain text.
export interface HomeStat {
  n: number
  suffix: string
  label: string
}

export interface AboutValue {
  icon: string
  title: string
  desc: string
}

export interface Milestone {
  year: string
  title: string
  desc: string
}

export interface SiteContent {
  home: {
    heroBadge: string
    heroTitleLine1: string
    heroTitleLine2: string // highlighted second line
    heroSubtitle: string
    stats: HomeStat[]
    impactStats: HomeStat[]
  }
  about: {
    heroTitle: string
    heroSubtitle: string
    storyHeading: string
    storyParagraphs: string[]
    values: AboutValue[]
    milestones: Milestone[]
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
    impactStats: [
      { n: 500, suffix: '+', label: 'Students Trained' },
      { n: 6, suffix: '+', label: 'Years of Excellence' },
      { n: 6, suffix: '', label: 'Signature Courses' },
      { n: 90, suffix: '%', label: 'Student Satisfaction' },
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
    values: [
      { icon: '💎', title: 'Excellence', desc: 'We hold ourselves to the highest standards in everything we teach and how we operate.' },
      { icon: '🤝', title: 'Integrity', desc: 'Honesty, authenticity, and ethical conduct are at the core of all our programmes.' },
      { icon: '🌱', title: 'Growth', desc: 'We believe every individual has the capacity to grow, refine, and continually become better.' },
      { icon: '🌍', title: 'Impact', desc: 'Our mission extends beyond the classroom — we aim to shape a more gracious society.' },
    ],
    milestones: [
      { year: '2020', title: 'Image Refining Academy Founded', desc: 'After years in banking and the private sector, Chinenye founded Image Refining Academy to help people move from crude personality to deserving, desirable character — equipping them to seize the opportunities they deserve.' },
      { year: '2022', title: 'Teens Refinement Programme Launched', desc: 'Noticing that many young adults wanted to grow but could not afford full programmes, Chinenye launched a free etiquette and refinement training for teenagers. Over 100 young brands have since been trained at no cost, running every April and September.' },
      { year: '2023', title: 'The Refined Lady (TRL) Launched', desc: 'An online programme created specifically for women who had lost themselves through caregiving, career gaps or the passing of time. TRL helps women above 40 rediscover their identity, rebuild self-esteem and move forward with purpose.' },
      { year: '2023', title: "The Graceful Women's Conference", desc: "Chinenye founded this annual women's conference held every July, bringing together a team dedicated to the physical, emotional and financial empowerment of women — fully sponsored to maximise reach and impact." },
      { year: '2024', title: 'The Insights W/Chinenye', desc: 'Evolved from the beloved Tuesday W/Chinenye series, this weekly free online programme at 5 PM WAT delivers consistent, value-packed training to a growing community of followers and students.' },
      { year: '2025', title: 'Expanding Global Reach', desc: "With certifications from Packway Academy, CICM Canada/US and Alison International, Chinenye continues to grow the Academy's impact across schools, churches, organisations and professionals worldwide." },
    ],
    ctaTitle: 'Ready to Begin Your Journey?',
    ctaText:
      'Join over 1,200 individuals who have transformed their image and elevated their lives with us.',
  },
}
