import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
        style={{ backgroundImage: `url(${assets.contact_img})` }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-20 lg:px-32 py-24 flex flex-col items-center justify-center min-h-screen">
        {/* Title */}
        <div className="text-center">
          {/* <Title text1="CONTACT" text2="US"/> */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-400 tracking-wide text-center relative inline-block after:block after:w-12 after:h-[3px] after:bg-black after:mx-auto after:mt-2">
  Contact Us
</h3>

          <p className="max-w-2xl mx-auto text-lg mt-4 text-gray-300">
            At Ordan, fashion is just the beginning — we exist to create bold identities. Get in touch, we’re just a click away.
          </p>
        </div>

        {/* Contact Glass Card */}
        <div className="mt-16 w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 animate-fade-in-down">
          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-2xl mt-1 text-white" />
            <div>
              <p className="text-white font-semibold">Visit Our Store</p>
              <p className="text-gray-300">
                54709 Willms Station, Suite 350<br />
                Washington, USA
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaPhoneAlt className="text-2xl mt-1 text-white" />
            <div>
              <p className="text-white font-semibold">Phone</p>
              <p className="text-gray-300">+91 8328051484</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaWhatsapp className="text-2xl mt-1 text-green-400" />
            <div>
              <p className="text-white font-semibold">WhatsApp</p>
              <a
                href="https://wa.me/918328051484"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:underline"
              >
                Chat with us anytime
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaEnvelope className="text-2xl mt-1 text-red-400" />
            <div>
              <p className="text-white font-semibold">Email</p>
              <a
                href="mailto:contact@Ordan.com"
                className="text-gray-300 hover:underline"
              >
                contact@Ordan.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
