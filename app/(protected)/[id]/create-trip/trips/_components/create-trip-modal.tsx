'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Plus, Sparkles, Car, Truck, Bike, Train, Plane, Bus } from 'lucide-react';

interface CreateTripModalProps {
    userId: string;
    action: (formData: FormData) => Promise<void>;
    buttonText?: string;
    buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
    buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
    isFullWidth?: boolean;
}

export function CreateTripModal({
    userId,
    action,
    buttonText = "New Journey",
    buttonSize = "default",
    buttonVariant = "default",
    isFullWidth = false
}: CreateTripModalProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [mode, setMode] = useState('car');
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', title || 'My New Journey');
        formData.append('primary_mode', mode);

        try {
            await action(formData);
        } catch (error) {
            console.error(error);
            setIsPending(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size={buttonSize}
                    variant={buttonVariant}
                    className={`gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 font-medium ${isFullWidth ? 'w-full' : ''}`}
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" /> {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="space-y-2 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl tracking-tight">Plan a New Adventure</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Set a name and your preferred transit mode to kickstart your itinerary tracking.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Journey Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Road to Sikkim & North Bengal"
                                className="h-11 bg-background/50 border-border/80 focus-visible:ring-primary/50"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="mode" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Primary Mode of Travel
                            </Label>
                            <Select value={mode} onValueChange={setMode}>
                                <SelectTrigger id="mode" className="h-11 bg-background/50 border-border/80 focus:ring-primary/50">
                                    <SelectValue placeholder="Select transport mode" />
                                </SelectTrigger>
                                <SelectContent className="border-border/80 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value="car" className="flex items-center gap-2 py-2.5">
                                        <div className="flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> Car / Road Trip</div>
                                    </SelectItem>
                                    <SelectItem value="suv" className="flex items-center gap-2 py-2.5">
                                        <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> SUV / 4x4</div>
                                    </SelectItem>
                                    <SelectItem value="bike" className="flex items-center gap-2 py-2.5">
                                        <div className="flex items-center gap-2"><Bike className="h-4 w-4 text-primary" /> Bike / Motorcycle</div>
                                    </SelectItem>
                                    <SelectItem value="train" className="flex items-center gap-2 py-2.5">
                                        <div className="flex items-center gap-2"><Train className="h-4 w-4 text-primary" /> Train</div>
                                    </SelectItem>
                                    <SelectItem value="flight" className="flex items-center gap-2 py-2.5">
                                        <div className="flex items-center gap-2"><Plane className="h-4 w-4 text-primary" /> Flight</div>
                                    </SelectItem>
                                    <SelectItem value="bus" className="flex items-center gap-2 py-2.5">
                                        <div className="flex items-center gap-2"><Bus className="h-4 w-4 text-primary" /> Bus</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 font-medium shadow-lg shadow-primary/20"
                        >
                            {isPending ? 'Creating Journey...' : 'Create & Start Planning'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}