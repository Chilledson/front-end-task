// The Emberforge product catalogue. Static, loaded synchronously.
// The basket comes from GET /api/basket and discount codes are validated by
// POST /api/discounts/validate (see README); neither is stored here.

export interface Product {
  id: string
  name: string
  unitPrice: number
  maxQuantity: number
  image: string
}

export const products: Product[] = [
  {
    id: 'legend-rank',
    name: 'Legend Rank',
    unitPrice: 24.99,
    maxQuantity: 1,
    image: 'legend-rank.jpg',
  },
  {
    id: 'mystery-crate',
    name: 'Mystery Crate',
    unitPrice: 4.99,
    maxQuantity: 10,
    image: 'mystery-crate.jpg',
  },
  {
    id: 'crate-keys',
    name: 'Crate Key Bundle',
    unitPrice: 13.35,
    maxQuantity: 5,
    image: 'crate-keys.jpg',
  },
]
