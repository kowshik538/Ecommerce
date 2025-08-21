import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    backendUrl,
  } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setUserProfile(null);
  };

  // Fetch user profile when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token }
      });
      if (response.data.success) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : 'auto';
  }, [visible]);

  return (
    <>
      {/* Navbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-1 px-4 sm:px-8 font-medium">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={assets.logo3} className="w-12 sm:w-16" alt="Logo" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
          {['/', '/collection', '/about', '/contact'].map((path, idx) => (
            <NavLink
              key={idx}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 hover:text-black ${
                  isActive ? 'font-semibold text-black' : ''
                }`
              }
            >
              <p>{path === '/' ? 'HOME' : path.replace('/', '').toUpperCase()}</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-5 sm:gap-6">
          <img
            onClick={() => {
              setShowSearch(true);
              navigate('/collection');
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search"
          />

          {/* Profile + Dropdown */}
          <div className="group relative">
            {token && userProfile ? (
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                  {userProfile.profilePhoto ? (
                    <img
                      src={userProfile.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm text-gray-500">👤</span>
                    </div>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userProfile.name}
                </span>
              </div>
            ) : (
              <img
                onClick={() => navigate('/login')}
                className="w-5 cursor-pointer"
                src={assets.profile_icon}
                alt="Profile"
              />
            )}
            
            {token && (
              <div className="hidden group-hover:block absolute right-0 pt-4">
                <div className="flex flex-col gap-2 w-56 py-3 px-4 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-lg">
                  {userProfile && (
                    <div className="border-b border-gray-100 pb-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {userProfile.profilePhoto ? (
                            <img
                              src={userProfile.profilePhoto}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                              <span className="text-sm text-white font-bold">
                                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '👤'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{userProfile.name}</p>
                          <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black text-sm py-1">
                    👤 Profile Settings
                  </p>
                  <p
                    onClick={() => navigate('/orders')}
                    className="cursor-pointer hover:text-black text-sm py-1"
                  >
                    📦 My Orders
                  </p>
                  <p
                    onClick={() => navigate('/wallet')}
                    className="cursor-pointer hover:text-black text-sm py-1"
                  >
                    💰 My Wallet
                  </p>
                  <hr className="border-gray-100" />
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-red-600 text-sm py-1"
                  >
                    🚪 Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute -right-1 -bottom-1 w-4 h-4 text-center leading-4 bg-black text-white rounded-full text-[10px] font-semibold">
              {getCartCount()}
            </p>
          </Link>

          {/* Mobile Menu Button */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setVisible(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full z-50 backdrop-blur-md bg-white/95 transform transition-transform duration-300 ease-in-out ${
          visible ? 'translate-x-0 w-[75%] max-w-xs shadow-lg' : 'translate-x-full w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col text-gray-700 h-full overflow-y-auto">
          {/* Back Button */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-gray-50"
          >
            <img
              className="h-2 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p className="text-sm">Back</p>
          </div>

          {/* User Profile Section */}
          {token && userProfile && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
                  {userProfile.profilePhoto ? (
                    <img
                      src={userProfile.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ${userProfile.profilePhoto ? 'hidden' : ''}`}>
                    <span className="text-2xl text-white font-bold">
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '👤'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-lg truncate">{userProfile.name}</p>
                  <p className="text-sm text-gray-600 truncate">{userProfile.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          {[
            { path: '/', label: 'HOME', icon: '🏠' },
            { path: '/collection', label: 'COLLECTION', icon: '👕' },
            { path: '/about', label: 'ABOUT', icon: 'ℹ️' },
            { path: '/contact', label: 'CONTACT', icon: '��' }
          ].map((item, idx) => (
            <NavLink
              key={idx}
              onClick={() => setVisible(false)}
              to={item.path}
              className={({ isActive }) =>
                `py-4 px-6 border-b text-sm font-medium flex items-center gap-3 transition-colors ${
                  isActive ? 'bg-gray-50 text-gray-700 border-l-4 border-gray-500' : 'hover:bg-gray-50'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {/* Auth Links */}
          {token && (
            <div className="flex flex-col py-2">
              <button
                onClick={() => {
                  setVisible(false);
                  navigate('/profile');
                }}
                className="py-3 px-6 text-left hover:bg-gray-100 border-b text-sm flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">👤</span>
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setVisible(false);
                  navigate('/orders');
                }}
                className="py-3 px-6 text-left hover:bg-gray-100 border-b text-sm flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">📦</span>
                My Orders
              </button>
              <button
                onClick={() => {
                  setVisible(false);
                  navigate('/wallet');
                }}
                className="py-3 px-6 text-left hover:bg-gray-100 border-b text-sm flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">💰</span>
                My Wallet
              </button>
              <button
                onClick={logout}
                className="py-3 px-6 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">🚪</span>
                Logout
              </button>
            </div>
          )}

          {/* Login Link for non-authenticated users */}
          {!token && (
            <div className="mt-auto p-4 border-t">
              <button
                onClick={() => {
                  setVisible(false);
                  navigate('/login');
                }}
                className="w-full py-3 px-6 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">🔐</span>
                Login / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
