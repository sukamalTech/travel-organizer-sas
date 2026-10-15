import Link from 'next/link';

export default function CreateTripCard(Props: { id: string }) {
    if (!Props.id) return null;
    const { id } = Props;
    return (
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
            <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        {/* Map/Compass Icon */}
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                        </svg>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        Trip Planner
                    </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                    Planning a new journey?
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                    Create an itinerary to store routes, hotel stays, station details, and family dining stops for easy access during your trip.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5">
                {/* Main CTA: Create Trip */}
                <Link
                    href={`/${id}/createNewTrip`}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Create New Trip
                </Link>

                {/* Secondary Link: View All Trips */}
                <Link
                    href={`/${id}/create-trip`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                    <span>View All Saved Trips</span>
                    <svg
                        className="h-4 w-4 text-slate-400 dark:text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}