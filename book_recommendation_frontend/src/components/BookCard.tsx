type BookCardProps = {
  title: string;
  author: string;
};

export default function BookCard({ title, author }: BookCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white w-72">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">by {author}</p>

      <button className="mt-4 bg-blue-500 text-white px-3 py-1 rounded">
        Like
      </button>
    </div>
  );
}