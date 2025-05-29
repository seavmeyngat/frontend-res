import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-stone-950 text-white px-4 sm:px-6 lg:px-10 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto h-[80px] flex items-center justify-between py-4">
        {/* Logo and Restaurant Name */}
        <div className="flex items-center gap-3 text-white px-4 py-2 rounded-lg shadow-lg">
  <img
    src="/logo.png"
    alt="Logo"
    className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] object-contain"
  />
  <span className="text-[20px] sm:text-[24px] font-bold">LBTB Restaurant</span>
</div>


        <ul className="hidden lg:flex gap-10 text-[20px]">
          <li><Link to="/" className="hover:text-green-500">Home</Link></li>
          <li><Link to="/menu" className="hover:text-green-500">Menu</Link></li>
          <li><Link to="/gallery" className="hover:text-green-500">Gallery</Link></li>
          <li><Link to="/booking" className="hover:text-green-500">Booking</Link></li>
        </ul>

        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      
      {isMenuOpen && (
        <ul className="lg:hidden flex flex-col items-center gap-6 text-[18px] bg-black py-6">
          <li><Link to="/" className="hover:text-gray-300" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/menu" className="hover:text-gray-300" onClick={toggleMenu}>Menu</Link></li>
          <li><Link to="/gallery" className="hover:text-gray-300" onClick={toggleMenu}>Gallery</Link></li>
          <li><Link to="/booking" className="hover:text-gray-300" onClick={toggleMenu}>Booking</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
