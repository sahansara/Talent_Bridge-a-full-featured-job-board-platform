# 💼 Multirole Job Board Platform  (Talent Bridge )

Welcome to the **Multirole Job Board Platform**, a modern full-stack web application built to streamline the job recruitment process. This platform allows seamless interaction between **Job Seekers**, **Employers**, and **Admins** with role-based access, CV handling, job posting, application management, and real-time notifications — all in one responsive and user-friendly interface.

This project was designed to simulate how real-world hiring platforms like **LinkedIn**, **Indeed**, and **Glassdoor** work, providing a highly structured backend and an intuitive frontend for each user type.

Whether you're looking for your next job opportunity, want to hire the best talent, or need to manage the platform from an admin point of view — this system covers it all.

---


## 🚀 Project Introduction

This platform was designed to streamline the recruitment process across various roles with role-based access control, real-time application tracking, and intelligent categorization. Employers can manage job listings and view applications. Job seekers can apply for jobs quickly using pre-uploaded CVs. Admins ensure quality and control by reviewing every job post before publishing.

---


## 🧑‍💼 User Roles

### 1. **Job Seeker**
- Register/Login with email & upload CV
- Browse jobs filtered by type, location, salary, and category
- One-click job apply (auto-submits uploaded CV)
- See confirmation popup before applying
- View application history & statuses
- Receive notifications for interview calls, rejections, or approvals

### 2. **Employer**
- Register/Login with company details
- Post new job listings (go through admin approval)
- Manage posted jobs & track application count
- View each application with candidate profile, CV preview, and email
- Accept, Reject, or Invite candidates to interview
- Dashboard for monitoring hiring progress

### 3. **Admin**
- Secure admin login
- View, approve or reject job listings
- Manage users: block/delete job seekers or employers
- Send global notifications or announcements
- View full stats: number of users, jobs, pending posts, and active employers

---

## 🌟 Key Features

- 🔐 Role-based access control with JWT
- 📤 CV upload & preview
- 📝 Admin-controlled job post approval
- 🧠 Smart auto-categorization for jobs/applications
- 🔍 Search bar & filter tools (by job type, location, status)
- 📬 Real-time notification system
- 🗂 Group applications by job post
- 📊 Dashboards for each user role
- 📥 Job seeker confirmation popup before applying
- 📅 "Applied At" & "Updated At" tracking

---

## 🧩 Bonus Smart Features

- Auto-group applications under related job post titles
- Dynamic category tags based on job types (e.g., Full-time, Internship, Remote)
- Notification center with timestamps
- Employer dashboard stats: number of posts, applicants, shortlists
- Job seeker alert on application action (approve/reject/interview)
- Admin overview panel for global activity monitoring

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Lucide & Boxicons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for Authentication
- Multer for File Uploads (CVs, profile images)
- Nodemailer (optional for email-based notification)

---

## 🛠️ Setup Instructions

### 1. Setup Backend
```bash
cd server
npm install
 ```
2.Create a .env file with:  

      PORT=5000 <br>
      MONGO_URI=your_mongodb_connection 
      JWT_SECRET=your_jwt_secret 
   
3.Run backend:  

       npm run dev 
4. Setup Frontend 
      ```bash
      cd ../frontend 
      npm install 
      npm start 

Frontend runs on http://localhost:3000 <br>


#### ✅ 2. Author Links



```markdown
## 🧑‍🎓 Author

👨‍💻 **Sahansara** — Full Stack Developer  
[LinkedIn](https://linkedin.com/in/widane-vihaga12/ • [GitHub](https://github.com/sahansara)

