import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const DashboardLayout = () => (
  <div className="flex min-h-screen bg-base-700">
    <Sidebar />
    <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </div>
    </main>
  </div>
)
