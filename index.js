const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require("cors");
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const compression = require('compression');
// const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');


const { port } = require('./src/config/config');
const { connectToDatabase } = require('./src/config/db.config');
const { errorHandler } = require('./src/uitls/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
// app.use(xss());
app.use(mongoSanitize());
app.use(hpp()); // HTTP Parameter Pollution prevention
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.text());
app.use(fileUpload());
app.use(cors());

const adminRoutes = require('./src/routes/v1/adminRoutes');
const userRoutes = require('./src/routes/v1/userRoutes');
const categoryRoutes = require('./src/routes/v1/categoryRoutes');
const bookingRoutes = require("./src/routes/v1/bookingRoutes");
const dashboardRoutes = require("./src/routes/v1/dashboardRoutes");
const doctorRoutes = require('./src/routes/v1/doctorRoutes');
const ratingRoutes = require('./src/routes/v1/ratingRoutes');

// Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);

// HTTP Strict Transport Security (HSTS)
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    })
);

app.use("/userImages", express.static(__dirname + "/userImages"));
app.use("/doctorImages", express.static(__dirname + "/doctorImages"));
app.use("/categoryImages", express.static(__dirname + "/categoryImages"));
app.use("/bannerImages", express.static(__dirname + "/bannerImages"));
app.use("/courseImages", express.static(__dirname + "/courseImages"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/bookings", express.static(__dirname + "/bookings"));
app.use("/ratingImages", express.static(__dirname + "/ratingImages"));


app.use("/", adminRoutes);
app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", bookingRoutes);
app.use("/", dashboardRoutes);
app.use("/", doctorRoutes);
app.use("/", ratingRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Doctor App is Up and Running</h1>");
});

// Last middleware if any error comes
app.use(errorHandler);

const server = app.listen(port, async() => {
    console.log('App is running on port', port);
    // logger.info('Server started on port ' + port, { meta: { timestamp: new Date().toISOString() } });
    await connectToDatabase;
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handling process termination signals for graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
