'use client'

import React, { useEffect, useState } from 'react'
import { FolderTree, Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader, AdminDataTable, AdminStatusBadge, AdminEmptyState, AdminFormField, adminInputClass, adminSelectClass, adminTextareaClass, AdminConfirmDialog } from '@/components/admin'
import type { ColumnDef } from '@/components/admin'
import { catalogService } from '@/services/catalogService'
import type { Category } from '@/features/catalog/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [parentId, setParentId] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [position, setPosition] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const cats = await catalogService.getCategories()
      setCategories(cats)
    } catch (err) {
      toast.error('Failed to load categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    setName('')
    setSlug('')
    setDescription('')
    setParentId('')
    setStatus('active')
    setPosition(0)
    setErrors({})
    setCreateDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description)
    setParentId(category.parentId ?? '')
    setStatus(category.status)
    setPosition(category.position)
    setErrors({})
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!slug.trim()) errs.slug = 'Slug is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Please fix the errors')
      return
    }

    try {
      if (editCategory) {
        await catalogService.updateCategory(editCategory.id, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          parentId: parentId || null,
          status,
          position,
        })
        toast.success('Category updated')
      } else {
        await catalogService.createCategory({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          parentId: parentId || null,
          status,
          position,
        })
        toast.success('Category created')
      }
      setCreateDialogOpen(false)
      setEditCategory(null)
      loadCategories()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await catalogService.deleteCategory(deleteTarget.id)
      toast.success('Category deleted')
      setDeleteTarget(null)
      loadCategories()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete category')
    }
  }

  const columns: ColumnDef<Category>[] = [
    {
      key: 'name',
      header: 'Category',
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
      key: 'parent',
      header: 'Parent',
      render: (c) => <span className="text-gray-600">{c.parentId ? c.parentId : '—'}</span>,
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
    {
      key: 'actions',
      header: '',
      className: 'w-28 text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditDialog(c)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label={`Edit ${c.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(c)}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${c.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Organize products into browsable categories."
        actions={
          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        }
      />

      <AdminDataTable<Category>
        data={categories}
        columns={columns}
        getRowId={(c) => c.id}
        loading={loading}
        searchPlaceholder="Search categories…"
        searchFn={(c, q) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)}
        emptyState={<AdminEmptyState icon={FolderTree} title="No categories" className="border-0" />}
      />

      {/* Create/Edit Dialog */}
      {(createDialogOpen || editCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {editCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            <div className="space-y-4">
              <AdminFormField label="Name" htmlFor="cat-name" required error={errors.name}>
                <input
                  id="cat-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  className={adminInputClass}
                  placeholder="Category name"
                />
              </AdminFormField>
              <AdminFormField label="Slug" htmlFor="cat-slug" required error={errors.slug} description="Auto-generated from name.">
                <input
                  id="cat-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={adminInputClass}
                />
              </AdminFormField>
              <AdminFormField label="Description" htmlFor="cat-desc">
                <textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={adminTextareaClass} />
              </AdminFormField>
              <AdminFormField label="Parent Category" htmlFor="cat-parent">
                <select id="cat-parent" value={parentId} onChange={(e) => setParentId(e.target.value)} className={adminSelectClass}>
                  <option value="">No parent (root level)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </AdminFormField>
              <AdminFormField label="Status" htmlFor="cat-status">
                <select id="cat-status" value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')} className={adminSelectClass}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </AdminFormField>
              <AdminFormField label="Position" htmlFor="cat-position">
                <input id="cat-position" type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))} className={adminInputClass} />
              </AdminFormField>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreateDialogOpen(false)
                  setEditCategory(null)
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
                {editCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminConfirmDialog
        open={deleteTarget !== null}
        title="Delete category?"
        description={`"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        destructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}