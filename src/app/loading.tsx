import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading content...</p>
    </div>
  );
}
