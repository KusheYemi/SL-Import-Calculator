import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="bg-forest hover:bg-forest-light text-white">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
