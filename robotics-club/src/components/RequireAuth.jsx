import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireAuth({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="center-page">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
