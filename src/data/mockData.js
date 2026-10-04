// Initial data definitions - All mock data removed as requested by admin

export const INITIAL_PRODUCTS = [];

export const INITIAL_ORDERS = [];

export const INITIAL_CUSTOMERS = [];

// Helpful baseline skincare categories for product categorization
export const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: 'Cleanser',
    productsCount: 0,
    icon: '🧴',
    description: 'Gentle and foaming facial cleansers'
  },
  {
    id: 2,
    name: 'Toner',
    productsCount: 0,
    icon: '💧',
    description: 'Balancing and hydrating facial toners'
  },
  {
    id: 3,
    name: 'Serum',
    productsCount: 0,
    icon: '🧪',
    description: 'Targeted actives, Vitamin C, Niacinamide'
  },
  {
    id: 4,
    name: 'Moisturizer',
    productsCount: 0,
    icon: '🥣',
    description: 'Nourishing barrier creams and lightweight gels'
  },
  {
    id: 5,
    name: 'Sunscreen',
    productsCount: 0,
    icon: '☀️',
    description: 'Broad spectrum SPF 30 & SPF 50 shields'
  },
  {
    id: 6,
    name: 'Treatment',
    productsCount: 0,
    icon: '✨',
    description: 'Chemical peels, acne patches and retinoids'
  }
];

export const INITIAL_INVENTORY = [];

export const SALES_CHART_DATA = [
  { date: 'Sep 1', value: 0, label: '₹0' },
  { date: 'Sep 8', value: 0, label: '₹0' },
  { date: 'Sep 15', value: 0, label: '₹0' },
  { date: 'Sep 22', value: 0, label: '₹0' },
  { date: 'Sep 30', value: 0, label: '₹0' }
];

export const NOTIFICATIONS_DATA = [
  { 
    id: 1, 
    title: 'GlowV Admin Initialized', 
    desc: 'System ready. Admin account active (glowv.admin123@gmail.com).', 
    time: 'Just now', 
    unread: true 
  }
];
