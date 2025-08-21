// components/Testimonials.jsx
import React from 'react';

const testimonials = [
  {
    name: "Ritika Sharma",
    location: "Delhi, India",
    quote: "Amazing quality and fast delivery! This has become my go-to store.",
  },
  {
    name: "Aarav Mehta",
    location: "Mumbai, India",
    quote: "Really impressed with the fit and design. Will definitely order again!",
  },
  {
    name: "Neha Reddy",
    location: "Hyderabad, India",
    quote: "Great customer service and super comfy styles. Highly recommended!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((review, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-6 rounded-3xl shadow hover:shadow-lg transition duration-300"
            >
              <p className="text-gray-700 italic mb-4">“{review.quote}”</p>
              <div className="text-indigo-600 font-semibold">{review.name}</div>
              <div className="text-sm text-gray-500">{review.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
