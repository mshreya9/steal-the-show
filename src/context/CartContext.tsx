import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'sts_bag'

export interface BagItem {
  productId: number
  mode: 'buy' | 'rent'
  size: string
  quantity: number
}

interface CartContextValue {
  items: BagItem[]
  addItem: (item: BagItem) => void
  removeItem: (productId: number, mode: 'buy' | 'rent', size: string) => void
  updateQuantity: (productId: number, mode: 'buy' | 'rent', size: string, quantity: number) => void
  clear: () => void
  count: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as BagItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: BagItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.mode === item.mode && i.size === item.size,
      )
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: number, mode: 'buy' | 'rent', size: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.mode === mode && i.size === size)))
  }

  const updateQuantity = (productId: number, mode: 'buy' | 'rent', size: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.mode === mode && i.size === size
          ? { ...i, quantity: Math.max(1, quantity) }
          : i,
      ),
    )
  }

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
