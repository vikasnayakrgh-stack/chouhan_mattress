'use client'

import React, { useEffect, useState } from 'react'
import { Layers, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader, AdminDataTable, AdminStatusBadge, AdminEmptyState } from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { catalogService } from '@/services/catalogService'
import type { Collection } from '@/features/catalog/types'

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void catalogService.getCollections().then((cols) => {
      setCollections(cols)
      setLoading(false)
    })
  }, [])

  const columns: ColumnDef<Collection>[] = [
    {
      key: 'name',
      header: 'Collection',
      sortable: true,
      sortValue: (c) => c.name,
      render: (c) => (
        <div>
          <p className="font-medium text-gray-900">{c.name}</p>
          <p className="text-xs text-gray-500">/{c.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (c) => <span className="text-gray-600">{c.description}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (c) => (
        <AdminStatusBadge
          status={c.isAutomatic ? 'automatic' : 'manual'}
          label={c.isAutomatic ? 'Automatic' : 'Manual'}
          tone={c.isAutomatic ? 'purple' : 'gray'}
        />
      ),
    },
    {
      key: 'products',
      header: 'Products',
      sortable: true,
      sortValue: (c) => c.productCount,
      render: (c) => <span className="text-gray-900">{c.productCount}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <AdminStatusBadge status={c.status} />,
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Curated groups of products for merchandising."
        actions={
          <button
            type="button"
            onClick={() => toast.info('Collection creation arrives in Milestone 2')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Collection
          </button>
        }
      />
      <AdminDataTable<Collection>
        data={collections}
        columns={columns}
        getRowId={(c) => c.id}
        loading={loading}
        searchPlaceholder="Search collections…"
        searchFn={(c, q) => c.name.toLowerCase().includes(q)}
        emptyState={<AdminEmptyState icon={Layers} title="No collections" className="border-0" />}
      />
    </div>
  )
}
