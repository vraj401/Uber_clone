import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();
import cookieParser from 'cookie-parser';

import connectToDb from './db/db.js';
import userRoutes from './routes/user.routes.js'
import captainRoutes from './routes/captain.routes.js';
import mapRoutes from './routes/maps.routes.js';
import rideRoutes from './routes/ride.routes.js';
import paymentRoutes from './routes/payment.routes.js'
import razorpay from 'razorpay'



connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("Hello, World!");
});


app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/maps', mapRoutes)
app.use('/rides', rideRoutes)
app.use('/payment',paymentRoutes)
export default app;
