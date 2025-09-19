import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="w-full px-4 py-4">
        <div className="max-w-7xl mx-auto rounded-xl p-3 flex items-center justify-between soft-card bg-white/95 dark:bg-gray-900/95 shadow-lg">
          <Link to="/" className="font-bold text-lg md:text-xl tracking-tight flex items-center gap-2">
            <span className="inline-flex w-8 h-8 rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 items-center justify-center text-white">LG</span>
            <span className="dark:text-white">LexiGuard</span>
          </Link>

          <nav className="space-x-6 hidden sm:flex items-center">
            <Link to="/upload" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Upload</Link>
            <Link to="/dashboard" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Dashboard</Link>
            <a href="#about" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">About</a>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-sky-50 dark:bg-gray-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Link to="/signin" className="text-sm text-slate-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Sign In</Link>
            <Link to="/signup" className="ml-2 px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-700 transition">Sign Up</Link>
          </nav>

          <div className="sm:hidden flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-sky-50 dark:bg-gray-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 rounded-md bg-white dark:bg-gray-800">
              <svg className="w-6 h-6 text-slate-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute right-0 top-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 h-full p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="font-bold text-lg text-slate-800 dark:text-white">LexiGuard</Link>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                <svg className="w-5 h-5 text-slate-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <Link onClick={() => setOpen(false)} to="/upload" className="py-2 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2">Upload</Link>
              <Link onClick={() => setOpen(false)} to="/dashboard" className="py-2 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2">Dashboard</Link>
              <a onClick={() => setOpen(false)} href="#about" className="py-2 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2">About</a>
              <Link onClick={() => setOpen(false)} to="/signin" className="py-2 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2">Sign In</Link>
              <Link onClick={() => setOpen(false)} to="/signup" className="py-2 font-semibold text-white bg-sky-600 rounded px-3 inline-block text-center">Sign Up</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
