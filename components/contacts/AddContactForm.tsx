// components/AddContactForm.tsx
'use client'

import { useState } from 'react'
import { Plus, Check, Tag as TagIcon, Loader2 } from 'lucide-react'
import { createCustomTag, saveContactWithTags } from '@/app/actions/contacts'
import type { TagItem, ContactItem } from '@/lib/indexdb/offlineContactsDB'

export default function AddContactForm({
    availableTags,
    onTagCreated,
    onContactSaved,
}: {
    availableTags: TagItem[]
    onTagCreated: (newTag: TagItem) => void
    onContactSaved: (newContact: ContactItem) => void
}) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [notes, setNotes] = useState('')
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

    // Inline custom tag creation states
    const [newTagName, setNewTagName] = useState('')
    const [isAddingTag, setIsAddingTag] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
            onTagCreated({ id: created.id, name: created.name, contact_count: 0 })
            setSelectedTagIds((prev) => [...prev, created.id])
            setNewTagName('')
        } catch {
            setError('Could not create tag. Check your internet connection.')
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
            const res = await saveContactWithTags({
                name,
                phone,
                tagIds: selectedTagIds,
                notes,
            })

            // Normalize phone for immediate local UI update
            let cleanPhone = phone.replace(/[\s\-()]/g, '')
            if (/^\d{10}$/.test(cleanPhone)) cleanPhone = `+91${cleanPhone}`

            const assignedTags = availableTags
                .filter((t) => selectedTagIds.includes(t.id))
                .map((t) => ({ id: t.id, name: t.name }))

            onContactSaved({
                id: res.contactId,
                name: name.trim(),
                phone_number: cleanPhone,
                notes: notes.trim() || null,
                tags: assignedTags,
            })

            // Reset form
            setName('')
            setPhone('')
            setNotes('')
            setSelectedTagIds([])
        } catch {
            setError('Failed to save contact. You appear to be offline.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-xl shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Save New Contact</h3>

            {error && (
                <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Person's Name (e.g., Subrata Das)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    required
                />

                <input
                    type="tel"
                    placeholder="Phone Number (e.g., 9876543210)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    required
                />

                <input
                    type="text"
                    placeholder="Designation / Note (optional, e.g., Area Inspector)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                />
            </div>

            {/* Multi-Select Tag Picker */}
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-gray-500">
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
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {active ? <Check className="w-3.5 h-3.5" /> : <TagIcon className="w-3.5 h-3.5" />}
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
                        className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                    />
                    <button
                        type="button"
                        onClick={handleCreateCustomTag}
                        disabled={isAddingTag || !newTagName.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg disabled:opacity-50"
                    >
                        {isAddingTag ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Add Tag
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? 'Saving to Cloud...' : 'Save Contact'}
            </button>
        </form>
    )
}