const PlaceholderPage = ({ title, description }) => (
    <div className="py-6">
        <div>
            <h1 className="page-title">{title}</h1>
            <p className="mt-1 text-sm text-muted">
                {description || "This page will be implemented in an upcoming batch."}
            </p>
        </div>

        <div className="mt-6 card">
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
                <p className="mt-1 max-w-sm text-sm text-muted">
                    Coming soon. This section is part of the ongoing build.
                </p>
            </div>
        </div>
    </div>
);

export default PlaceholderPage;