export interface Intake {
  courseKey: string
  courseName: string
  date: string
  isoDate: string
  format: string
  duration: string
  spotsTotal: number
  spotsLeft: number
  price: string
  category: 'children' | 'teen' | 'adult' | 'online'
  rolling?: boolean
}

export const INTAKES: Intake[] = [
  {
    courseKey: 'children-etiquette',
    courseName: "Children's Etiquette Programme",
    date: 'July 14, 2026',
    isoDate: '2026-07-14',
    format: 'In-person',
    duration: '8 weeks',
    spotsTotal: 20,
    spotsLeft: 8,
    price: '₦35,000',
    category: 'children',
  },
  {
    courseKey: 'teen-finishing',
    courseName: 'Teen Finishing School',
    date: 'July 21, 2026',
    isoDate: '2026-07-21',
    format: 'In-person',
    duration: '10 weeks',
    spotsTotal: 20,
    spotsLeft: 12,
    price: '₦45,000',
    category: 'teen',
  },
  {
    courseKey: 'corporate-etiquette',
    courseName: 'Corporate Etiquette & Professional Development',
    date: 'August 4, 2026',
    isoDate: '2026-08-04',
    format: 'In-person / Online',
    duration: '6 weeks',
    spotsTotal: 15,
    spotsLeft: 6,
    price: '₦75,000',
    category: 'adult',
  },
  {
    courseKey: 'dining-etiquette',
    courseName: 'Dining Etiquette Masterclass',
    date: 'August 9, 2026',
    isoDate: '2026-08-09',
    format: 'In-person',
    duration: '1 day',
    spotsTotal: 25,
    spotsLeft: 15,
    price: '₦25,000',
    category: 'adult',
  },
  {
    courseKey: 'personal-branding',
    courseName: 'Personal Branding & Image Consulting',
    date: 'August 18, 2026',
    isoDate: '2026-08-18',
    format: 'In-person',
    duration: '8 weeks',
    spotsTotal: 12,
    spotsLeft: 5,
    price: '₦85,000',
    category: 'adult',
  },
  {
    courseKey: 'online-certification',
    courseName: 'Online Certification Programme',
    date: 'Rolling Enrollment',
    isoDate: '',
    format: '100% Online',
    duration: '5 weeks',
    spotsTotal: 999,
    spotsLeft: 999,
    price: '₦60,000',
    category: 'online',
    rolling: true,
  },
]
