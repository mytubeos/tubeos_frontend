import { Outlet, Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export const AuthLayout = () => (
  <div className="min-h-screen bg-base-700 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight">TubeOS</p>
            <p className="text-xs text-gray-600">Creator Command Center</p>
          </div>
        </Link>
      </div>
      <div className="glass rounded-2xl p-8">
        <Outlet />
      </div>
    </div>
  </div>
)
