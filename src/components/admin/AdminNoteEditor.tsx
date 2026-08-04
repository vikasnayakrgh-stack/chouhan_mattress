'use client'

import React, { useState } from 'react'
import { Pencil, Trash2, StickyNote } from 'lucide-react'
import { adminTextareaClass } from './AdminFormField'
import type { CustomerNote } from '@/features/customers/types'

interface AdminNoteEditorProps {
  notes: CustomerNote[]
  onAdd: (content: string) => void
  onUpdate: (noteId: string, content: string) => void
  onDelete: (noteId: string) => void
}

export function AdminNoteEditor({ notes, onAdd, onUpdate, onDelete }: AdminNoteEditorProps) {
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Add an internal note (visible to admins only)…"
          className={adminTextareaClass}
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!draft.trim()}
            onClick={() => {
              onAdd(draft.trim())
              setDraft('')
            }}
            className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Add Note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-10 text-gray-400">
          <StickyNote className="h-6 w-6" />
          <p className="text-sm">No notes yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-gray-200 bg-white p-4">
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    rows={3}
                    className={adminTextareaClass}
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEditingId(null)} className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!editDraft.trim()}
                      onClick={() => {
                        onUpdate(note.id, editDraft.trim())
                        setEditingId(null)
                      }}
                      className="h-8 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{note.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {note.author} · {new Date(note.createdAt).toLocaleString('en-IN')}
                      {note.updatedAt && ' (edited)'}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(note.id)
                          setEditDraft(note.content)
                        }}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Edit note"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
