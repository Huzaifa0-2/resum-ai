// // src/components/Navbar.js
// import Link from "next/link";
// import { useUser, UserButton } from "@clerk/nextjs";

// export default function Navbar() {
//   const { isLoaded, isSignedIn, user } = useUser();

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-xl font-bold text-blue-600">
//               Resume Analyzer
//             </Link>
//           </div>

//           {/* User Section */}
//           <div className="flex items-center space-x-4">
//             {!isLoaded ? (
//               <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
//             ) : isSignedIn ? (
//               <div className="flex items-center space-x-3">
//                 <div className="hidden md:block text-right">
//                   <p className="text-sm font-medium text-gray-900">
//                     {user.firstName || user.username || "User"}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {user.primaryEmailAddress?.emailAddress}
//                   </p>
//                 </div>
//                 <UserButton afterSignOutUrl="/" />
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link
//                   href="/auth/sign-in"
//                   className="px-4 py-2 text-gray-700 hover:text-blue-600"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   href="/auth/sign-up"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



// src/components/Navbar.js
import { useState, useEffect } from 'react';
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Brain, Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollPosition > 50 ? 'bg-black/80 backdrop-blur-lg border-b border-cyan-500/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ResumAI
              </span>
            </Link>
          </div>

          {/* Desktop Menu - Only show on landing page */}
          {!isSignedIn && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">Pricing</a>
            </div>
          )}

          {/* User/Auth Section */}
          <div className="flex items-center space-x-4">
            {!isLoaded ? (
              <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-white">
                    {user.firstName || user.username || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <div className="">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonAvatarBox: "w-10 h-10"
                      }
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/auth/sign-in"
                    className="px-4 py-2 rounded-lg border border-cyan-500/30 text-gray-300 hover:bg-cyan-500/10 hover:text-white transition-all hover:border-cyan-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center space-x-2 text-white"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Sign Up Free</span>
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only show for non-signed in users */}
        {isMenuOpen && !isSignedIn && (
          <div className="md:hidden mt-4 pb-4 space-y-4 bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-cyan-500/20">
            <a 
              href="#features" 
              className="block text-gray-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block text-gray-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="block text-gray-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="block text-gray-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-4 border-t border-gray-700 space-y-3">
              <Link 
                href="/auth/sign-in" 
                className="block text-center py-2 rounded-lg border border-cyan-500/30 text-gray-300 hover:bg-cyan-500/10 hover:text-white transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="block text-center py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}