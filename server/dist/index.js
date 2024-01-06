"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: 'http://localhost:5173'
}));
// app.use(cors())
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/auth', userRoutes_1.default);
app.use('/products', productRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
app.use('/order', orderRoutes_1.default);
app.use('/address', addressRoutes_1.default);
app.use('/review', reviewRoutes_1.default);
const connectDB = async (url) => {
    await mongoose_1.default
        .connect(url)
        .then(() => console.log("Database Connected"))
        .catch(err => console.log(err));
};
app.listen(3000, () => {
    connectDB('mongodb://0.0.0.0:27017/Shelf-mates');
    console.log("Server started on port 3000");
});
