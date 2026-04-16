export const Input = ({
  label, name, type = 'text', placeholder, value, onChange,
  icon: Icon, error, hint, required = false, disabled = false, className = '',
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label htmlFor={name} className="text-sm font-medium text-gray-300">
        {label} {required && <span className="text-rose">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Icon size={16} /></div>}
      <input
        id={name} name={name} type={type}
        placeholder={placeholder} value={value} onChange={onChange}
        disabled={disabled}
        className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-rose/50 focus:ring-rose/30' : ''}`}
      />
    </div>
    {error && <p className="text-rose text-xs">{error}</p>}
    {hint  && <p className="text-emerald text-xs">{hint}</p>}
  </div>
)
