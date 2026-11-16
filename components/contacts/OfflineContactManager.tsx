// components/OfflineContactManager.tsx
'use client'

import { useEffect, useState } from 'react'
import {
    WifiOff,
    RefreshCw,
    Phone,
    MessageCircle,
    Search,
    Tag,
    Pencil,
    Trash2,
    Star,
    Check,
    X,
    Settings2,
} from 'lucide-react'
import {
    cacheContactsData,
    getOfflineContactsData,
    type TagItem,
    type ContactItem,
} from '@/lib/indexdb/offlineContactsDB'
import {
    getUserTagsWithCounts,
    getMultiTagContacts,
    deleteContact,
    renameCustomTag,
    deleteCustomTag,
} from '@/app/actions/contacts'
import AddContactForm from './AddContactForm'

// Deterministic colorful badge styles for light & dark mode
const TAG_COLOR_PALETTE = [
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
    'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
]

function getTagColorClass(tagName: string) {
    let hash = 0
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return TAG_COLOR_PALETTE[Math.abs(hash) % TAG_COLOR_PALETTE.length]
}

export default function OfflineContactManager() {
    const [tags, setTags] = useState<TagItem[]>([])
    const [contacts, setContacts] = useState<ContactItem[]>([])
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [showAllContacts, setShowAllContacts] = useState(false)

    const [isOffline, setIsOffline] = useState(false)
    const [isSyncing, setIsSyncing] = useState(true)

    // Contact Add / Edit states
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingContact, setEditingContact] = useState<ContactItem | null>(null)

    // Custom Tag Edit / Delete states
    const [isManagingTags, setIsManagingTags] = useState(false)
    const [editingTagId, setEditingTagId] = useState<string | null>(null)
    const [editingTagName, setEditingTagName] = useState('')

    const syncData = async () => {
        setIsSyncing(true)

        const cached = await getOfflineContactsData()
        if (cached.tags.length > 0 || cached.contacts.length > 0) {
            setTags(cached.tags)
            setContacts(cached.contacts)
        }

        if (typeof navigator !== 'undefined' && navigator.onLine) {
            try {
                const [freshTags, freshContacts] = await Promise.all([
                    getUserTagsWithCounts() as Promise<TagItem[]>,
                    getMultiTagContacts() as Promise<ContactItem[]>,
                ])

                setTags(freshTags)
                setContacts(freshContacts)
                await cacheContactsData(freshTags, freshContacts)
            } catch (err) {
                console.warn('Network sync failed, continuing with offline cache:', err)
            }
        }

        setIsSyncing(false)
    }

    useEffect(() => {
        setIsOffline(!navigator.onLine)
        syncData()

        const handleOnline = () => {
            setIsOffline(false)
            syncData()
        }
        const handleOffline = () => setIsOffline(true)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Handle Contact Delete
    const handleDeleteContact = async (contact: ContactItem) => {
        if (!window.confirm(`Delete ${contact.name}?`)) return
        try {
            await deleteContact(contact.id)
            const updated = contacts.filter((c) => c.id !== contact.id)
            setContacts(updated)
            await cacheContactsData(tags, updated)
        } catch {
            alert('Failed to delete contact. Check your internet connection.')
        }
    }

    // Handle Custom Tag Rename
    const handleSaveTagRename = async (tagId: string) => {
        const trimmed = editingTagName.trim()
        if (!trimmed) return
        try {
            await renameCustomTag(tagId, trimmed)

            const updatedTags = tags.map((t) =>
                t.id === tagId ? { ...t, name: trimmed } : t
            )
            const updatedContacts = contacts.map((c) => ({
                ...c,
                tags: c.tags.map((t) => (t.id === tagId ? { ...t, name: trimmed } : t)),
            }))

            setTags(updatedTags)
            setContacts(updatedContacts)
            await cacheContactsData(updatedTags, updatedContacts)
            setEditingTagId(null)
        } catch {
            alert('Could not rename tag.')
        }
    }

    // Handle Custom Tag Delete
    const handleDeleteTag = async (tag: TagItem) => {
        if (tag.is_default) return
        if (
            !window.confirm(
                `Delete custom tag "${tag.name}"? Contacts will stay saved, only this tag will be removed.`
            )
        ) {
            return
        }

        try {
            await deleteCustomTag(tag.id)

            const updatedTags = tags.filter((t) => t.id !== tag.id)
            const updatedContacts = contacts.map((c) => ({
                ...c,
                tags: c.tags.filter((t) => t.id !== tag.id),
            }))

            if (selectedTagId === tag.id) setSelectedTagId(null)
            setTags(updatedTags)
            setContacts(updatedContacts)
            await cacheContactsData(updatedTags, updatedContacts)
        } catch {
            alert('Could not delete tag.')
        }
    }

    // Filtering logic:
    // If no search query, no tag selected, and "Show All" isn't active -> show ONLY Frequently Called
    const isBrowsingAllOrFiltered =
        search.trim() !== '' || selectedTagId !== null || showAllContacts

    const filteredContacts = contacts.filter((contact) => {
        if (!isBrowsingAllOrFiltered && !contact.is_frequent) {
            return false
        }

        const matchesTag = selectedTagId
            ? contact.tags.some((t) => t.id === selectedTagId)
            : true

        const q = search.trim().toLowerCase()
        const matchesSearch =
            q === '' ||
            contact.name.toLowerCase().includes(q) ||
            contact.phone_number.toLowerCase().includes(q) ||
            (contact.notes && contact.notes.toLowerCase().includes(q))

        return matchesTag && matchesSearch
    })

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5 text-gray-900 dark:text-zinc-100">
            {/* Top Status & Add Button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Travel Contacts
                    </h2>
                    {isOffline ? (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full">
                            <WifiOff className="w-3.5 h-3.5" /> Offline Mode
                        </span>
                    ) : isSyncing ? (
                        <RefreshCw className="w-4 h-4 text-gray-400 dark:text-zinc-500 animate-spin" />
                    ) : null}
                </div>

                {!isOffline && (
                    <button
                        onClick={() => {
                            setEditingContact(null)
                            setShowAddForm((prev) => !prev)
                        }}
                        className="px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
                    >
                        {showAddForm && !editingContact ? 'Close Form' : '+ New Contact'}
                    </button>
                )}
            </div>

            {/* Add / Edit Contact Form */}
            {(showAddForm || editingContact) && !isOffline && (
                <AddContactForm
                    availableTags={tags}
                    editingContact={editingContact}
                    onCancelEdit={() => {
                        setEditingContact(null)
                        setShowAddForm(false)
                    }}
                    onTagCreated={(newTag) => {
                        const exists = tags.some((t) => t.id === newTag.id)
                        if (!exists) {
                            const updatedTags = [...tags, newTag]
                            setTags(updatedTags)
                            cacheContactsData(updatedTags, contacts)
                        }
                    }}
                    onContactSaved={(savedContact, isEdit) => {
                        const updatedContacts = isEdit
                            ? contacts.map((c) => (c.id === savedContact.id ? savedContact : c))
                            : [savedContact, ...contacts]
                        setContacts(updatedContacts)
                        cacheContactsData(tags, updatedContacts)
                        setShowAddForm(false)
                        setEditingContact(null)
                    }}
                />
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 dark:text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search all contacts by name, phone number, or note..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tag-First Filter Bar */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                        Filter by Tag
                    </span>
                    <div className="flex items-center gap-3">
                        {selectedTagId && (
                            <button
                                onClick={() => setSelectedTagId(null)}
                                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Clear Tag
                            </button>
                        )}
                        {!isOffline && (
                            <button
                                onClick={() => {
                                    setIsManagingTags((prev) => !prev)
                                    setEditingTagId(null)
                                }}
                                className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200"
                            >
                                <Settings2 className="w-3.5 h-3.5" />
                                {isManagingTags ? 'Done' : 'Edit Custom Tags'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isSelected = selectedTagId === tag.id
                        const isEditingThisTag = editingTagId === tag.id

                        if (isEditingThisTag) {
                            return (
                                <div
                                    key={tag.id}
                                    className="flex items-center gap-1 px-2 py-1 rounded-full border border-blue-500 bg-white dark:bg-zinc-900"
                                >
                                    <input
                                        type="text"
                                        value={editingTagName}
                                        onChange={(e) => setEditingTagName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveTagRename(tag.id)
                                            if (e.key === 'Escape') setEditingTagId(null)
                                        }}
                                        className="w-28 text-xs bg-transparent focus:outline-none px-1"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleSaveTagRename(tag.id)}
                                        className="p-0.5 text-emerald-600 dark:text-emerald-400"
                                        title="Save tag name"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setEditingTagId(null)}
                                        className="p-0.5 text-gray-400"
                                        title="Cancel"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )
                        }

                        return (
                            <div key={tag.id} className="inline-flex items-center">
                                <button
                                    onClick={() => setSelectedTagId(isSelected ? null : tag.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition ${isManagingTags && !tag.is_default ? 'rounded-l-full border-r-0' : 'rounded-full'
                                        } ${isSelected
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    <Tag className="w-3 h-3" />
                                    <span>{tag.name}</span>
                                </button>

                                {/* Edit/Delete controls shown ONLY for non-default custom tags when managing */}
                                {isManagingTags && !tag.is_default && (
                                    <div className="flex items-center border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 rounded-r-full px-1.5 py-1.5 gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingTagId(tag.id)
                                                setEditingTagName(tag.name)
                                            }}
                                            className="text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                                            title="Rename custom tag"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTag(tag)}
                                            className="text-gray-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                                            title="Delete custom tag"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Section Header & Frequent vs All Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    {!isBrowsingAllOrFiltered ? (
                        <>
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Frequently Called ({filteredContacts.length})</span>
                        </>
                    ) : (
                        <span>Matching Contacts ({filteredContacts.length})</span>
                    )}
                </div>

                {search.trim() === '' && selectedTagId === null && (
                    <button
                        onClick={() => setShowAllContacts((prev) => !prev)}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {showAllContacts ? 'Show Frequent Only' : `View All (${contacts.length})`}
                    </button>
                )}
            </div>

            {/* Responsive Contact Grid */}
            {filteredContacts.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                        {!isBrowsingAllOrFiltered
                            ? 'No frequently called contacts yet.'
                            : 'No contacts match your filter.'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                        {!isBrowsingAllOrFiltered
                            ? 'Search by name/number above, tap a tag, or mark a contact as Frequently Called.'
                            : 'Try clearing your search or selecting another tag.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-start justify-between gap-3 p-4 border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm hover:border-gray-300 dark:hover:border-zinc-700 transition"
                        >
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-gray-900 dark:text-zinc-100 truncate">
                                        {contact.name}
                                    </span>
                                    {contact.is_frequent && (
                                        <Star
                                            className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0"
                                            aria-label="Frequently called"
                                        />
                                    )}
                                </div>

                                <div className="text-xs font-mono text-gray-600 dark:text-zinc-400">
                                    {contact.phone_number}
                                </div>

                                {contact.notes && (
                                    <div className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-1">
                                        {contact.notes}
                                    </div>
                                )}

                                {/* Colorful Tag Badges */}
                                <div className="flex flex-wrap gap-1.5 pt-1.5">
                                    {contact.tags.map((t) => (
                                        <span
                                            key={t.id}
                                            className={`px-2.5 py-0.5 text-[11px] font-medium border rounded-full ${getTagColorClass(
                                                t.name
                                            )}`}
                                        >
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons: Voice, WhatsApp, Edit & Delete */}
                            <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <a
                                        href={`tel:${contact.phone_number}`}
                                        aria-label={`Voice call ${contact.name}`}
                                        className="p-2.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/70 transition"
                                    >
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </a>
                                    <a
                                        href={`https://wa.me/${contact.phone_number.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`WhatsApp ${contact.name}`}
                                        className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition"
                                    >
                                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </a>
                                </div>

                                {!isOffline && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setShowAddForm(false)
                                                setEditingContact(contact)
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                            aria-label={`Edit ${contact.name}`}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteContact(contact)}
                                            aria-label={`Delete ${contact.name}`}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}