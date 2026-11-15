// components/OfflineContactManager.tsx
'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Phone, MessageCircle, Search, Tag } from 'lucide-react'
import {
    cacheContactsData,
    getOfflineContactsData,
    type TagItem,
    type ContactItem,
} from '@/lib/indexdb/offlineContactsDB'
import { getUserTagsWithCounts, getMultiTagContacts } from '@/app/actions/contacts'
import AddContactForm from './AddContactForm'

export default function OfflineContactManager() {
    const [tags, setTags] = useState<TagItem[]>([])
    const [contacts, setContacts] = useState<ContactItem[]>([])
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [isOffline, setIsOffline] = useState(false)
    const [isSyncing, setIsSyncing] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)

    // Sync function: loads cache first, then fetches TiDB if online
    const syncData = async () => {
        setIsSyncing(true)

        // 1. Load instant offline snapshot first
        const cached = await getOfflineContactsData()
        if (cached.tags.length > 0 || cached.contacts.length > 0) {
            setTags(cached.tags)
            setContacts(cached.contacts)
        }

        // 2. Fetch fresh TiDB data if online
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

    // Filter locally so search & tag switching work offline instantly
    const filteredContacts = contacts.filter((contact) => {
        const matchesTag = selectedTagId
            ? contact.tags.some((t: any) => t.id === selectedTagId)
            : true
        const q = search.toLowerCase()
        const matchesSearch =
            contact.name.toLowerCase().includes(q) ||
            contact.phone_number.includes(q) ||
            (contact.notes && contact.notes.toLowerCase().includes(q))

        return matchesTag && matchesSearch
    })

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            {/* Top Status & Add Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Travel Contacts</h2>
                    {isOffline ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-800 rounded-full">
                            <WifiOff className="w-3 h-3" /> Offline Mode
                        </span>
                    ) : isSyncing ? (
                        <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />
                    ) : null}
                </div>

                {!isOffline && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg"
                    >
                        {showAddForm ? 'Close' : '+ New Contact'}
                    </button>
                )}
            </div>

            {/* Add Contact Form (Hidden when offline) */}
            {showAddForm && !isOffline && (
                <AddContactForm
                    availableTags={tags}
                    onTagCreated={(newTag) => {
                        const updatedTags = [...tags, newTag]
                        setTags(updatedTags)
                        cacheContactsData(updatedTags, contacts)
                    }}
                    onContactSaved={(newContact) => {
                        const updatedContacts = [newContact, ...contacts]
                        setContacts(updatedContacts)
                        cacheContactsData(tags, updatedContacts)
                        setShowAddForm(false)
                    }}
                />
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search name, number, or designation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white"
                />
            </div>

            {/* Tag-First Filter Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase text-gray-500">Filter by Tag</span>
                    {selectedTagId && (
                        <button
                            onClick={() => setSelectedTagId(null)}
                            className="text-xs text-blue-600 underline"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isSelected = selectedTagId === tag.id
                        return (
                            <button
                                key={tag.id}
                                onClick={() => setSelectedTagId(isSelected ? null : tag.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Tag className="w-3 h-3" />
                                <span>{tag.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Filtered Contact Cards */}
            <div className="space-y-2.5">
                {filteredContacts.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-8">No contacts found.</p>
                ) : (
                    filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-center justify-between p-3.5 border rounded-xl bg-white shadow-sm"
                        >
                            <div className="space-y-1">
                                <div className="font-semibold text-gray-900">{contact.name}</div>
                                <div className="text-xs text-gray-600">{contact.phone_number}</div>
                                {contact.notes && (
                                    <div className="text-xs text-gray-400">{contact.notes}</div>
                                )}
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {contact.tags.map((t: any) => (
                                        <span
                                            key={t.id}
                                            className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded-full"
                                        >
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Voice & WhatsApp Call Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={`tel:${contact.phone_number}`}
                                    aria-label={`Call ${contact.name}`}
                                    className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                                >
                                    <Phone className="w-5 h-5" />
                                </a>
                                <a
                                    href={`https://wa.me/${contact.phone_number.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`WhatsApp ${contact.name}`}
                                    className="p-2.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}