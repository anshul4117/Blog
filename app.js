import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// middle wares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// rouets
import authRoute from './routes/auth.js';
// import loginUser from './controllers/user/loginUser.js';
// import allUsers from './controllers/user/getAllUsers.js';



app.use('/api/v1.2/users', authRoute);
// app.get('/api/users/login', loginUser);
// app.get('/api/users/all', allUsers);

app.get('/', (req, res) => {
    res.send('Server is running');
})

export default app;