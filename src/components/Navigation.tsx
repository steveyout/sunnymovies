/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Search, Bookmark, User, Sun, Moon, Film } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  watchlistCount: number;
  avatar: string;
}

export default function Navigation({
  currentView,
  onViewChange,
  theme,
  toggleTheme,
  watchlistCount,
  avatar
}: NavigationProps) {
  
  const navItems = [
    { view: 'home' as ViewType, label: 'Home', icon: Home },
    { view: 'search' as ViewType, label: 'Explore', icon: Search },
    { view: 'watchlist' as ViewType, label: 'My List', icon: Bookmark, badge: watchlistCount },
    { view: 'profile' as ViewType, label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* 1. Desktop & Tablet Top Navigation Banner */}
      <header className="hidden md:block sticky top-0 z-50 w-full backdrop-blur-md border-b bg-white/85 dark:bg-vibrant-panel-dark/85 transition-colors duration-300 border-zinc-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-102 select-none"
          >
            <div className="w-9 h-9 bg-vibrant-amber rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,184,0,0.5)]">
              <div className="w-4.5 h-4.5 border-[3px] border-white dark:border-vibrant-panel-dark rounded-full"></div>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">
              Sunny<span className="text-vibrant-amber">Movies</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentView === item.view || (item.view === 'home' && currentView === 'movie');
              return (
                <button
                  key={item.view}
                  onClick={() => onViewChange(item.view)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'text-vibrant-amber dark:text-vibrant-amber bg-vibrant-amber/10 dark:bg-vibrant-amber/10' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-3xs font-bold rounded-full bg-vibrant-amber text-zinc-950 leading-none">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="desktopNavActive"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-vibrant-amber"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility Toolbar */}
          <div className="flex items-center gap-4">
            {/* Quick theme toggler */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 bg-transparent cursor-pointer"
              aria-label="Toggle theme color"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Trigger */}
            <div 
              onClick={() => onViewChange('profile')}
              className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800 cursor-pointer group"
            >
              <img 
                src={avatar} 
                alt="Profile Avatar" 
                className="w-8 h-8 rounded-full border-2 border-vibrant-amber shadow-sm cursor-pointer object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <span className="hidden lg:block text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-vibrant-amber transition-colors">
                Me
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Mobile Persistent Action Indicator (Sticky Top for Small screens) */}
      <div className="md:hidden sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-vibrant-bg-dark/90 h-14 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between px-4">
        <div onClick={() => onViewChange('home')} className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-7.5 h-7.5 bg-vibrant-amber rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,184,0,0.5)]">
            <div className="w-3.5 h-3.5 border-2 border-white dark:border-vibrant-bg-dark rounded-full"></div>
          </div>
          <span className="text-base font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">
            Sunny<span className="text-vibrant-amber">Movies</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 active:bg-zinc-100 dark:active:bg-zinc-800 transition bg-transparent cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <img 
            onClick={() => onViewChange('profile')}
            src={avatar} 
            alt="Profile Avatar" 
            className="w-7 h-7 rounded-full border border-vibrant-amber object-cover active:scale-95 transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 3. Mobile Persistent Bottom Ergonomic Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-vibrant-bg-dark dark:via-vibrant-bg-dark/95 dark:to-transparent pointer-events-none">
        <nav className="w-full max-w-md mx-auto bg-zinc-900/95 dark:bg-vibrant-panel-dark/95 backdrop-blur-xl border border-zinc-200/20 dark:border-white/5 p-2 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentView === item.view || (item.view === 'home' && currentView === 'movie');
            return (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className="relative flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all bg-transparent cursor-pointer"
              >
                <div className="relative">
                  <IconComp 
                    className={`w-5.5 h-5.5 transition-all duration-300 ${
                      isActive 
                        ? 'text-vibrant-amber scale-110 drop-shadow-[0_0_10px_rgba(255,184,0,0.4)]' 
                        : 'text-zinc-400'
                    }`} 
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                <span className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-vibrant-amber font-bold' : 'text-zinc-400'
                }`}>
                  {item.label}
                </span>

                {isActive && (
                  <motion.div 
                    layoutId="mobileNavActiveDot"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-vibrant-amber"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
