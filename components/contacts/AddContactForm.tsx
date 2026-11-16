// components/AddContactForm.tsx
'use client'

import { useEffect, useState } from 'react'
import { Plus, Check, Tag as TagIcon, Loader2, Star, X } from 'lucide-react'
import {
    createCustomTag,
    saveContactWithTags,
    updateContact,
} from '@/app/actions/contacts'
import type { TagItem, ContactItem } from '@/lib/indexdb/offlineContactsDB'

export default function AddContactForm({
    availableTags,
    editingContact,
    onCancelEdit,
    onTagCreated,
    onContactSaved,
}: {
    availableTags: TagItem[]
    editingContact?: ContactItem | null
    onCancelEdit?: () => void
    onTagCreated: (newTag: TagItem) => void
    onContactSaved: (savedContact: ContactItem, isEdit: boolean) => void
}) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [notes, setNotes] = useState('')
    const [isFrequent, setIsFrequent] = useState(false)
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

    const [newTagName, setNewTagName] = useState('')
    const [isAddingTag, setIsAddingTag] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Populate fields when switching into Edit mode
    useEffect(() => {
        if (editingContact) {
            setName(editingContact.name)
            setPhone(editingContact.phone_number)
            setNotes(editingContact.notes || '')
            setIsFrequent(Boolean(editingContact.is_frequent))
            setSelectedTagIds(editingContact.tags.map((t) => t.id))
            setError(null)
        } else {
            setName('')
            setPhone('')
            setNotes('')
            setIsFrequent(false)
            setSelectedTagIds([])
        }
    }, [editingContact])

    const toggleTag = (tagId: string) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        )
    }

    const handleCreateCustomTag = async () => {
        const trimmed = newTagName.trim()
        if (!trimmed) return

        setIsAddingTag(true)
        setError(null)
        try {
            const created = await createCustomTag(trimmed)
            onTagCreated({
                id: created.id,
                name: created.name,
                is_default: false,
                contact_count: 0,
            })
            setSelectedTagIds((prev) =>
                prev.includes(created.id) ? prev : [...prev, created.id]
            )
            setNewTagName('')
        } catch (err: any) {
            console.error('Create tag error:', err)
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                setError('You are offline. Reconnect to create a new tag.')
            } else {
                setError(err?.message || 'Could not create tag.')
            }
        } finally {
            setIsAddingTag(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) {
            setError('Name and phone number are required.')
            return
        }
        if (selectedTagIds.length === 0) {
            setError('Please select at least one tag.')
            return
        }

        setIsSaving(true)
        setError(null)
        try {
            const assignedTags = availableTags
                .filter((t) => selectedTagIds.includes(t.id))
                .map((t) => ({ id: t.id, name: t.name }))

            if (editingContact) {
                const res = await updateContact(editingContact.id, {
                    name,
                    phone,
                    tagIds: selectedTagIds,
                    notes,
                    isFrequent,
                })

                onContactSaved(
                    {
                        id: editingContact.id,
                        name: name.trim(),
                        phone_number: res.phone_number,
                        notes: notes.trim() || null,
                        is_frequent: isFrequent,
                        tags: assignedTags,
                    },
                    true
                )
            } else {
                const res = await saveContactWithTags({
                    name,
                    phone,
                    tagIds: selectedTagIds,
                    notes,
                    isFrequent,
                })

                onContactSaved(
                    {
                        id: res.contactId,
                        name: name.trim(),
                        phone_number: res.phone_number,
                        notes: notes.trim() || null,
                        is_frequent: isFrequent,
                        tags: assignedTags,
                    },
                    false
                )

                setName('')
                setPhone('')
                setNotes('')
                setIsFrequent(false)
                setSelectedTagIds([])
            }
        } catch (err: any) {
            console.error('Contact save/update error:', err)
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                setError('You are offline. Reconnect to save changes.')
            } else {
                setError(err?.message || 'Database error while saving contact.')
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
                    {editingContact ? 'Edit Contact' : 'Save New Contact'}
                </h3>
                {editingContact && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        aria-label="Cancel edit"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {error && (
                <div className="p-2.5 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="Person's Name (e.g., Subrata Das)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="tel"
                    placeholder="Phone Number (e.g., 9876543210)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="text"
                    placeholder="Designation / Note (optional, e.g., Area Inspector)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="sm:col-span-2 w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Frequently Called Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50">
                <input
                    type="checkbox"
                    checked={isFrequent}
                    onChange={(e) => setIsFrequent(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-zinc-700"
                />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <div className="text-xs">
                    <span className="font-semibold text-gray-900 dark:text-zinc-100">
                        Frequently Called
                    </span>
                    <span className="block text-gray-500 dark:text-zinc-400">
                        Show this contact immediately when the Contacts page opens
                    </span>
                </div>
            </label>

            {/* Multi-Select Tag Picker */}
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                    Assign Tags (Select one or more)
                </label>

                <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                        const active = selectedTagIds.includes(tag.id)
                        return (
                            <button
                                type="button"
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${active
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                {active ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <TagIcon className="w-3.5 h-3.5" />
                                )}
                                {tag.name}
                            </button>
                        )
                    })}
                </div>

                {/* Inline Custom Tag Creator */}
                <div className="flex gap-2 pt-1">
                    <input
                        type="text"
                        placeholder="New custom tag (e.g., DCFS, SCFS)..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleCreateCustomTag()
                            }
                        }}
                        className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-lg text-xs"
                    />
                    <button
                        type="button"
                        onClick={handleCreateCustomTag}
                        disabled={isAddingTag || !newTagName.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium rounded-lg disabled:opacity-50"
                    >
                        {isAddingTag ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Plus className="w-3.5 h-3.5" />
                        )}
                        Add Tag
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                {editingContact && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="flex-1 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving
                        ? 'Saving...'
                        : editingContact
                            ? 'Update Contact'
                            : 'Save Contact'}
                </button>
            </div>
        </form>
    )
}