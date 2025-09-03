import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/authContexts';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from './unauthorized/Unauthorized';

import LandingPage from './Landing_page/Landing';
import Em_register from './employer/Em_register';
import Em_dashboard from './employer/Em_dashboard';
import Em_jobpost from './employer/Em_jobpost';
import Seek_register from './Seeker_dashboard/Seek_register';
import SK_loadPost from './Seeker_dashboard/SK_loadPost';
import Login from './Login_page/Login';
import Sk_dashboard from './Seeker_dashboard/Sk_dashboard';
import SeekerHomeWrapper from './Seeker_dashboard/SeekerHomeWrapper';
import Em_profile from './employer/Em_profile';
import Admin_dashboard from './Admin/Admin_dashboard';
import Manage_post from './Admin/Manage_post';
import Admin_content from './Admin/Admin_content';
import NotificationCenter from './employer/NotificationCenter';
import Applied_job from './Seeker_dashboard/Applied_job';
import View_appications from './employer/View_appications';
import Manage_jobSeekers from './Admin/Manage_jobSeekers';
import Manage_Companies from './Admin/Manage_Companies';
import SK_profile from './Seeker_dashboard/Sk_profile';
import Notifications from './Seeker_dashboard/Notifications';
import LoginRedirect from './contexts/redirect';
import ADNotificationCenter from './Admin/NotificationCenter';
import 'boxicons';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginRedirect><LandingPage /></LoginRedirect>} />
          <Route path="/Employer_register" element={<Em_register />} />
          <Route path="/Seeker_register" element={<Seek_register />} />
          <Route path="/User_login" element={<LoginRedirect> <Login /> </LoginRedirect>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Job Seeker Protected Routes */}
          <Route 
            path="/jobSeeker" 
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <Sk_dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to = "dashboard" replace />} />
            <Route path="dashboard" element={<SeekerHomeWrapper />} />
            <Route path="dashboard/jobVacancies" element={<SK_loadPost />} />
            <Route path="dashboard/applied" element={<Applied_job />} />
            <Route path="dashboard/profile" element={<SK_profile />} />
            <Route path="dashboard/notifications" element={<Notifications />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin_dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Admin_content />} />
            <Route path="dashboard/managePost" element={<Manage_post />} />
            <Route path="dashboard/manageJobseekers" element={<Manage_jobSeekers />} />
            <Route path="dashboard/manageEmployer" element={<Manage_Companies />} />
            <Route path="dashboard/notifications" element={<ADNotificationCenter/>} />
          </Route>

          {/* Employer Protected Routes */}
          <Route 
            path="/employer" 
            element={
              <ProtectedRoute requiredRole="employer">
                <Em_dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Em_jobpost />} />
            <Route path="dashboard/viewAppications" element={<View_appications />} />
            <Route path="dashboard/profile" element={<Em_profile />} />
            <Route path="dashboard/notifications" element={<NotificationCenter />} />
          </Route>

          
           {<Route path="*" element={<Navigate to="/" replace />} />  }
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;