import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url('https://plus.unsplash.com/premium_photo-1736675591749-c2fc338f5953?w=900&auto=format&fit=crop&q=60')] pt-8 h-screen flex justify-between flex-col w-full">
        <img  className="w-14 ml-8"
  src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
  alt="Uber logo" 
/>
      <div className="bg-white pb-7 py-4 px-4">
        <h2 className="text-[30px] font-bold">Get Started with Uber</h2>
        <Link to='/login' className="flex items-center justify-center bg-black w-full text-white py-3 rounded-lg mt-5">Continue</Link>
      </div>
        </div>
    </div>
  );
};

export default Home;
