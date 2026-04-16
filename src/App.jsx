import { useEffect }              from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore }            from './store/authStore'
import { Spinner }                 from './components/ui/Spinner'

// Layouts
import { AuthLayout }       from './components/layout/AuthLayout'
import { DashboardLayout }  from './components/layout/DashboardLayout'

// Auth pages
import { Signup }           from './pages/auth/Signup'
import { Login }            from './pages/auth/Login'
import { VerifyEmail }      from './pages/auth/VerifyEmail'
import { ForgotPassword }   from './pages/auth/ForgotPassword'
import { ResetPassword }    from './pages/auth/ResetPassword'

// App pages
import { Dashboard }        from './pages/dashboard/Dashboard'
import { Channels }         from './pages/channels/Channels'
import { Settings }         from './pages/settings/Settings'
import {
  Analytics, CommentInbox, Scheduler, Videos,
  AIContent, Growth, TimeIntel, Referral,
} from './pages/placeholder'

// Route guards
const PrivateRoute = ({ children }) => {
  const { user, isChecked } = useAuthStore()
  if (!isChecked) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user, isChecked } = useAuthStore()
  if (!isChecked) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const { checkAuth } = useAuthStore()
  useEffect(() => { checkAuth() }, [])

  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/signup"          element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/verify-email"    element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password"  element={<ResetPassword />} />
      </Route>

      {/* Dashboard */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/analytics"  element={<Analytics />} />
        <Route path="/time-intel" element={<TimeIntel />} />
        <Route path="/scheduler"  element={<Scheduler />} />
        <Route path="/videos"     element={<Videos />} />
        <Route path="/comments"   element={<CommentInbox />} />
        <Route path="/ai"         element={<AIContent />} />
        <Route path="/growth"     element={<Growth />} />
        <Route path="/channels"   element={<Channels />} />
        <Route path="/referral"   element={<Referral />} />
        <Route path="/settings"   element={<Settings />} />
      </Route>

      {/* Redirects */}
      <Route path="/"  element={<Navigate to="/dashboard" replace />} />
      <Route path="*"  element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
