export const Card = ({ children, className = '' }) => (
  <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>
)

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h3 className="font-display font-semibold text-white text-base">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)
