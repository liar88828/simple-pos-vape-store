import { Skeleton } from "@/components/ui/skeleton";

export function LoadingComponentSkeleton({ count = 1 }: { count?: number }) {
    return (
        <>
            <Skeleton className="h-48 w-full rounded-xl"/>
            { Array.from({ length: count }).map((_, index) => (
                <Skeleton key={ index } className="h-10 w-full rounded-xl"/>
            )) }
        </>
    );
}