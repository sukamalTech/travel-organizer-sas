// components/ContactDirectory.tsx
'use client'

import { useState } from 'react'
import { Phone, MessageCircle, Search, Tag, Plus } from 'lucide-react'

type TagItem = {
    id: string
    name: string
    contact_count: number
}

type ContactItem = {
    id: string
    name: string
    phone_number: string
    tag_name: string
    notes?: string
}

export default function ContactDirectory({
    initialTags,
    initialContacts,
}: {
    initialTags: TagItem[]
    initialContacts: ContactItem[]
}) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    // Filter contacts locally for instant response (or fetch via Server Action)
    const filteredContacts = initialContacts.filter((contact) => {
        const matchesTag = selectedTag ? contact.tag_name === selectedTag : true
        const matchesSearch =
            contact.name.toLowerCase().includes(search.toLowerCase()) ||
            contact.phone_number.includes(search)
        return matchesTag && matchesSearch
    })

    // Format phone for WhatsApp (digits only, no '+' or spaces)
    const getWhatsAppUrl = (phone: string) => {
        const digitsOnly = phone.replace(/\D/g, '')
        return `https://wa.me/${digitsOnly}`
    }

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            {/* Global Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search name or number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
                />
            </div>

            {/* Step 1: Tag List First */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold uppercase text-gray-500">Select Category / Tag</h3>
                    {selectedTag && (
                        <button
                            onClick={() => setSelectedTag(null)}
                            className="text-xs text-blue-600 underline"
                        >
                            Show All
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {initialTags.map((tag) => {
                        const isSelected = selectedTag === tag.name
                        return (
                            <button
                                key={tag.id}
                                onClick={() => setSelectedTag(isSelected ? null : tag.name)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                <Tag className="w-3.5 h-3.5" />
                                <span>{tag.name}</span>
                                <span className="text-xs opacity-75">({tag.contact_count})</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Step 2: Filtered Contact Cards with Voice & WhatsApp Actions */}
            <div className="space-y-2.5 pt-2">
                {filteredContacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="flex items-center justify-between p-3 border rounded-xl bg-white shadow-sm"
                    >
                        <div>
                            <div className="font-medium text-gray-900">{contact.name}</div>
                            <div className="text-xs text-gray-500">{contact.phone_number}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded">
                                {contact.tag_name}
                            </span>
                        </div>

                        {/* Direct Platform Redirect Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Normal Voice Call */}
                            <a
                                href={`tel:${contact.phone_number}`}
                                aria-label={`Voice call ${contact.name}`}
                                className="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                            >
                                <Phone className="w-5 h-5" />
                            </a>

                            {/* WhatsApp Redirect (Opens WhatsApp chat/call screen directly) */}
                            <a
                                href={getWhatsAppUrl(contact.phone_number)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`WhatsApp ${contact.name}`}
                                className="p-2.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}