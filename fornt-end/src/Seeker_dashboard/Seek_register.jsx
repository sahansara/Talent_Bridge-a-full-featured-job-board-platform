import { useState, useEffect } from 'react';
import { User, Briefcase, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterComponents/RegisterForm';
import { colorThemes } from '../colorThemes/colorThemes';
import logo from '../assets/logo.png';
import registerApi from "../services/jobSeeker/register"
import Alert from '../notificationAlert/Alert';
import JS1 from '../assets/JS/JB1.jpeg';
import JS2 from '../assets/JS/JB2.jpeg';
import JS3 from '../assets/JS/JB3.jpeg';
import JS4 from '../assets/JS/JB4.jpeg';


const images = [
  JS1, JS2, JS3, JS4
];

const benefits = [
  { icon: <User className="w-5 h-5" />, title: 'Build Profile', desc: 'Showcase your skills' },
  { icon: <FileText className="w-5 h-5" />, title: 'Upload CV', desc: 'Share your experience' },
  { icon: <Shield className="w-5 h-5" />, title: 'Secure Platform', desc: 'Your data is safe' }
];

const SeekRegister = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('blue');
  const [currentImage, setCurrentImage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[notification,setNotification]=useState({type:'',message:''});

  const currentTheme = colorThemes[theme];
  
  const handleRegistration = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await registerApi.submitForm(formData);
       setNotification({
        type:'success',
        message:'Registration successful! Please check your email for verification.'
      })
          setTimeout(() => {
        navigate('/user_login'); 
      }, 1500);
    } catch (error) {
      setNotification({
        type:'error',
        message:error.response?.data?.message || 'Registration failed. Please try again.'
      })
    } finally {
      setIsSubmitting(false);
    }
  };
  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} relative overflow-hidden`}>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <Alert notification={notification} />
      </div>
        {/* Hero Image Background - Bottom Layer */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop" 
          alt="Modern office" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 'w-96 h-96', pos: '-top-48 -right-48', color: 'bg-blue-500', delay: '' },
          { size: 'w-80 h-80', pos: '-bottom-40 -left-40', color: 'bg-blue-400', delay: 'animation-delay-1000' },
          { size: 'w-64 h-64', pos: 'top-1/3 left-1/4', color: 'bg-blue-300', delay: 'animation-delay-2000' }
        ].map((circle, i) => (
          <div 
            key={i} 
            className={`absolute ${circle.pos} ${circle.size} ${circle.color} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${circle.delay}`}
          />
        ))}
      </div>


     

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* Left Visual Section */}
        <div className="flex flex-col items-center justify-center p-4 lg:p-6">
           {/* Logo Header */}
          <div className="flex items-center mb-4">
           < div className="flex items-center justify-center w-16 h-16 border-2 border-white rounded-full mr-2">
                          <img src={logo} alt="Logo" className="w-15 h-15" />
                        </div>
            <h1 className="text-5xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent py-2"> {/* Changed from text-4xl lg:text-5xl to text-3xl lg:text-4xl */}
              Talent Bridge
            </h1>
          </div>

          {/* Main Image with Overlay */}
            <div className="relative w-full max-w-xl mb-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              <img src={images[currentImage]} alt="JobBoard Platform" 
                className="w-full h-full  transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Image Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentImage ? `bg-white` : 'bg-white/40'
                  }`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Join as Job Seeker
              </span>
            </h2>
            <p className="text-lg text-blue-200 max-w-md">
              Create your profile, upload your CV, and connect with top employers on JobBoard
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold text-sm">{benefit.title}</h3>
                <p className="text-blue-200 text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-8 lg:p-12">
          <RegisterForm currentTheme={currentTheme} 
           onSubmit={handleRegistration}
           isSubmitting={isSubmitting}/>
        </div>
      </div>
    </div>
  );
};

export default SeekRegister;