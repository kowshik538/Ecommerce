import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, token, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalReviews);
      }
    } catch (error) {
      console.log('Error fetching reviews:', error);
    }
  }

  const handleAddReview = async () => {
    if (!token) {
      toast.error('Please login to add a review');
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Review added successfully!');
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error adding review:', error);
      toast.error('Failed to add review');
    }
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <img
          key={i}
          src={i <= rating ? assets.star_icon : assets.star_dull_icon}
          alt=""
          className="w-3 h-3"
        />
      );
    }
    return stars;
  }

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId, products])

  const isSizeInStock = (sizeName) => {
    if (!productData.sizeStock) return true;
    return productData.sizeStock[sizeName] > 0;
  };

  const getStockCount = (sizeName) => {
    if (!productData.sizeStock) return null;
    return productData.sizeStock[sizeName] || 0;
  };

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {renderStars(averageRating)}
            <p className='pl-2'>({totalReviews} reviews)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>{
                  const inStock = isSizeInStock(item);
                  const stockCount = getStockCount(item);
                  return (
                    <button 
                      key={index}
                      onClick={() => inStock ? setSize(item) : null} 
                      disabled={!inStock}
                      className={`border py-2 px-4 ${
                        !inStock 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : item === size 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={!inStock ? 'Out of Stock' : stockCount ? `${stockCount} in stock` : 'In Stock'}
                    >
                      {item}
                      {stockCount !== null && (
                        <span className={`block text-xs ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                          {inStock ? `${stockCount} left` : 'Out of stock'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
          </div>
          <button 
            onClick={()=>addToCart(productData._id,size)} 
            disabled={!size || !isSizeInStock(size)}
            className={`px-8 py-3 text-sm ${
              !size || !isSizeInStock(size)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white active:bg-gray-700'
            }`}
          >
            {!size ? 'SELECT SIZE' : !isSizeInStock(size) ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <button 
            onClick={() => setActiveTab('description')}
            className={`px-5 py-3 text-sm ${activeTab === 'description' ? 'border-b-2 border-black font-bold' : 'border'}`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('detailed')}
            className={`px-5 py-3 text-sm ${activeTab === 'detailed' ? 'border-b-2 border-black font-bold' : 'border'}`}
          >
            Detailed Info
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 text-sm ${activeTab === 'reviews' ? 'border-b-2 border-black font-bold' : 'border'}`}
          >
            Reviews ({totalReviews})
          </button>
        </div>
        
        <div className='border px-6 py-6 text-sm text-gray-500'>
          {activeTab === 'description' ? (
            <div className='flex flex-col gap-4'>
              <p>{productData.description}</p>
            </div>
          ) : activeTab === 'detailed' ? (
            <div className='flex flex-col gap-4'>
              {productData.detailedDescription ? (
                <p>{productData.detailedDescription}</p>
              ) : (
                <p className='text-center text-gray-400 py-8'>No detailed information available for this product.</p>
              )}
            </div>
          ) : (
            <div className='flex flex-col gap-6'>
              {/* Review Summary */}
              <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>{averageRating}</div>
                  <div className='flex items-center gap-1 mt-1'>
                    {renderStars(averageRating)}
                  </div>
                  <div className='text-sm text-gray-600 mt-1'>{totalReviews} reviews</div>
                </div>
                {token && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className='ml-auto px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800'
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className='border p-4 rounded-lg'>
                  <h3 className='font-semibold mb-3'>Write Your Review</h3>
                  <div className='mb-3'>
                    <label className='block text-sm font-medium mb-1'>Rating</label>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className='focus:outline-none'
                        >
                          <img
                            src={star <= reviewForm.rating ? assets.star_icon : assets.star_dull_icon}
                            alt=""
                            className="w-5 h-5"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label className='block text-sm font-medium mb-1'>Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className='w-full p-2 border rounded-md'
                      rows="3"
                      placeholder="Share your experience with this product..."
                      maxLength="500"
                    />
                  </div>
                  <button
                    onClick={handleAddReview}
                    className='px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800'
                  >
                    Submit Review
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className='space-y-4'>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className='border-b pb-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='flex items-center gap-1'>
                          {renderStars(review.rating)}
                        </div>
                        <span className='font-medium'>{review.userName}</span>
                        <span className='text-gray-400 text-xs'>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className='text-gray-700'>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className='text-center text-gray-500 py-8'>No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --------- display related products ---------- */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
