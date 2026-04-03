import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('mayra-cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('mayra-cart', JSON.stringify(items))
    } catch {
      // ignore write errors
    }
  }, [items])

  const addItem = (product, quantity = 1) => {
    const safeQty = Number.isNaN(Number(quantity)) ? 1 : Math.max(1, quantity)
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + safeQty }
            : item,
        )
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price ?? 0,
          image_url: product.image_url ?? null,
          category: product.category ?? null,
          sku: product.sku ?? null,
          quantity: safeQty,
        },
      ]
    })
  }

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}

