interface DevelopmentSpec {
  label: string
  value: string
}

/** Two-column definition list used on the development panel. */
export function DevelopmentSpecs({ specs }: { specs: DevelopmentSpec[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 py-6">
      {specs.map((spec) => (
        <div key={spec.label} className="flex flex-col gap-1">
          <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
            {spec.label}
          </dt>
          <dd className="font-display text-lg font-semibold leading-snug text-ink-900">{spec.value}</dd>
        </div>
      ))}
    </dl>
  )
}
