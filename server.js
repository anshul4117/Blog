import app from './app.js';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// connect to db
connectDB()
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});

// process.on('SIGINT', async()=>{
//     console.log('Closing mongodb connection');
//     await client.close();
//     console.log('MongoDB connection pool closed');
//     process.exit(0);
// })
