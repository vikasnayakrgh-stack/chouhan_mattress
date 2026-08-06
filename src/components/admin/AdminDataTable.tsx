'use client'

import React, { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight, Inbox, Download, CheckSquare } from 'lucide-react'
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
  exportFilename?: string
}

export function AdminDataTable<T>({
  data,
  columns,
  getRowId,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Quick search records...',
  searchFn,
  selectable = false,
  bulkActions = [],
  onRowClick,
  emptyState,
  pageSize = 10,
  toolbar,
  exportFilename = 'chouhan-mattress-export.csv',
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

  const handleExportCSV = () => {
    if (!data.length) return
    const headers = columns.map((c) => c.header).join(',')
    const rows = filtered.map((row) =>
      columns.map((c) => {
        const val = c.sortValue ? c.sortValue(row) : getRowId(row)
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', exportFilename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const selectedIds = Array.from(selected)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl text-slate-100">
      {/* Toolbar & Action Bar */}
      {(searchable || toolbar || (selectable && selectedIds.length > 0)) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4 bg-slate-950/60">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(0)
                  }}
                  placeholder={searchPlaceholder}
                  className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium transition-all"
                />
              </div>
            )}
            {toolbar}
          </div>

          <div className="flex items-center gap-2">
            {selectable && selectedIds.length > 0 && (
              <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" />
                  {selectedIds.length} Selected
                </span>
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
                        'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all cursor-pointer',
                        action.variant === 'danger'
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                          : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                      )}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      {action.label}
                    </button>
                  )
                })}
              </div>
            )}

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-400 transition-all cursor-pointer"
              title="Export filtered records to CSV"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 sticky top-0 z-10">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500/40"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={cn('px-4 py-3.5 font-extrabold text-slate-300', col.className)}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {col.header}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-amber-400" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 text-slate-600" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-800" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-16 text-center">
                  {emptyState ?? (
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Inbox className="h-10 w-10 text-slate-600 stroke-[1.5]" />
                      <p className="text-sm font-bold text-slate-300">
                        {query ? 'No matching records found' : 'No entries available'}
                      </p>
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          className="text-xs font-bold text-amber-400 hover:underline mt-1"
                        >
                          Clear search filter
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
                      'transition-colors duration-150',
                      onRowClick && 'cursor-pointer hover:bg-slate-800/60',
                      selected.has(id) && 'bg-amber-500/10'
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(id)}
                          onChange={() => toggleRow(id)}
                          className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500/40 cursor-pointer"
                          aria-label={`Select row ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-4 text-slate-200', col.className)}>
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

      {/* Pagination Bar */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400 bg-slate-950/60">
          <span>
            Showing <strong className="text-slate-200">{safePage * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-200">{Math.min((safePage + 1) * pageSize, filtered.length)}</strong> of{' '}
            <strong className="text-slate-200">{filtered.length}</strong> entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-bold text-slate-300">
              Page {safePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="rounded-lg border border-slate-800 p-1.5 text-slate-400 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-colors cursor-pointer"
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
