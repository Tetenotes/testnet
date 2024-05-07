const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());

let items = [
    { title: 'iPhone 12', description: 'Brand new iPhone 12 with 256GB storage.', price: '2.5 ETH' },
    { title: 'Samsung Galaxy S21 Ultra', description: 'Excellent condition Samsung Galaxy S21 Ultra with 128GB storage.', price: '3.0 ETH' },
    { title: 'MacBook Air M1', description: 'Lightly used MacBook Air M1 with 512GB SSD.', price: '2.2 ETH' },
    { title: 'PlayStation 5', description: 'Brand new PlayStation 5 gaming console.', price: '2.8 ETH' },
    { title: 'Nintendo Switch', description: 'Nintendo Switch gaming console with Joy-Con controllers.', price: '1.2 ETH' },
    { title: 'DJI Mavic Air 2', description: 'DJI Mavic Air 2 drone with 4K camera and remote controller.', price: '1.9 ETH' },
    { title: 'Apple Watch Series 6', description: 'Apple Watch Series 6 with GPS and Cellular connectivity.', price: '1.0 ETH' },
    { title: 'Canon EOS R5', description: 'Canon EOS R5 mirrorless camera with 45MP full-frame CMOS sensor.', price: '3.5 ETH' },
    { title: 'Bose Noise Cancelling Headphones 700', description: 'Premium wireless headphones with adaptive noise cancellation.', price: '0.8 ETH' },
    { title: 'Samsung 49-Inch QLED Gaming Monitor', description: 'Samsung QLED gaming monitor with 144Hz refresh rate and HDR support.', price: '1.5 ETH' }
];


let users = [];

app.get('/products', (req, res) => {
    res.json(items);
});

app.post('/products', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    res.sendStatus(200);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        res.status(409).send('Username already exists');
    } else {
        users.push({ username, password });
        res.sendStatus(201);
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.redirect('/index.html');
    } else {
        res.status(401).send('Invalid username or password'); 
    }
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Navigate to http://localhost:${PORT}/ in your browser.`);
});

module.exports = { app, items };
