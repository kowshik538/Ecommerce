import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
// import OurPolicy from '../components/OurPolicy'
// import NewsletterBox from '../components/NewsletterBox'
import FeatureHighlights from '../components/FeatureHighlights';
// import Testimonials from '../components/Testimonials';
import BrandStoryVideo from '../components/BrandStoryVideo';
import FaqSection from '../components/FaqSection';
// import BlogPreview from '../components/BlogPreview';


// import ClothingShowcase from '../components/ClothingShowcase';
// import JacketViewer from '../components/JacketViewer'; // adjust path accordingly

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      {/* <OurPolicy/> */}
      <FeatureHighlights />
      {/* <Testimonials /> */}
      <FaqSection />
      <BrandStoryVideo />
      {/* <BlogPreview /> */}
      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Home
