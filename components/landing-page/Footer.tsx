
import { Compass } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
                        <Compass className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold tracking-tight">The Dynamic Explorer</span>
                </div>
                <div className="text-xs text-slate-500">
                    © 2026 Dynamic Explorer Workspace Inc. All rights reserved.
                </div>
                <div className="flex space-x-6 text-sm text-slate-500">
                    <a href="#features" className="hover:text-indigo-500">Privacy</a>
                    <a href="#features" className="hover:text-indigo-500">Terms</a>
                    <a href="#features" className="hover:text-indigo-500">Security</a>
                </div>
            </div>
        </footer>
    )
}




