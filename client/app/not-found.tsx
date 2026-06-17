import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">
            Page Not Found
        </h2>

        <p className="mt-3 max-w-md text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
            href="/dashboard"
            className="mt-8 button-base main-button font-medium"
        >
            Back to Home
        </Link>
        </main>
    );
}