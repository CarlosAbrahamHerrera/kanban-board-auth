import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import { User, Ticket } from './models/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Request logger for debugging
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log(`Request headers:`, req.headers);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log(`Request body:`, req.body);
    }
    next();
});
// Response logger for debugging
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[${new Date().toISOString()}] Response for ${req.method} ${req.url}:`, typeof body === 'string' ? body.substring(0, 1000) : body);
        return originalSend.call(this, body);
    };
    next();
});
// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});
// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));
app.use(express.json());
app.use(routes);
// Try to connect to database, but don't stop server if it fails
const startServer = async () => {
    try {
        // Force true to reset database on each restart (since we're using in-memory SQLite)
        await sequelize.sync({ force: true });
        console.log('Database connected successfully');
        // Create a default user for testing
        const defaultUser = await User.create({
            username: 'Default User',
            password: 'password'
        });
        console.log('Created default user:', defaultUser.id, defaultUser.username);
        // Create some initial tickets for testing
        await Ticket.create({
            name: 'Example Ticket',
            description: 'This is an example ticket created on server start',
            status: 'Todo',
            assignedUserId: defaultUser.id
        });
        console.log('Created example ticket');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        console.log('Server will continue to run without database connection. Only the hardcoded test user will work.');
    }
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};
startServer();
