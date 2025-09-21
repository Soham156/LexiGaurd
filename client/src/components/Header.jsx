import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { doSignOut } from '../firebase/auth';
import { Sun, Moon, User, LogOut } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();

  console.log('Mobile menu open state:', open); // Debug log
  console.log('User logged in:', userLoggedIn, 'Current user:', currentUser); // Debug log

  const handleSignOut = async () => {
    try {
      await doSignOut();
      setOpen(false); // Close mobile menu if open
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="w-full">
        <div className="w-full px-4 py-3 flex items-center justify-between bg-white/95 dark:bg-gray-900/95 shadow-lg">
          <Link to="/" className="font-bold text-lg md:text-xl tracking-tight flex items-center gap-2">
            <span className="inline-flex w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center text-white shadow-lg">LG</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">LexiGuard</span>
          </Link>

          <nav className="space-x-6 hidden sm:flex items-center">
            <Link to="/upload" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Upload</Link>
            <Link to="/dashboard" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Dashboard</Link>
            <a href="#about" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">About</a>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            
            {userLoggedIn ? (
              // Show user info and sign out when logged in
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              // Show sign in when not logged in
              <div className="flex items-center space-x-2">
                <Link to="/signin" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </Link>
              </div>
            )}
          </nav>

          <div className="sm:hidden flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button 
              aria-label="Open menu" 
              onClick={() => {
                console.log('Hamburger clicked, current state:', open);
                setOpen(true);
              }} 
              className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 z-[9999] backdrop-blur-sm"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
          onClick={() => {
            console.log('Backdrop clicked');
            setOpen(false);
          }}
        >
          <div 
            className="absolute right-0 top-0 w-80 max-w-[90vw] bg-white dark:bg-gray-900 h-full shadow-2xl overflow-y-auto"
            style={{ 
              position: 'absolute', 
              right: 0, 
              top: 0, 
              width: '320px', 
              maxWidth: '90vw',
              height: '100vh', 
              zIndex: 10000,
              backgroundColor: 'white',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => {
              console.log('Menu content clicked');
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700" style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
              <Link to="/" className="font-bold text-lg flex items-center gap-2" onClick={() => {
                console.log('Logo clicked in mobile menu');
                setOpen(false);
              }}>
                <span className="inline-flex w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center text-white shadow-lg">LG</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">LexiGuard</span>
              </Link>
              <button 
                aria-label="Close menu" 
                onClick={() => {
                  console.log('Close button clicked');
                  setOpen(false);
                }} 
                className="p-2 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:shadow-lg transition-all duration-300"
                style={{ padding: '8px', backgroundColor: '#6b7280', color: 'white', borderRadius: '12px', border: 'none' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-3 p-6" style={{ padding: '24px', backgroundColor: 'white' }}>
              <Link onClick={() => {
                console.log('Upload link clicked');
                setOpen(false);
              }} to="/upload" className="py-4 px-6 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium shadow-lg text-center hover:shadow-xl transition-all duration-300">
                📄 Upload Document
              </Link>
              <Link onClick={() => {
                console.log('Dashboard link clicked');
                setOpen(false);
              }} to="/dashboard" className="py-4 px-6 text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-medium shadow-lg text-center hover:shadow-xl transition-all duration-300">
                📊 Dashboard
              </Link>
              
              {userLoggedIn ? (
                // Show user info and sign out when logged in
                <>
                  <div className="py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-200">
                      <User className="w-5 h-5" />
                      <span className="font-medium">
                        {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {currentUser?.email}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      console.log('Sign Out clicked');
                      handleSignOut();
                    }} 
                    className="py-4 px-6 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-medium shadow-lg text-center hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>🚪 Sign Out</span>
                  </button>
                </>
              ) : (
                // Show sign in when not logged in
                <Link onClick={() => {
                  console.log('Sign In with Google clicked');
                  setOpen(false);
                }} to="/signin" className="py-4 px-6 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold shadow-lg text-center hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
