import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import { UserContext } from '../context/UserContext';


const PaymentPage = (props) => {
   const vehicleType = props.vehicleType;
        const fare = props.fare ? props.fare[vehicleType] : 0;
         
  const {ride} = useContext(UserContext);
        const {user}=useContext(UserContext)

//    const payNow = async () => {

//       // Create order by calling the server endpoint
//   try {   const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({amount:fare*100, currency: 'INR', receipt: 'receipt#1'})
//       });

//       const order = await response.json();

//       // Open Razorpay Checkout
//       const options = {
//         key: 'rzp_test_SjaQ5jH1ohVMeZ', // Replace with your Razorpay key_id
//         amount: fare, // Amount is in currency subunits.
//         currency: 'INR',
//         name: 'Acme Corp',
//         description: 'Test Transaction',
//         order_id: 'order_IluGWxBm9U8zJ8', // This is the order_id created in the backend
//         callback_url: 'http://localhost:3000/razorpaypage', // Your success URL
//         prefill: {
//           name: 'Gaurav Kumar',
//           email: 'gaurav.kumar@example.com',
//           contact: '9999999999'
//         },
//         theme: {
//           color: '#F37254'
//         },
//       };

// console.log("Order created:", order);
//       const rzp = new Razorpay(options);
//       rzp.open();
//     }
//    catch(error){
//       console.error("Error creating order or opening Razorpay:", error);
//    }

//    }

const payNow = async () => {
  try {
    console.log(ride)
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        amount: fare * 100, // correct (paise)
        currency: 'INR',
        receipt: 'receipt#1'
      })
      ,
    });

    const order = await response.json();
    console.log("Order created:", order);

    const options = {
      key: 'rzp_test_SjaQ5jH1ohVMeZ',
      amount: order.amount, // ✅ use backend value
      currency: order.currency,
      name: 'Acme Corp',
      description: 'Test Transaction',
      order_id: order.id, // ✅ IMPORTANT (dynamic)
      handler: async function (response) {
        console.log("Payment success:", response);
        // You can verify the payment on the server here by sending response.razorpay_payment_id, response.razorpay_order_id, and response.razorpay_signature
        
            console.log(ride)
            console.log(user)
       const verifyResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/payment/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: order.amount,
            rideId: ride?._id,   // ← use optional chaining
    userId: user?._id
        })
       })


         const verifyData = await verifyResponse.json();
            if(verifyResponse.status === 200){
                alert("Payment successful and verified!");
            } else {
                alert("Payment verification failed: " + verifyData.message);
            }


      },
      prefill: {
        name: 'Gaurav Kumar',
        email: 'gaurav.kumar@example.com',
        contact: '9999999999'
      },
      theme: { color: '#F37254' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

 console.log("rzp response:", rzp);
    rzp.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});

  } catch (error) {
    console.error("Error creating order or opening Razorpay:", error);
  }
};

  return (
   <div>
        
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setPaymentPage(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Make a Payment</h3>

           <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                   
                   <h2 className='text-xl font-medium'>Amount : </h2>
                </div>
                <h5 className='text-lg font-semibold'>{fare}</h5>
           </div>

            <div className='flex gap-2 justify-between flex-col items-center'>
            
                
                <div className='mt-6 w-full'>
                     
                        <Link to='/razorpaypage' onClick={payNow} className='w-full text-lg flex justify-center mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>Pay Now</Link>
                    
                
                </div>
            </div>

            </div>
  )
}

export default PaymentPage