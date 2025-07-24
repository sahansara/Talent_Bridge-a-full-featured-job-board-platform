import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Landing_page/Landing';
import Em_register from './company/Em_register';
import Em_dashboard from './company/Em_dashboard';
import Em_jobpost from './company/Em_jobpost';
import Seek_register from './Seeker_dashboard/Seek_register';
import SK_loadPost from './Seeker_dashboard/SK_loadPost';
import Login from './Login_page/Login';
import Sk_dashboard from './Seeker_dashboard/Sk_dashboard';
import SeekerHomeWrapper from './Seeker_dashboard/SeekerHomeWrapper';
import Em_profile from './company/Em_profile';
import Admin_dashboard from './Admin/Admin_dashboard';
import Manage_post from './Admin/Manage_post';
import Admin_content from './Admin/Admin_content';
import NotificationCenter from './company/NotificationCenter';
import Applied_job from './Seeker_dashboard/Applied_job';
import View_appications from './company/View_appications';
import Manage_jobSeekers from './Admin/Manage_jobSeekers';
import Manage_Companies from './Admin/Manage_Companies';
import 'boxicons';
import SK_profile from './Seeker_dashboard/Sk_profile';
import Notifications from './Seeker_dashboard/Notifications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/Employer_register" element={<Em_register />} />
        <Route path="/Seeker_register" element={<Seek_register />} />
        <Route path="/User_login" element={<Login />} />
        {/* <Route path="/Seeker_dashboard" element={<Sk_dashboard />} /> */}
        {/* <Route path="/Seeker_dashboard/Seeker_profile" element={<Sk_profile />} /> */}



        {/* job seeker  Nested Routes */}
        <Route path="/job-seeker/dashboard" element={<Sk_dashboard />}>
              <Route index element={<SeekerHomeWrapper />} />
              <Route path="job-posts" element={<SK_loadPost />} />
              <Route path="applied-jobs" element={<Applied_job />} />
              <Route path="profile" element={<SK_profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>


        {/* Admin Nested Routes */}
        <Route path="/admin" element={<Admin_dashboard />}>
          <Route index element={<Navigate to="dashboard" replace/>} />
          <Route path="dashboard" element={<Admin_content />} />
          <Route path="admin_dashboard/manage_post" element={<Manage_post />} />
          <Route path='admin_dashboard/manage_jobseekers' element={<Manage_jobSeekers/>} />
          <Route path='admin_dashboard/manage_companies' element={<Manage_Companies/>} />

          {/* You can add more nested admin routes here */}
        </Route>

        {/* Employer Nested Routes */}
        <Route path="/Employer_dashboard" element={<Em_dashboard />}>
          <Route index element={<Navigate to="Employer_jobpost" replace />} />
          <Route path="Employer_jobpost" element={<Em_jobpost />} />
          <Route path="View_appications" element={<View_appications />} />

          <Route path="Employer_profile" element={<Em_profile />} />
          <Route path="Notifications" element={<NotificationCenter />} />
          {/* You can add more nested employer routes here */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
