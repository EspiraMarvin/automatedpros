export default function CharacterSkeleton() {
  return (
    <div className="border rounded p-2 flex flex-col items-center dark:bg-gray-800 animate-pulse">
      <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-md mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20" />
    </div>
  );
}
