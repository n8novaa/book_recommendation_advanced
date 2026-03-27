import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BookCard from "@/components/BookCard";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 opacity-0 animate-[fade-in_0.6s_ease-out_forwards]">
      <div className="bg-white/50 backdrop-blur-2xl rounded-3xl shadow-xl shadow-indigo-100/40 border border-white p-10 ring-1 ring-slate-900/5 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Explore Books</h1>
        <p className="mt-4 text-lg text-slate-600 mb-8">Browse the entire collection of books available in our database.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <Input placeholder="Search by title, author, or genre..." className="flex-1" />
          <Button variant="primary">Search</Button>
        </div>
      </div>

      {/* Grid demonstrating BookCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <BookCard title="The Great Gatsby" author="F. Scott Fitzgerald" rating={4.8} />
        <BookCard title="1984" author="George Orwell" rating={4.9} />
        <BookCard title="To Kill a Mockingbird" author="Harper Lee" rating={4.7} />
        <BookCard title="Dune" author="Frank Herbert" rating={4.6} />
      </div>
    </div>
  );
}
