'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface AdminContextValue {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
  clearSelection: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), [])
  const clearSelection = useCallback(() => setSelectedItems([]), [])

  return (
    <AdminContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        selectedItems,
        setSelectedItems,
        clearSelection,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
