"use client";

export default function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-gray-200" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-28 rounded bg-gray-200" />
            <div className="h-2.5 w-20 rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="mt-1 h-9 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
