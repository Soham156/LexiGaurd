import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  console.log('Mobile menu open state:', open); // Debug log

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
            <Link to="/signin" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Sign In</Link>
            <Link to="/signup" className="ml-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-300 font-medium">Sign Up</Link>
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
          onClick={(e) => {
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
              <Link onClick={() => {
                console.log('Sign In link clicked');
                setOpen(false);
              }} to="/signin" className="py-4 px-6 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-medium shadow-lg text-center hover:shadow-xl transition-all duration-300">
                🔑 Sign In
              </Link>
              <Link onClick={() => {
                console.log('Sign Up link clicked');
                setOpen(false);
              }} to="/signup" className="py-4 px-6 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold shadow-lg text-center hover:shadow-xl transition-all duration-300">
                🚀 Sign Up
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
