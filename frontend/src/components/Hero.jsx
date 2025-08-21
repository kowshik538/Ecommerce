import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/hero/all');
        setSlides(response.data.data || []);
      } catch (error) {
        console.error('Error fetching hero slides:', error);
      }
    };

    fetchSlides();
  }, []);

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col lg:flex-row bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow-lg rounded-lg overflow-hidden">
              {/* Left Content */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="text-gray-800 space-y-6 max-w-lg">
                  {slide.title && (
                    <h1 className="text-4xl lg:text-6xl font-serif font-bold tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm font-medium tracking-wider uppercase text-gray-500">
                      {slide.subtitle}
                    </p>
                  )}
                  
                  <div>
                    <button
                      onClick={() => navigate('/collection')}
                      className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                    >
                      Get it !
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Image - Fixed Size Container */}
              {slide.image && (
                <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <img
                      src={`http://localhost:4000/uploads/${slide.image}`}
                      alt={slide.title || 'Hero Slide'}
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
                      style={{
                        minHeight: '400px',
                        maxHeight: '500px'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Pagination Dots Styling */}
      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #aaa;
            opacity: 0.8;
            transition: all 0.3s ease;
            width: 12px;
            height: 12px;
          }
          .swiper-pagination-bullet-active {
            background-color: #000;
            transform: scale(1.3);
          }
          .swiper-pagination {
            bottom: 20px !important;
          }
        `}
      </style>
    </div>
  );
};

export default Hero;
