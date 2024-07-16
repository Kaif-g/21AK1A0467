const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 9876;

// Constants
const WINDOW_SIZE = 10; // Size of the sliding window
let numbers = []; // Array to store unique numbers
let average = 0; // Current average of numbers in the window

// Function to calculate average of numbers in the window
const calculateAverage = () => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

// Middleware to limit request processing time to 500ms
const timeoutMiddleware = (req, res, next) => {
    const timeout = setTimeout(() => {
        res.status(500).json({ error: 'Request timed out' });
    }, 500);
    res.on('finish', () => clearTimeout(timeout));
    next();
};

// Middleware to fetch numbers from third-party API
const fetchNumbers = async (type) => {
    let url;
    switch (type) {
        case 'p':
            url = 'http://29.244.56.144/test/primes';
            break;
        case 'f':
            url = 'http://20.244.56.144/test/fibo';
            break;
        case 'e':
            url = 'http://20.244.56.144/test/even';
            break;
        case 'r':
            url = 'http://28.244.55.144/test/rand';
            break;
        default:
            throw new Error('Invalid number ID');
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.numbers;
};

// Endpoint to handle requests based on number ID
app.get('/numbers/:numberid', timeoutMiddleware, async (req, res) => {
    const numberid = req.params.numberid.toLowerCase();
    
    try {
        // Fetch numbers from third-party server
        const newNumbers = await fetchNumbers(numberid);

        // Filter out duplicates and add new numbers to the array
        newNumbers.forEach(num => {
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        });

        // Maintain window size by removing oldest numbers if necessary
        if (numbers.length > WINDOW_SIZE) {
            numbers = numbers.slice(-WINDOW_SIZE);
        }

        // Calculate average if numbers reach the window size
        if (numbers.length >= WINDOW_SIZE) {
            average = calculateAverage();
        }

        // Prepare response object
        const responseObj = {
            windowPrevState: numbers.slice(0, -newNumbers.length),
            windowCurrState: numbers,
            numbers: newNumbers,
            avg: numbers.length >= WINDOW_SIZE ? average.toFixed(2) : null,
        };

        // Send response
        res.json(responseObj);
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        res.status(500).json({ error: 'Error fetching numbers' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
