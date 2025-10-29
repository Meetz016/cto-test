type FilterValue = 'all' | 'active' | 'completed'

type TodoFiltersProps = {
  value: FilterValue
  onChange: (value: FilterValue) => void
  counts: {
    total: number
    active: number
    completed: number
  }
}

const FILTERS: { value: FilterValue; label: string; getCount: (counts: TodoFiltersProps['counts']) => number }[] = [
  { value: 'all', label: 'All', getCount: (counts) => counts.total },
  { value: 'active', label: 'Active', getCount: (counts) => counts.active },
  { value: 'completed', label: 'Completed', getCount: (counts) => counts.completed },
]

export const TodoFilters = ({ value, onChange, counts }: TodoFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.value === value

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground shadow'
                : 'border-slate-300 bg-white text-slate-600 hover:border-primary/50 hover:text-slate-900'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20 text-primary-foreground' : 'bg-slate-100 text-slate-500'}`}>
              {filter.getCount(counts)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
