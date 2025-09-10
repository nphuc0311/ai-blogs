import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <header className="mb-8">
        <Skeleton className="h-12 w-full max-w-2xl mb-4" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-48" />
        </div>
      </header>
      <div className="space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
}
