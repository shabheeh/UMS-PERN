import React, { useRef, useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { validateMail, validatePassword } from '../../utils/inputValidations';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInterceptor';
import { Toaster, toast } from 'react-hot-toast';


const SignUp: React.FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailLabel, setEmailLabel] = useState('Email')
  const [passwordLabel, setPasswordLabel] = useState('Password')
  const [loading, setLoading] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(!validateMail(email)) {
      emailRef.current?.focus()
      return setEmailLabel('Please Enter Valid Email')
    }else {
      setEmailLabel('Email')
    }


    if(!validatePassword(password)) {
        passwordRef.current?.focus()
        return setPasswordLabel('Please Enter Valid Password')
    }else {
        setPasswordLabel('Password')
    }
    
    
      setLoading(true)
      axios.post('/signup', {email, password})
      .then((res) => {
        setLoading(false)
        toast.success(res.data.message)
        navigate('/signin')
       

      }).catch(err => {
        setLoading(false)
        console.log('error while sign up', err)
        if(err.response && err.response.status === 400) {
          toast(err.response.data.message,
            {
              icon: '⚠',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
          );
        }
      })
    
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Toaster />
      <div className="w-full max-w-[390px] space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-[32px] font-semibold text-gray-900">Sign Up</h1>
          <p className="text-gray-500 text-lg">
            Enter your email and password to sign up
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label 
          className={`block text-sm font-medium ${emailLabel === 'Email' ?  'text-black' : 'text-red-500'}`}>
              {emailLabel}
            </label>
            <input
            ref={emailRef}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              className={`w-full rounded-md border border-gray-300 px-4 py-3 text-gray-500 focus:outline-none focus:ring-1 ${emailLabel === 'Email' ? 'focus:ring-gray-800' : 'focus:ring-red-500'}`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-sm font-medium ${passwordLabel === 'Password' ?  'text-black' : 'text-red-500'}`}>
              {passwordLabel}
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className={`w-full rounded-md border border-gray-300 px-4 py-3 text-gray-500 focus:outline-none focus:ring-1 ${passwordLabel === 'Password' ? 'focus:ring-gray-800' : 'focus:ring-red-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <Eye className="h-5 w-5 text-gray-400" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
                
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-base font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {loading ?<BeatLoader size={10} color="#ffffff" /> : 'SING UP'  }
           
          </button> 
          
            <div className="text-center text-gray-500">
            Already have Account?{' '}
            <Link 
                to={'/signin'} 
                className="font-semibold text-gray-900 hover:underline cursor-pointer"
            >
                Sign In
            </Link>
            </div>

          
        </form>
      </div>
    </div>
  );
};

export default SignUp;

