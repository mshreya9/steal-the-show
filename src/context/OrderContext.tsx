import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'sts_orders'

export interface OrderItem {
  productId: number
  name: string
  mode: 'buy' | 'rent'
  size: string
  quantity: number
  price: number
  rentalPeriod?: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  placedAt: string
}

interface OrderContextValue {
  placeOrder: (userId: string, items: OrderItem[], total: number) => Order
  ordersForUser: (userId: string) => Order[]
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Order[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const placeOrder = (userId: string, items: OrderItem[], total: number) => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId,
      items,
      total,
      placedAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const ordersForUser = (userId: string) => orders.filter((o) => o.userId === userId)

  return (
    <OrderContext.Provider value={{ placeOrder, ordersForUser }}>{children}</OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
