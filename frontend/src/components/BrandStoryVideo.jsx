import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrandStoryVideo = () => {
  const [videoSettings, setVideoSettings] = useState({
    videoUrl: "https://www.youtube.com/embed/7m16dFI1AF8?si=BArkMckzpumxU50k",
    title: "Our Story in 60 Seconds",
    description: "Discover the passion, purpose, and people behind our brand. We believe in making fashion sustainable, inclusive, and stylish for all.",
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  const fetchVideoSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/video/video-settings`);
      if (response.data.success) {
        setVideoSettings(response.data.settings);
      }
    } catch (error) {
      console.log('Error fetching video settings:', error);
      // Keep default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoSettings();
  }, []);

  // Don't render if video is not active or still loading
  if (loading || !videoSettings.isActive) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{videoSettings.title}</h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          {videoSettings.description}
        </p>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-2xl">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoSettings.videoUrl}
            title="Brand Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default BrandStoryVideo;
