// import React from 'react'
// import Title from '../components/Title'
// import { assets } from '../assets/assets'
// // import NewsletterBox from '../components/NewsletterBox'

// const About = () => {
//   return (
//     <div>

//       <div className='text-2xl text-center pt-8 border-t'>
//           <Title text1={'ABOUT'} text2={'US'} />
//       </div>

//       <div className='my-10 flex flex-col md:flex-row gap-16'>
//           <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
//           <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
//               <p>Ordan was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
//               <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
//               <b className='text-gray-800'>Our Mission</b>
//               <p>Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
//           </div>
//       </div>

//       <div className=' text-xl py-4'>
//           <Title text1={'WHY'} text2={'CHOOSE US'} />
//       </div>

//       <div className='flex flex-col md:flex-row text-sm mb-20'>
//           <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
//             <b>Quality Assurance:</b>
//             <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
//           </div>
//           <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
//             <b>Convenience:</b>
//             <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
//           </div>
//           <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
//             <b>Exceptional Customer Service:</b>
//             <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
//           </div>
//       </div>

//       {/* <NewsletterBox/> */}
      
//     </div>
//   )
// }

// export default About
import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="bg-gray-100 text-gray-800">

      {/* Hero Section with Background */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={assets.about_img} alt="about bg" className="absolute w-full h-full object-cover opacity-40" />
        <div className="relative z-10 text-center px-4">
          <h3 className="text-4xl md:text-5xl font-semibold tracking-wide mb-4 animate-fade-in">Welcome to <span className="text-black font-bold">Ordan</span></h3>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto animate-slide-up">
            Where style meets substance. We blend creativity, quality, and individuality into every collection to redefine fashion for the modern world.
          </p>
        </div>
      </div>

      {/* About Description */}
      <div className='text-center text-2xl pt-14'>
        <Title text1={'ABOUT'} text2={'ORDAN'} />
      </div>

      <div className='my-12 px-6 md:px-20 flex flex-col md:flex-row gap-16 items-center'>
        <div className='md:w-2/3 text-left space-y-6 text-gray-700 animate-fade-in'>
          <p>
            At <span className="font-semibold text-black">Ordan</span>, we don’t just follow trends — we create them. Our vision is built on bold self-expression, eco-conscious choices, and timeless aesthetics.
          </p>
          <p>
            Whether you're dressing for confidence, comfort, or both — our curated selections speak your language. Every design is a reflection of integrity, quality, and passion.
          </p>
          <p className="font-medium text-black text-lg">Crafted with Heart. Designed for Impact.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-center text-xl pt-8'>
        <Title text1={'WHY'} text2={'ORDAN?'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-20 mt-10 pb-20 text-sm'>
        <div className='bg-white shadow-md hover:shadow-xl transition-all rounded-xl p-8 space-y-4 text-left'>
          <h4 className='text-lg font-semibold text-black'>Quality You Can Feel</h4>
          <p className='text-gray-600'>Our garments are crafted from premium materials, ethically sourced, and made to last through seasons and styles.</p>
        </div>
        <div className='bg-white shadow-md hover:shadow-xl transition-all rounded-xl p-8 space-y-4 text-left'>
          <h4 className='text-lg font-semibold text-black'>Made for Everyone</h4>
          <p className='text-gray-600'>Fashion that’s inclusive, diverse, and made for every body. Our sizes and styles are as unique as our customers.</p>
        </div>
        <div className='bg-white shadow-md hover:shadow-xl transition-all rounded-xl p-8 space-y-4 text-left'>
          <h4 className='text-lg font-semibold text-black'>Support that Cares</h4>
          <p className='text-gray-600'>We’re here for you 24/7 — before and after your purchase. Expect real people, real answers, and real-time help.</p>
        </div>
      </div>

    </div>
  );
};

export default About;
