import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';


const Navbar = () => {
    const Navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn,name } = useAuth();
 

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        Navigate('/login');
    };



    return (
        <nav className="bg-slate-100 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="./Manoj_C.png" alt="" className="w-12 h-12" />
                            <span className="text-lg font-bold">Scan Me App</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Link to="/" className="font-semibold px-4 space-x-2">
                                    Home
                                </Link>
                                <Link to="/history" className="font-semibold px-4 space-x-2">
                                    History
                                </Link>
                                <Link to="/contact" className="font-semibold px-4 space-x-2">
                                    Contact
                                </Link>
                            </>
                        ) : (
                            <div className="flex space-x-6">
                                <div className="text-blue-600">
                                    <Link to="/login">Login</Link>
                                </div>
                                <div className="text-blue-600">
                                    <Link to="/signup">Signup</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden md:none flex items-center">
                        <button className="text-gray-600">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    {isLoggedIn && (
                        <div className="md:flex space-x-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">{name}</span>
                                <button
                                    className="text-red-600 text-sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
