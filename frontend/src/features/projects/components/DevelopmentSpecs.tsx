interface DevelopmentSpec {
  label: string
  value: string
}

/** Two-column definition list used on the development panel with fluid clamping. */
export function DevelopmentSpecs({ specs }: { specs: DevelopmentSpec[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4 py-5 sm:gap-x-6 sm:gap-y-5 sm:py-6">
      {specs.map((spec) => (
        <div key={spec.label} className="flex flex-col gap-1">
          <dt className="text-[clamp(0.625rem,1.8vw,0.6875rem)] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {spec.label}
          </dt>
          <dd className="font-display text-[clamp(0.9375rem,3vw,1.125rem)] font-bold leading-snug text-ink-900">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
