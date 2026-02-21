function SizeSelector({ sizes = [], selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(({ size, stock }) => {
        const isSelected = selected === size
        const outOfStock = stock === 0
        return (
          <button key={size} onClick={() => !outOfStock && onChange(size)}
            disabled={outOfStock}
            className={`min-w-[44px] h-10 px-3 font-body text-sm rounded-xl
                        transition-all duration-200 border-2
                        ${isSelected
                          ? 'bg-sf-rose border-sf-rose text-sf-text font-700'
                          : outOfStock
                            ? 'border-sf-beige text-sf-text-light cursor-not-allowed line-through bg-sf-beige'
                            : 'border-sf-beige-dark text-sf-text hover:border-sf-rose bg-white'
                        }`}>
            {size}
          </button>
        )
      })}
    </div>
  )
}

export default SizeSelector