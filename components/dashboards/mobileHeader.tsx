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
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../ThemeToggle';  // Adjust path if needed

export default function Header({ userId }: { userId: string }) {
    return (
        <header className="sticky top-0 z-50 h-16 w-full bg-card/85 backdrop-blur-md border-b border-border/60 shadow-xs">
            <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 max-w-7xl">

                {/* Left Side: Compact Brand / Home Link (Responsive Text & Icon) */}
                <Link
                    href={`/${userId}`}
                    className="flex items-center gap-2 font-extrabold text-foreground text-base sm:text-lg tracking-tight hover:opacity-80 transition-opacity"
                >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
                        <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span>Portal</span>
                </Link>

                {/* Right Side: Theme Toggle & Hamburger Dropdown Menu */}
                <div className="flex items-center gap-3">
                    {/* Compact Theme Toggle */}
                    <div className="flex items-center">
                        <ThemeToggle />
                    </div>

                    {/* Hamburger Menu Dropdown for Navigation & Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-border/70 bg-background/50 hover:bg-muted/60 transition-colors shadow-2xs"
                                aria-label="Open Navigation Menu"
                            >
                                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl border-border/80 bg-card">
                            <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs sm:text-sm font-semibold py-2.5">
                                <Link href={`/${userId}`} className="flex items-center gap-2.5">
                                    <LayoutDashboard className="h-4 w-4 text-primary" />
                                    <span>Dashboard</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs sm:text-sm font-semibold py-2.5">
                                <Link href={`/${userId}/profile`} className="flex items-center gap-2.5">
                                    <User className="h-4 w-4 text-purple-500" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 border-border/60" />

                            <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs sm:text-sm font-semibold py-2.5 text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400">
                                <Link href="/auth/logout" className="flex items-center gap-2.5">
                                    <LogOut className="h-4 w-4" />
                                    <span>Log out</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </header>
    );
}