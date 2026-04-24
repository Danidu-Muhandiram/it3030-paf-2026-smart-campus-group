import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Settings, CheckCircle2, Building2, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { authService } from '../authService';
import { useAuth } from '../AuthContext';
import { getPasswordStrength, validateRegisterForm } from '../validators/authValidation';

export const RegisterPage = () => {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        universityId: '',
        password: '',
        confirmPassword: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const { status, refreshUser } = useAuth();
    const navigate = useNavigate();
    // Keep behavior consistent with 
    // login page for post-OAuth redirect.
    const hasStartedLoginRef = useRef(false);

    useEffect(() => {
        if (status === 'authenticated' && hasStartedLoginRef.current) {
            navigate('/dashboard', { replace: true });
        }
    }, [status, navigate]);

    useEffect(() => {
        setFieldErrors(validateRegisterForm(formData));
    }, [formData]);

    const passwordStrength = getPasswordStrength(formData.password);
    const isFormValid = Object.keys(fieldErrors).length === 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
        }
    };

    const handleGoogleLogin = () => {
        setIsRedirecting(true);
        setLoginError('');
        // Mark user intent just before leaving page for OAuth.
        hasStartedLoginRef.current = true;
        try {
            authService.startGoogleLogin();
        } catch (err) {
            setIsRedirecting(false);
            setLoginError('Unable to start Google login. Please try again.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRegisterError('');
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);
        setRegisterError('');

        const currentErrors = validateRegisterForm(formData);
        setFieldErrors(currentErrors);
        if (Object.keys(currentErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.register(formData);
            await refreshUser();
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const payload = err?.response?.data;
            if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
                if (typeof payload.message === 'string') {
                    setRegisterError(payload.message);
                } else {
                    setFieldErrors((prev) => ({ ...prev, ...payload }));
                    setRegisterError('Please fix highlighted fields.');
                }
            } else {
                setRegisterError('Unable to create account. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-bg-main flex flex-col md:flex-row font-sans">

            {/* Left section */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary text-white p-8 lg:p-12 relative overflow-hidden">

                {/* Background effects */}
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-700/60 rounded-full blur-[90px] z-0"
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -40, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-700/50 rounded-full blur-[110px] z-0"
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                    className="absolute inset-0 z-[1] opacity-30 mix-blend-overlay"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)',
                        backgroundSize: '24px 24px',
                        maskImage: 'linear-gradient(to bottom, white 60%, transparent 100%)'
                    }}
                ></div>

                <div className="relative z-10 flex flex-col h-full">

                    {/* Top logo & navigation */}
                    <div className="mb-8 w-full flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            Apex Campus
                        </Link>

                        <Link to="/" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center transition-colors shrink-0">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                    </div>

                    {/* Main text content with stagger animation */}
                    <motion.div
                        className="flex-grow flex flex-col justify-center max-w-lg"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.span variants={itemVariants} className="py-1.5 px-3.5 rounded-full bg-blue-800/40 border border-blue-600/50 text-blue-200 text-[11px] uppercase tracking-wider font-bold mb-6 w-max shadow-[0_0_20px_rgba(37,99,235,0.2)] backdrop-blur-md">
                            Join the Network
                        </motion.span>

                        <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-extrabold mb-6 leading-[1.15] tracking-tight">
                            Streamline your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-400">campus experience</span> today.
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-blue-100/90 text-[15px] lg:text-base mb-8 leading-relaxed font-light">
                            Join the Apex smart campus hub to seamlessly manage facilities, bookings, and operations all in one unified, intelligent platform.
                        </motion.p>

                        {/* Feature list */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="group flex items-start gap-4 text-blue-100 transition-all hover:-translate-y-1 hover:bg-white/5 p-3 -ml-3 rounded-2xl cursor-default border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md flex items-center justify-center border border-blue-500/20 transition-all duration-300 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mt-0.5 text-base group-hover:text-blue-100 transition-colors">Real-time Bookings</h4>
                                    <p className="text-sm text-blue-200/70 mt-1 leading-relaxed">Reserve facilities instantly with our live availability calendar and streamlined interface.</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-4 text-blue-100 transition-all hover:-translate-y-1 hover:bg-white/5 p-3 -ml-3 rounded-2xl cursor-default border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md flex items-center justify-center border border-blue-500/20 transition-all duration-300 shrink-0">
                                    <Settings className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mt-0.5 text-base group-hover:text-blue-100 transition-colors">Instant Operations requests</h4>
                                    <p className="text-sm text-blue-200/70 mt-1 leading-relaxed">Report issues, track maintenance progress, and receive automated status updates.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className="mt-auto text-blue-300/60 text-[13px]">
                        © 2026 Apex Smart Campus Operations Hub
                    </div>
                </div>
            </div>

            {/* Right section - form */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto flex flex-col justify-start md:justify-center items-center py-4 px-4 md:py-2 relative">

                {/* Mobile header view & navigation */}
                <div className="md:hidden w-full flex items-center justify-between mb-5 px-2 border-b border-gray-100 pb-3">
                    <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        Smart Campus
                    </Link>

                    <Link to="/" className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm shrink-0">
                        <ArrowLeft className="w-5 h-5 text-text-muted" />
                    </Link>
                </div>

                <div className="w-full max-w-[390px] my-auto">
                    <div className="mb-3 text-center md:text-left">
                        <h1 className="text-xl md:text-2xl font-bold text-text-main mb-1">Create an account</h1>
                        <p className="text-text-muted text-sm">
                            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in here</Link>
                        </p>
                    </div>

                    <form className="space-y-2.5" onSubmit={handleRegister}>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="space-y-1 w-full">
                                <label className="text-sm font-semibold text-text-muted">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Harsha"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                                />
                                {(submitAttempted || formData.firstName) && fieldErrors.firstName && (
                                    <p className="text-xs text-red-600">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div className="space-y-1 w-full">
                                <label className="text-sm font-semibold text-text-muted">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Fernando"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                                />
                                {(submitAttempted || formData.lastName) && fieldErrors.lastName && (
                                    <p className="text-xs text-red-600">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-text-muted">University Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="idnumber@my.apex.lk"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                            />
                            {(submitAttempted || formData.email) && fieldErrors.email && (
                                <p className="text-xs text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-text-muted">ID Number</label>
                            <input
                                type="text"
                                name="universityId"
                                placeholder="e.g. IT2612345"
                                value={formData.universityId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                            />
                            {(submitAttempted || formData.universityId) && fieldErrors.universityId && (
                                <p className="text-xs text-red-600">{fieldErrors.universityId}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-text-muted">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                            />
                            {formData.password && (
                                <p className="text-[12px] text-text-light mt-1">Strength: {passwordStrength}</p>
                            )}
                            {(submitAttempted || formData.password) && fieldErrors.password && (
                                <p className="text-xs text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-text-muted">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                            />
                            {(submitAttempted || formData.confirmPassword) && fieldErrors.confirmPassword && (
                                <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex items-start gap-2 pt-1">
                            <div className="flex items-center h-4 mt-0.5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary cursor-pointer"
                                />
                            </div>
                            <label htmlFor="terms" className="text-sm text-text-muted leading-5 cursor-pointer">
                                I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isFormValid || !agreedToTerms}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-4 rounded-lg mt-2.5 flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                            <Rocket className="w-4 h-4" />
                        </button>
                        {registerError && (
                            <p className="text-xs text-red-600 pt-1" role="alert">{registerError}</p>
                        )}

                        <div className="relative mt-3 mb-0.5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs font-medium">
                                <span className="bg-white px-4 text-text-muted">Or sign up with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-label="Sign in with Google"
                            onClick={handleGoogleLogin}
                            disabled={isRedirecting}
                            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-text-main font-semibold py-2.5 px-4 rounded-lg flex justify-center items-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FcGoogle className="w-5 h-5" />
                            {isRedirecting ? 'Redirecting...' : 'Google'}
                        </button>
                        {loginError && (
                            <p className="text-xs text-red-600 pt-1.5" role="alert">{loginError}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};
