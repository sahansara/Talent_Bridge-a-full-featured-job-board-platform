import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


function Landing() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Jobs />
      <About />
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">JobBoard </h1>
            {/* <img src="src/assets/15.png" alt="" /> */}
          </div>
          <div className="hidden md:flex space-x-10">
            <button 
              onClick={() => scrollToSection('jobs')}
              className="text-lg hover:text-blue-600 transition"
            >
              Jobs
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-lg hover:text-blue-600 transition"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-lg hover:text-blue-600 transition"
            >
              About
            </button>
          </div>
          <div>
            <button className="border-2 border-black rounded-lg px-4 py-2 text-lg hover:bg-gray-100 transition">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [userType, setUserType] = useState('Select user type');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userTypes = ['Job Seeker', 'Employer', 'Administrator'];

  return (
    <div className="pt-28 md:pt-40 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Welcome to Our Job Board Platform
      </h1>
      <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
        Find your next opportunity or manage job listings with ease.
      </p>
      <div className="max-w-md mx-auto">
        <div className="relative mb-4" ref={dropdownRef}>
          <button
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-left text-lg flex justify-between items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>I'm a {userType !== 'Select user type' ? userType.toLowerCase() : ''}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
              {userTypes.map((type) => (
                <div
                  key={type}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setUserType(type);
                    setDropdownOpen(false);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 text-lg font-medium hover:bg-blue-700 transition"
            onClick={() => {
              if (userType === 'Job Seeker') navigate('/Seeker_register');
              else if (userType === 'Employer') navigate('/Employer_register');
              else if (userType === 'Administrator') navigate('/User_login');
            }}
          >
          Get Started
        </button>

      </div>
    </div>
  );
}

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500"
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!image.url && image.title}
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

function Features() {
  const featureImages = [
    { url: 'src/assets/7.jpg', title: 'Advanced Job Search' },
    { url: 'src/assets/5.jpg', title: 'AI Resume Matching' },
    { url: 'src/assets/9.jpg', title: 'Interview Scheduling' },
    { url: 'src/assets/14.jpg', title: 'Real-time Notifications' }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImageSlider images={featureImages} />
          </div>
          <div className="space-y-6 md:pt-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold">Advanced Job Search</h3>
              <p className="mt-2 text-gray-600">Find the perfect job with our powerful search filters and AI-driven recommendations.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold">Smart Matching Algorithm</h3>
              <p className="mt-2 text-gray-600">Our system automatically matches your skills and experience with the most relevant opportunities.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold">Application Tracking</h3>
              <p className="mt-2 text-gray-600">Track all your applications in one place with real-time status updates.</p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-semibold">Company Insights</h3>
              <p className="mt-2 text-gray-600">Get valuable information about potential employers before applying.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Jobs() {
  const jobImages = [
    { url: 'src/assets/12.jpg', title: 'Software Development' },
    { url: 'src/assets/6.jpg', title: 'Marketing & Design' },
    { url: 'src/assets/13.jpg', title: 'Finance & Accounting' },
    { url: 'src/assets/11.jpg', title: 'Healthcare & Medical' }
  ];

  const jobs = [
    { title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$120k - $150k' },
    { title: 'Marketing Manager', company: 'BrandGrowth', location: 'New York, NY', salary: '$90k - $110k' },
    { title: 'Data Scientist', company: 'AnalyticsPro', location: 'San Francisco, CA', salary: '$130k - $160k' },
    { title: 'UX/UI Designer', company: 'DesignMasters', location: 'Austin, TX', salary: '$85k - $115k' }
  ];

  return (
    <section id="jobs" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <ImageSlider images={jobImages} />
          </div>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="mt-2 text-gray-600">
                  <p>{job.company} · {job.location}</p>
                  <p className="mt-1">{job.salary}</p>
                </div>
                <button className="mt-3 text-blue-600 font-medium hover:text-blue-800">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About JobBoard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center text-gray-500">
              <img src="src/assets/16.jpg" alt="future" />
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg">
              JobBoard was founded in 2020 with a simple mission: to connect talented individuals with great companies. We believe that finding the right job shouldn't be a full-time job itself.
            </p>
            <p className="text-lg">
              Our platform uses advanced technology and a human-centered approach to make the job search and recruitment process more efficient, transparent, and effective for everyone involved.
            </p>
            <p className="text-lg">
              With thousands of companies and job seekers trusting our platform, we're proud to have facilitated countless career moves and successful hires across various industries.
            </p>
            <div className="pt-2">
              <button className="text-blue-600 font-medium hover:text-blue-800">
                Learn more about our story →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;