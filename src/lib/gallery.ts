export type GalleryCategory = 'dining' | 'ushering' | 'branding' | 'workshop'

export interface GalleryItem {
  id: string
  src: string
  caption: string
  category: GalleryCategory
  videoId?: string
}

export const GALLERY_CATEGORIES: { key: GalleryCategory; label: string }[] = [
  { key: 'workshop', label: 'Workshop' },
  { key: 'dining', label: 'Dining' },
  { key: 'ushering', label: 'Ushering' },
  { key: 'branding', label: 'Branding' },
]

// Built-in default images. Editing/uploading lives in `gallery-store.ts`.
export const SEED_GALLERY: GalleryItem[] = [
  { id: 'g1', src: 'https://img.youtube.com/vi/ZbAuKkY-3IU/hqdefault.jpg', caption: 'Teens Dining Session', category: 'dining', videoId: 'ZbAuKkY-3IU' },
  { id: 'g2', src: '/gallery/dining-1.jpg', caption: "Women's Dining Etiquette Training", category: 'dining' },
  { id: 'g3', src: 'https://img.youtube.com/vi/Me0bTzPIxLk/hqdefault.jpg', caption: 'Ushering Duty', category: 'ushering', videoId: 'Me0bTzPIxLk' },
  { id: 'g4', src: '/gallery/ushering-1.jpg', caption: 'Refined Ushers — Birthday Celebration', category: 'ushering' },
  { id: 'g5', src: '/gallery/ushering-2.jpg', caption: 'Isoken Book Launch Ushers', category: 'ushering' },
  { id: 'g6', src: '/gallery/ushering-3.jpg', caption: 'Cultural Reception Ushers', category: 'ushering' },
  { id: 'g7', src: '/gallery/ushering-4.jpg', caption: 'Isoken Book Launch', category: 'ushering' },
  { id: 'g8', src: '/chinenye.jpg', caption: 'Image Consulting', category: 'branding' },
  { id: 'g9', src: '/gallery/branding-1.jpg', caption: 'Signature Style', category: 'branding' },
  { id: 'g10', src: '/gallery/branding-2.jpg', caption: 'Poise & Presence', category: 'branding' },
  { id: 'g11', src: '/gallery/branding-3.jpg', caption: 'Colour & Confidence', category: 'branding' },
  { id: 'g12', src: '/gallery/branding-4.jpg', caption: 'Radiant & Refined', category: 'branding' },
  { id: 'g13', src: '/gallery/workshop-1.jpg', caption: 'Teen Etiquette Workshop', category: 'workshop' },
  { id: 'g14', src: '/gallery/workshop-2.jpg', caption: 'Engaged Learners', category: 'workshop' },
  { id: 'g15', src: '/gallery/workshop-3.jpg', caption: 'Registration & Onboarding', category: 'workshop' },
  { id: 'g16', src: '/gallery/workshop-4.jpg', caption: 'Finishing School Session', category: 'workshop' },
  { id: 'g17', src: '/gallery/workshop-5.jpg', caption: 'Interactive Training', category: 'workshop' },
  { id: 'g18', src: '/gallery/workshop-6.jpg', caption: 'Etiquette & Poise Class', category: 'workshop' },
  { id: 'g19', src: '/gallery/workshop-7.jpg', caption: 'Personal Refining Workshop', category: 'workshop' },
  { id: 'g20', src: '/gallery/workshop-8.jpg', caption: 'Guest Speaking Engagement', category: 'workshop' },
]
