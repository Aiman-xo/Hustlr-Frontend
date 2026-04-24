// import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import WorkerDash from './pages/worker/WorkerDash'
import WorkerProfileSetup from './pages/profile/WorkerProfileSetup'
import EmployerDash from './pages/employer/EmployerDash'
import Register from './pages/auth/register'
import ProtectedRoute from './routes/ProtectedRoute'
import HustlrLanding from './pages/publilc/LandingPage'
import RoleSelection from './pages/publilc/RoleSelecting'
import HustlrLogin from './pages/auth/login'
import ResetPassword from './pages/auth/ResetPasswordPage'
import HustlrAIAssistant from './pages/ai/HustlrAIassistence'
import WorkerLayout from './pages/worker/workerLayout'
import EmployerLayout from './pages/employer/EmployerLayout'
import WorkerProfileSection from './pages/worker/workerProfileSection'
import EmployerProfileSection from './pages/employer/EmployerProfileSection'
import EmployerProfileSetup from './pages/profile/EmployerProfileSetup'
import EmployerWorkRequests from './pages/employer/EmployerWorkRequests'
import EmployerWorks from './pages/employer/EmployerWorks'
import EmployerChatPage from './pages/employer/EmployerChatPage'
import InvoiceDetails from './pages/employer/InvoiceDetails'
import EmployerReceivedRequestsPage from './pages/employer/EmployerReceivedRequestsPage'
import EmployerMyPosts from './pages/employer/EmployerMyPosts'
import WorkerJobRequest from './pages/worker/workerJobRequest'
import WorkerNotificationsPage from './pages/worker/workerNotifications'
import MyJobs from './pages/worker/WorkerActiveJobsSection'
import JobFeedPage from './pages/worker/JobFeedPage'
import PostJobPage from './pages/employer/PostJobPage'
import ChatPage from './pages/worker/wokerChatPage'
import WorkerInvoiceDetails from './pages/worker/WorkerInvoiceDetails'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/AdminUserManagement'
import AdminJobOversight from './pages/admin/AdminJobOversight'
import AdminFinancials from './pages/admin/AdminFinancials'
import WorkerFinancials from './pages/worker/WorkerFinancials'
import EmployerPayments from './pages/employer/EmployerPayments'
import { initAuth } from './redux/slice/authSlice'
import { useNotificationSocket } from './hooks/useNotificationSocket'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css'

function App() {

  const { authInitialized, user, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    // Only dispatch if we haven't tried to initialize yet
    if (!authInitialized) {
      dispatch(initAuth());
    }
  }, [dispatch, authInitialized]);

  // Only connect the WebSocket AFTER auth has finished initializing
  // This prevents the race condition where userId is undefined on first render
  const userId = authInitialized ? user?.id : null;
  useNotificationSocket(userId);

  const location = useLocation();
  const hideAIPaths = ['/', '/login', '/role', '/resetPassword'];
  const isAIHidden = hideAIPaths.includes(location.pathname) || location.pathname.startsWith('/register');

  return (
    <>
    {!isAIHidden && user && role !== "admin" && <HustlrAIAssistant/>}
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
            <Route path="/worker/job-feed" element={<JobFeedPage />} />
            <Route path="/worker/job-detail/:jobId" element={<WorkerInvoiceDetails />} />
            <Route path="/worker/payouts" element={<WorkerFinancials />} />
          </Route>
        </Route>

        {/* Employer */}
        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="/employer/profile-setup" element={<EmployerProfileSetup />} />
          <Route element={<EmployerLayout />}>
            <Route path="/employer/dashboard" element={<EmployerDash />} />
            <Route path="/employer/profile" element={<EmployerProfileSection />} />
            <Route path="/employer/works" element={<EmployerWorks />} />
            <Route path="/employer/works/requests" element={<EmployerWorkRequests />} />
            <Route path="/employer/received-requests" element={<EmployerReceivedRequestsPage />} />
            <Route path="/employer/my-posts" element={<EmployerMyPosts />} />
            <Route path="/employer/messages" element={<EmployerChatPage />} />
            <Route path="/employer/invoice/:jobId" element={<InvoiceDetails />} />
            <Route path="/employer/payments" element={<EmployerPayments />} />
          </Route>
          <Route path="/employer/post-job" element={<PostJobPage />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="jobs" element={<AdminJobOversight />} />
            <Route path="financials" element={<AdminFinancials />} />
          </Route>
        </Route>

      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
