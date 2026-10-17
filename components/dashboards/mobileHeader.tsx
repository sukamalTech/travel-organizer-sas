// import Link from 'next/link';
// import {
//     Compass,
//     LayoutDashboard,
//     User,
//     LogOut,
//     Menu,
//     Sparkles
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import { ThemeToggle } from '../ThemeToggle';  // Adjust path if needed
// // import { LogoutButton } from '@/components/logout-button'; // If you have a custom component, or use direct action/link below

// export default function Header({ userId }: { userId: string }) {
//     return (
//         <header className="sticky top-0 z-50 h-16 bg-card/85 backdrop-blur-md border-b border-border/60 shadow-xs">
//             <div className="container mx-auto h-full flex items-center justify-between px-4 max-w-md">

//                 {/* Left Side: Compact Brand / Home Link */}
//                 <Link
//                     href={`/${userId}`}
//                     className="flex items-center gap-1.5 font-extrabold text-foreground text-sm tracking-tight hover:opacity-80 transition-opacity"
//                 >
//                     <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
//                         <Compass className="w-4 h-4" />
//                     </div>
//                     <span>Portal</span>
//                 </Link>

//                 {/* Right Side: Theme Toggle & Hamburger Dropdown Menu */}
//                 <div className="flex items-center gap-2">
//                     {/* Compact Theme Toggle */}
//                     <div className="scale-90">
//                         <ThemeToggle />
//                     </div>

//                     {/* Hamburger Menu Dropdown for Navigation & Actions */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 variant="outline"
//                                 size="icon"
//                                 className="h-9 w-9 rounded-xl border-border/70 bg-background/50 hover:bg-muted/60 transition-colors shadow-2xs"
//                                 aria-label="Open Navigation Menu"
//                             >
//                                 <Menu className="h-4 w-4 text-foreground" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-lg border-border/80 bg-card">
//                             <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-semibold py-2">
//                                 <Link href={`/${userId}`} className="flex items-center gap-2">
//                                     <LayoutDashboard className="h-4 w-4 text-primary" />
//                                     <span>Dashboard</span>
//                                 </Link>
//                             </DropdownMenuItem>

//                             <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-semibold py-2">
//                                 <Link href={`/${userId}/profile`} className="flex items-center gap-2">
//                                     <User className="h-4 w-4 text-purple-500" />
//                                     <span>Profile</span>
//                                 </Link>
//                             </DropdownMenuItem>

//                             <DropdownMenuSeparator className="my-1 border-border/60" />

//                             <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs font-semibold py-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400">
//                                 <Link href="/auth/logout" className="flex items-center gap-2">
//                                     <LogOut className="h-4 w-4" />
//                                     <span>Log out</span>
//                                 </Link>
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>

//             </div>
//         </header>
//     );
// }

import Link from 'next/link';
import {
    Compass,
    LayoutDashboard,
    User,
    LogOut,
    Menu,
    PlusCircle,
    ScreenShare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../ThemeToggle'; // Adjust path if needed
import { Suspense } from 'react';
import { LogoutButton } from '../logout-button';

export default function Header({ userId }: { userId: string }) {
    const navLinks = [
        {
            href: `/${userId}`,
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: `/${userId}/create-trip`,
            label: 'All Trips',
            icon: Compass,
        },
    ];

    return (
        <header className="sticky top-0 z-50 h-16 w-full border-b border-border/60 bg-card/85 backdrop-blur-md shadow-xs">
            <div className="container mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* Brand / Logo */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
                    >
                        <Compass className="h-6 w-6 text-primary" />
                        <span>TravellE</span>
                    </Link>

                    {/* Desktop & Tablet Navigation (Hidden on mobile) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                                >
                                    <Icon className="h-4 w-4 text-primary" />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Section: Actions & Theme Toggle */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Quick Action Button for Desktop/Tablet */}
                    <Button
                        asChild
                        size="sm"
                        className="hidden sm:inline-flex gap-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
                    >
                        <Link href={`/${userId}/view-trips`} className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
                            <ScreenShare className="h-4 w-4" />
                            <span>View Trip</span>
                        </Link>
                    </Button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Mobile Navigation Dropdown (Visible on Mobile) */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl border-border/70 bg-background/50 hover:bg-muted/60 transition-colors shadow-2xs"
                                    aria-label="Open Navigation Menu"
                                >
                                    <Menu className="h-5 w-5 text-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-2xl p-1.5 shadow-xl border-border/80 bg-card"
                            >
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <DropdownMenuItem
                                            key={link.href}
                                            asChild
                                            className="rounded-xl cursor-pointer text-sm font-medium py-2.5"
                                        >
                                            <Link href={link.href} className="flex items-center gap-2.5">
                                                <Icon className="h-4 w-4 text-primary" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}

                                <DropdownMenuItem
                                    asChild
                                    className="rounded-xl cursor-pointer text-sm font-medium py-2.5"
                                >
                                    <Link href={`/${userId}/profile`} className="flex items-center gap-2.5">
                                        <User className="h-4 w-4 text-purple-500" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 border-border/60" />

                                <DropdownMenuItem
                                    asChild
                                    className="rounded-xl cursor-pointer text-sm font-semibold py-2.5 text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400"
                                >
                                    <Suspense>
                                        <LogoutButton />
                                    </Suspense>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Desktop/Tablet Profile Dropdown (Hidden on Mobile) */}
                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl border-border/70 bg-background/50 hover:bg-muted/60 transition-colors shadow-2xs"
                                    aria-label="User Profile Options"
                                >
                                    <User className="h-5 w-5 text-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-2xl p-1.5 shadow-xl border-border/80 bg-card"
                            >
                                <DropdownMenuItem
                                    asChild
                                    className="rounded-xl cursor-pointer text-sm font-medium py-2.5"
                                >
                                    <Link href={`/${userId}/profile`} className="flex items-center gap-2.5">
                                        <User className="h-4 w-4 text-purple-500" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 border-border/60" />

                                <DropdownMenuItem
                                    asChild
                                    className="rounded-xl cursor-pointer text-sm font-semibold py-2.5 text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400"
                                >
                                    <Suspense>
                                        <LogoutButton />
                                    </Suspense>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </header>
    );
}