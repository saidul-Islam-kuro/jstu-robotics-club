import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import RequireAuth from './components/RequireAuth.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Members from './pages/Members.jsx'
import MemberProfile from './pages/MemberProfile.jsx'
import Notices from './pages/Notices.jsx'
import Join from './pages/Join.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditProfile from './pages/EditProfile.jsx'
import AdminNotices from './pages/AdminNotices.jsx'
import AdminApplications from './pages/AdminApplications.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="page">
      <Navbar />
      <div className="page-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberProfile />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/dashboard" element={
            <RequireAuth><Dashboard /></RequireAuth>
          } />
          <Route path="/dashboard/edit" element={
            <RequireAuth><EditProfile /></RequireAuth>
          } />
          <Route path="/admin/notices" element={
            <RequireAuth adminOnly><AdminNotices /></RequireAuth>
          } />
          <Route path="/admin/applications" element={
            <RequireAuth adminOnly><AdminApplications /></RequireAuth>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
