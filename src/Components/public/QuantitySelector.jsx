import { Minus, Plus } from 'lucide-react'

function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  return (
    <div className="flex items-center bg-white border-2 border-sf-beige-dark
                    rounded-xl w-fit overflow-hidden">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-sf-text-soft
                   hover:text-sf-text hover:bg-sf-beige transition-colors
                   disabled:opacity-30">
        <Minus size={14} />
      </button>
      <input type="number" value={value} min={min} max={max}
        onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n))) }}
        className="w-10 h-10 bg-transparent text-center text-sf-text font-body font-700
                   text-sm outline-none" />
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-sf-text-soft
                   hover:text-sf-text hover:bg-sf-beige transition-colors
                   disabled:opacity-30">
        <Plus size={14} />
      </button>
    </div>
  )
}

export default QuantitySelector