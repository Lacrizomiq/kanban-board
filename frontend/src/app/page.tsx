import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Okanban</h1>
      <p className="mb-4">
        Organize your tasks efficiently with our Kanban board application.
      </p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
