import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="bg-white text-sm">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40">
        {/* Left Section */}
        <div>
          <img src={assets.logo3} className="mb-3 w-20" alt="Ordan Logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            <strong>Ordan is more than fashion — it's a movement.</strong><br />
            We believe style should be bold, inclusive, and sustainable. From timeless basics to statement pieces, every collection is crafted to empower self-expression and celebrate individuality. Our mission is to redefine everyday fashion with heart, purpose, and a commitment to quality you can trust.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link to="/" className="hover:text-black">Home</Link></li>
            <li><Link to="/collection" className="hover:text-black">Collections</Link></li>
            <li><Link to="/about" className="hover:text-black">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-black">Contact Us</Link></li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li>
              <a href="https://wa.me/918328051484" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600">
                <FaWhatsapp /> WhatsApp
              </a>
            </li>
            <li>
              <a href="mailto:contact@ordan.com" className="flex items-center gap-2 hover:text-red-500">
                <FaEnvelope /> Email
              </a>
            </li>
            <li className="flex gap-4 mt-4 text-xl text-gray-600">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600"><FaInstagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTwitter /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600"><FaYoutube /></a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-500">
          Copyright © 2025 <span className="text-black font-semibold">Ordan.com</span> – All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
