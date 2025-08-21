import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useWallet } from '../context/WalletContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const { updateBalanceAfterCancellation } = useWallet();
  const [orderData, setorderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.orderId = order._id;
            item.orderAmount = order.amount;
            allOrdersItem.push(item);
          });
        });
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    }
  };

  const cancelOrder = async (orderId, orderAmount, paymentMethod) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/cancel`, { orderId }, { headers: { token } });
      if (response.data.success) {
        // Update wallet balance if payment was made online
        if (paymentMethod === "Stripe" || paymentMethod === "Razorpay") {
          updateBalanceAfterCancellation(orderAmount);
          toast.success(`Order cancelled successfully! ₹${orderAmount.toFixed(2)} has been added to your wallet.`);
        } else {
          toast.success("Order cancelled successfully");
        }
        loadOrderData(); // Refresh list
      } else {
        toast.error(response.data.message || "Unable to cancel order");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error. Try again later.");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const isWithin48Hours = (date) => {
    const now = Date.now();
    const orderTime = new Date(date).getTime();
    return now - orderTime < 48 * 60 * 60 * 1000; // 48 hours
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p>{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                {item.status === "Cancelled" && (item.paymentMethod === "Stripe" || item.paymentMethod === "Razorpay") && (
                  <p className='mt-1 text-green-600 text-sm'>💰 Amount added to wallet</p>
                )}
              </div>
            </div>
            <div className='md:w-1/2 flex flex-col gap-2 items-end justify-center md:justify-between'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>

                {isWithin48Hours(item.date) && item.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelOrder(item.orderId, item.orderAmount, item.paymentMethod)}
                    className='border px-4 py-2 text-sm font-medium rounded-sm text-red-600 border-red-500 hover:bg-red-50 transition-all'
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
