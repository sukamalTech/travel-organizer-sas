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
import { Sparkles, Car, Truck, Bike, Train, Plane, Bus, Compass, Calendar, FileText, MapPin } from 'lucide-react';

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

        // If current end date is before new start date or exceeds 15 days, reset it
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
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12 transition-colors">
            <div className="w-full max-w-xl">
                {/* Main Card Container */}
                <div className="rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-10">

                    {/* Header Section */}
                    <div className="space-y-3 pb-6 border-b border-border/40">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                            <Compass className="h-3.5 w-3.5" /> Journey Planner
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-card-foreground">
                            Where will the road take you next?
                        </h1>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Set up your timeline and travel mode. Plan itineraries up to 15 days at a time and map out your family road trip stops.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 pt-6">

                        {/* Journey Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-primary" /> Journey Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Mountain Expedition to Sikkim & North Bengal"
                                className="h-12 bg-background text-foreground border-border/80 focus-visible:ring-primary/50 text-base"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-primary" /> Description (Optional)
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                                placeholder="Briefly describe your goals, places to visit, or notes..."
                                className="min-h-[90px] bg-background text-foreground border-border/80 focus-visible:ring-primary/50 text-sm resize-none"
                            />
                        </div>

                        {/* Date Pickers Grid (Responsive) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label htmlFor="start_date" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-primary" /> Start Date
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    min={todayStr}
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    className="h-12 bg-background text-foreground border-border/80 focus-visible:ring-primary/50 text-base"
                                    required
                                />
                            </div>

                            {/* End Date (Max 15 days from start) */}
                            <div className="space-y-2">
                                <Label htmlFor="end_date" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-primary" /> End Date (Max 15 Days)
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    min={startDate}
                                    max={maxEndDateStr}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-12 bg-background text-foreground border-border/80 focus-visible:ring-primary/50 text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Primary Mode of Travel */}
                        <div className="space-y-2">
                            <Label htmlFor="mode" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Primary Mode of Travel
                            </Label>
                            <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger id="mode" className="h-12 bg-background text-foreground border-border/80 focus:ring-primary/50 text-base">
                                    <SelectValue placeholder="Select transport mode" />
                                </SelectTrigger>
                                <SelectContent className="border-border/80 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="car" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Car className="h-4 w-4 text-primary" /> Car / Family Road Trip</div>
                                    </SelectItem>
                                    <SelectItem value="train" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Train className="h-4 w-4 text-primary" /> Express Train Journey</div>
                                    </SelectItem>
                                    <SelectItem value="bike" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Bike className="h-4 w-4 text-primary" /> Motorcycle / Touring Bike</div>
                                    </SelectItem>
                                    <SelectItem value="bus" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Bus className="h-4 w-4 text-primary" /> Long-distance Bus</div>
                                    </SelectItem>
                                    <SelectItem value="flight" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Plane className="h-4 w-4 text-primary" /> Flight & Fly-Drive</div>
                                    </SelectItem>
                                    <SelectItem value="ferry" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Car className="h-4 w-4 text-primary" /> Ferry Crossing</div>
                                    </SelectItem>
                                    <SelectItem value="walking" className="py-3">
                                        <div className="flex items-center gap-2.5 font-medium"><Compass className="h-4 w-4 text-primary" /> Walking / Trekking</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all mt-2"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {isPending ? 'Initializing Journey...' : 'Create & Start Planning Route'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}