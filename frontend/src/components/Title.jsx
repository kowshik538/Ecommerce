import React from 'react'

const Title = ({text1,text2}) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>{text1} <span className='text-gray-700 font-medium'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
  )
}

export default Title
// import React from 'react';

// const Title = ({ text1, text2 }) => {
//   return (
//     <div className="mb-8 text-center">
//       <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-xl uppercase tracking-wide inline-block relative">
//         {text1}{' '}
//         <span className="text-accent">{text2}</span>

//         {/* Optional underline animation */}
//         <span className="block h-[2px] w-20 bg-accent mx-auto mt-3 rounded-full animate-pulse"></span>
//       </h2>
//     </div>
//   );
// };

// export default Title;
