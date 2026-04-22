import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OperatorDashboard from './pages/OperatorDashboard.jsx'
import Offer from './pages/Offer.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Profile from './pages/Profile.jsx'
import MyBookings from './pages/MyBookings.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import SearchBus from './pages/SearchBus.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function App() {
  return (
    <>
    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/admin/dashboard' element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      }/>      
      <Route path='/operator/dashboard' element={
        <ProtectedRoute allowedRoles={['ROLE_OPERATOR']}>
          <OperatorDashboard />
        </ProtectedRoute>
      }/>
      <Route path='/offers' element={<Offer/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/booking' element={<MyBookings/>}/>
      <Route path='/search' element={<SearchBus/>}/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  )
}

export default App
