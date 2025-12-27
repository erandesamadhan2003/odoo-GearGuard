import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false, // Disable SQL query logging
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected successfully !!');
        
        // Sync database models (creates tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized');
    } catch (error) {
        console.error('MySQL connection failed:', error.message);
        process.exit(1);
    }
}

export { sequelize };
export default connectDB;
