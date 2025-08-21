// components/FeatureHighlights.jsx
import React from 'react';
import { Truck, Sparkles, ShieldCheck, RefreshCcw, Package, PhoneCall} from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-10 h-10 text-gray-600" />,
    title: "Free Shipping",
    desc: "Enjoy free delivery on all orders above ₹999.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-gray-600" />,
    title: "Exclusive Launch Offers",
    desc: "Grab early-bird discounts and members-only deals.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-gray-600" />,
    title: "Secure Payments",
    desc: "Your transactions are encrypted and safe with us.",
  },
  {
    icon: <RefreshCcw className="w-10 h-10 text-gray-600" />,
    title: "Cancel Policy",
    desc: "Within 48 hours user can cacel their order",
  },
  {
    icon: <Package className="w-10 h-10 text-gray-600" />,
    title: "Fast Delivery",
    desc: "Receive your orders in 2-4 business days, guaranteed.",
  },
  {
    icon: <PhoneCall className="w-10 h-10 text-gray-600" />,
    title: "24/7 Support",
    desc: "Got a question? We're always here to help you out.",
  },
];


const FeatureHighlights = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">Our Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="group bg-gray-50 p-8 rounded-3xl shadow-md hover:shadow-xl hover:bg-white transition duration-300 ease-in-out text-center"
            >
              <div className="flex justify-center mb-5">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">{item.title}</h3>
              <p className="text-gray-600 group-hover:text-gray-800">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
