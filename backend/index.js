import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect } from './config/db.js';
import { errorHandler } from './middleware/ErrorHandler.js';
import authRoute from "./routes/auth_route.js"
import userRoute from "./routes/user_route.js"

// Connect to the database
dbConnect();

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/v1/auth/users', authRoute);
app.use('/api/v1/users', userRoute);


app.get('/', (req, res) => {
    res.send('Hello, World! This is the backend for the Task Manager application.');
})

// Error 404 handler
// app.all(('*', (req, res) => {
//     res.status(404).json({ message: 'Page not found' });
// }))
app.use(('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
}))

// Error handling middleware
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

// npm install express cors dotenv mongoose
// npm install --save-dev nodemon
// npm i gravatar joi
// npm i bcrypt cookie-parser express-jwt jsonwebtoken