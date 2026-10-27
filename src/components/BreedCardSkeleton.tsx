interface BreedCardSkeletonProps {
  count?: number
}

/** Placeholder cards shown while the catalog loads. */
export default function BreedCardSkeleton({ count = 8 }: BreedCardSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-card"
        >
          <div className="aspect-[4/3] animate-pulse bg-sand-200" />
          <div className="space-y-4 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded-full bg-sand-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-sand-100" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 animate-pulse rounded-2xl bg-sand-100" />
              <div className="h-14 animate-pulse rounded-2xl bg-sand-100" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-full bg-sand-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
