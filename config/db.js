import { MongoClient} from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI);
const connectDB = async () => {
    try {
        await client.connect();
        console.log('MongoDB connected');
        return client.db();
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export  {connectDB, client};