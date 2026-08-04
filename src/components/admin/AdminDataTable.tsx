'use client'

import React, { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColumnDef<T> {
  key: string
  header: string
  sortable?: boolean
  className?: string
  /** returns value used for sorting */
  sortValue?: (row: T) => string | number
  render: (row: T) => React.ReactNode
}

export interface BulkAction {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger'
  onClick: (selectedIds: string[]) => void
}

interface AdminDataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  getRowId: (row: T) => string
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  searchFn?: (row: T, query: string) => boolean
  selectable?: boolean
  bulkActions?: BulkAction[]
  onRowClick?: (row: T) => void
  emptyState?: React.ReactNode
  pageSize?: number
  toolbar?: React.ReactNode
}

export function AdminDataTable<T>({
  data,
  columns,
  getRowId,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  searchFn,
  selectable = false,
  bulkActions = [],
  onRowClick,
  emptyState,
  pageSize = 10,
  toolbar,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let rows = data
    if (query && searchFn) {
      rows = rows.filter((r) => searchFn(r, query.toLowerCase()))
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey)
      if (col?.sortValue) {
        const sv = col.sortValue
        rows = [...rows].sort((a, b) => {
          const av = sv(a)
          const bv = sv(b)
          const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
          return sortDir === 'asc' ? cmp : -cmp
        })
      }
    }
    return rows
  }, [data, query, searchFn, sortKey, sortDir, columns])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)
  const pageRowIds = pageRows.map(getRowId)
  const allPageSelected = pageRowIds.length > 0 && pageRowIds.every((id) => selected.has(id))

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allPageSelected) pageRowIds.forEach((id) => next.delete(id))
      else pageRowIds.forEach((id) => next.add(id))
      return next
    })
  }

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedIds = Array.from(selected)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Toolbar */}
      {(searchable || toolbar || (selectable && selectedIds.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-3">
          {searchable && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(0)
                }}
                placeholder={searchPlaceholder}
                className="h-9 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}
          {toolbar}
          {selectable && selectedIds.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">{selectedIds.length} selected</span>
              {bulkActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      action.onClick(selectedIds)
                      setSelected(new Set())
                    }}
                    className={cn(
                      'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium',
                      action.variant === 'danger'
                        ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {action.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={cn('px-4 py-3 font-medium', col.className)}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-gray-900"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 text-gray-300" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-4 py-3.5">
                      <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-16 text-center">
                  {emptyState ?? (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Inbox className="h-8 w-8 text-gray-300" />
                      <p className="text-sm font-medium">
                        {query ? 'No results match your search' : 'No records found'}
                      </p>
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const id = getRowId(row)
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-gray-50',
                      selected.has(id) && 'bg-blue-50/50'
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(id)}
                          onChange={() => toggleRow(id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select row ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3.5', col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
          <span>
            Showing {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page {safePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="rounded-md p-1.5 hover:bg-gray-100 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
