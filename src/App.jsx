// import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes, } from 'react-router-dom'
import WorkerDash from './pages/worker/WorkerDash'
import WorkerProfileSetup from './pages/profile/WorkerProfileSetup'
import EmployerDash from './pages/employer/EmployerDash'
import Register from './pages/auth/register'
import ProtectedRoute from './routes/ProtectedRoute'
import HustlrLanding from './pages/publilc/LandingPage'
import RoleSelection from './pages/publilc/RoleSelecting'
import HustlrLogin from './pages/auth/login'
import ResetPassword from './pages/auth/ResetPasswordPage'
import WorkerLayout from './pages/worker/workerLayout'
import EmployerLayout from './pages/employer/EmployerLayout'
import WorkerProfileSection from './pages/worker/workerProfileSection'
import EmployerProfileSection from './pages/employer/EmployerProfileSection'
import EmployerProfileSetup from './pages/profile/EmployerProfileSetup'
import EmployerWorkRequests from './pages/employer/EmployerWorkRequests'
import EmployerChatPage from './pages/employer/EmployerChatPage'
import WorkerJobRequest from './pages/worker/workerJobRequest'
import WorkerNotificationsPage from './pages/worker/workerNotifications'
import MyJobs from './pages/worker/WorkerActiveJobsSection'
import ChatPage from './pages/worker/wokerChatPage'
import { initAuth } from './redux/slice/authSlice'
import { useNotificationSocket } from './hooks/useNotificationSocket'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css'

function App() {

  const { authInitialized, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    // Only dispatch if we haven't tried to initialize yet
    if (!authInitialized) {
      dispatch(initAuth());
    }
  }, [dispatch, authInitialized]);

  useNotificationSocket(user?.id)


  return (
    <>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register/:selectedRole" element={<Register />} />
        <Route path="/login" element={<HustlrLogin />} />
        <Route path="/" element={<HustlrLanding />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path='/resetPassword' element={<ResetPassword />} />





        {/* Worker */}
        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route path="/worker/profile-setup" element={<WorkerProfileSetup />} />
          <Route element={<WorkerLayout />}>
            <Route path="/worker/dashboard" element={<WorkerDash />} />
            <Route path="/worker/profile" element={<WorkerProfileSection />} />
            <Route path="/worker/messages" element={<ChatPage />} />
            <Route path="/worker/requests" element={<WorkerJobRequest />} />
            <Route path="/worker/notifications" element={<WorkerNotificationsPage />} />
            <Route path="/worker/my-jobs" element={<MyJobs />} />
          </Route>
        </Route>

        {/* Employer */}
        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="/employer/profile-setup" element={<EmployerProfileSetup />} />
          <Route element={<EmployerLayout />}>
            <Route path="/employer/dashboard" element={<EmployerDash />} />
            <Route path="/employer/profile" element={<EmployerProfileSection />} />
            <Route path="/employer/works/requests" element={<EmployerWorkRequests />} />
            <Route path="/employer/messages" element={<EmployerChatPage />} />
          </Route>
        </Route>

        {/* Admin */}
        {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminInterface />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route> */}

      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
