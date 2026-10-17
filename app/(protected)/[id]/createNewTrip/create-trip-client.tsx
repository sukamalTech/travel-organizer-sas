

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Sparkles, Car, Train, Bike, Bus, Plane, Compass, Calendar, FileText, MapPin, Camera, Coffee, Hotel, Eye, Navigation, Map } from 'lucide-react';

const SCHEDULE_ITEMS = [
    {
        id: '1',
        type: 'Viewpoint',
        tagColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        time: '09:30 AM',
        name: 'Scenic Mountain Overlook',
        icon: Camera,
    },
    {
        id: '2',
        type: 'Rest Stop',
        tagColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        time: '12:00 PM',
        name: 'Valley Cafe & Local Lunch',
        icon: Coffee,
    },
    {
        id: '3',
        type: 'Stay',
        tagColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        time: '04:30 PM',
        name: 'Mountain Resort Check-in',
        icon: Hotel,
    },
];

interface CreateTripClientProps {
    ownerId: string;
    action: (formData: FormData) => Promise<void>;
}

export default function CreateTripClient({ ownerId, action }: CreateTripClientProps) {
    // Get today's date in YYYY-MM-DD format for min date constraints
    const todayStr = new Date().toISOString().split('T')[0];
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);
    const [mode, setMode] = useState('car');
    const [isPending, setIsPending] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);

    // Calculate maximum allowed end date (15 days after start date)
    const getMaxEndDate = (start: string) => {
        const d = new Date(start);
        d.setDate(d.getDate() + 15);
        return d.toISOString().split('T')[0];
    };

    const maxEndDateStr = getMaxEndDate(startDate);

    // Handle Start Date change to ensure end date remains valid
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        setStartDate(newStart);
        const maxAllowed = getMaxEndDate(newStart);
        if (endDate < newStart || endDate > maxAllowed) {
            setEndDate(newStart);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        const formData = new FormData();
        formData.append('owner_id', ownerId);
        formData.append('title', title || 'My New Journey');
        formData.append('description', description);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('primary_mode', mode);
        try {
            await action(formData);
        } catch (error: any) {
            if (error?.message?.includes('NEXT_REDIRECT') || error?.digest?.includes('NEXT_REDIRECT')) {
                throw error;
            }
            console.error('Failed to create trip:', error);
            setIsPending(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 transition-colors">
            <div className="w-full max-w-6xl">
                {/* Responsive 2-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* Left Side: Route Preview Section */}
                    {/* <div className="lg:col-span-5 space-y-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Day 1: Scenic Route Preview</span>
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">3 Stops • 14.2 km</span>
                        </div>
                        <div className="space-y-3">
                            {SCHEDULE_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeItem === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onMouseEnter={() => setActiveItem(item.id)}
                                        onMouseLeave={() => setActiveItem(null)}
                                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
                                                ? 'bg-slate-100 dark:bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                                                : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
                            Interactive preview of your upcoming family road trip itinerary.
                        </p>
                    </div> */}


                    {/* Left Side: Application Workflow Guide */}
                    <div className="lg:col-span-5 space-y-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-indigo-50/20 to-slate-50/90 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-indigo-950/30 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">

                        {/* Decorative background glow accents */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800 relative z-10">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-inner">
                                    <Compass className="h-5 w-5 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Journey Blueprint</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Your step-by-step roadmap</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono shadow-sm">
                                5-Step Flow
                            </span>
                        </div>

                        {/* Steps List */}
                        <div className="space-y-3 relative z-10">

                            {/* Step 1: Create New Trip (Active/Current Step) */}
                            <div className="p-4 rounded-2xl border bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-950/40 dark:to-slate-900/90 border-indigo-500/60 shadow-md shadow-indigo-500/10 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm">
                                        Step 1 • Current
                                    </span>
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">Setup</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Create New Trip</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Enter your journey title, start & end dates, and primary travel mode.
                                </p>
                            </div>

                            {/* Step 2: Live Map Itinerary */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        Step 2
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Mapping</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                        <Map className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Live Map Itineraries</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Build day-wise itineraries seamlessly using interactive live maps.
                                </p>
                            </div>

                            {/* Step 3: Day Legs */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        Step 3
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Routing</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                                        <Navigation className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Day Legs & Micro-Architecture</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Define route segments and legs for detailed micro-architecture.
                                </p>
                            </div>

                            {/* Step 4: Stays & Dining */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        Step 4
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Details</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Hotel className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Stays, Dining & Attractions</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Add hotels, restaurants, and tourist attractions for each specific day.
                                </p>
                            </div>

                            {/* Step 5: View Unified Trip */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                        Step 5
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Overview</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">View Unified Trip</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    All clubbed information and memories display cleanly in one place.
                                </p>
                            </div>
                        </div>

                        {/* Footer Tagline */}
                        <div className="pt-3 text-center relative z-10 border-t border-slate-200/60 dark:border-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                ✨ Plan your family road trips effortlessly & hassle-free.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Create Trip Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8">

                            {/* Header Section */}
                            <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                                    <Compass className="h-3.5 w-3.5" /> Journey Planner
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Where will the road take you next?
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Set up your timeline and travel mode. Plan itineraries up to 15 days at a time and map out your family road trip stops.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5 pt-6">
                                {/* Journey Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Journey Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Mountain Expedition to Sikkim & North Bengal"
                                        className="h-11 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/50 text-sm"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Description (Optional)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e: any) => setDescription(e.target.value)}
                                        placeholder="Briefly describe your goals, places to visit, or notes..."
                                        className="min-h-[80px] bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/50 text-sm resize-none"
                                    />
                                </div>

                                {/* Date Pickers Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> Start Date
                                        </Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            min={todayStr}
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            className="h-11 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/50 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /> End Date (Max 15 Days)
                                        </Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            min={startDate}
                                            max={maxEndDateStr}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="h-11 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/50 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Primary Mode of Travel */}
                                <div className="space-y-2">
                                    <Label htmlFor="mode" className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                                        Primary Mode of Travel
                                    </Label>
                                    <Select value={mode} onValueChange={setMode}>
                                        <SelectTrigger id="mode" className="h-11 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-indigo-500/50 text-sm">
                                            <SelectValue placeholder="Select transport mode" />
                                        </SelectTrigger>
                                        <SelectContent className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 backdrop-blur-xl">
                                            <SelectItem value="car" className="py-2.5 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                                                <div className="flex items-center gap-2.5 font-medium"><Car className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Car / Family Road Trip</div>
                                            </SelectItem>
                                            <SelectItem value="train" className="py-2.5 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                                                <div className="flex items-center gap-2.5 font-medium"><Train className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Express Train Journey</div>
                                            </SelectItem>
                                            <SelectItem value="bike" className="py-2.5 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                                                <div className="flex items-center gap-2.5 font-medium"><Bike className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Motorcycle / Touring Bike</div>
                                            </SelectItem>
                                            <SelectItem value="bus" className="py-2.5 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                                                <div className="flex items-center gap-2.5 font-medium"><Bus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Long-distance Bus</div>
                                            </SelectItem>
                                            <SelectItem value="flight" className="py-2.5 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                                                <div className="flex items-center gap-2.5 font-medium"><Plane className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Flight & Fly-Drive</div>
                                            </SelectItem>
                                            <SelectItem value="walking" className="py-2.5 focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white">
                                                <div className="flex items-center gap-2.5 font-medium"><Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Walking / Trekking</div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all mt-2"
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {isPending ? 'Initializing Journey...' : 'Create & Start Planning Route'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}