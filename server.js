
const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.) from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/recalls/:number', async (req, res) => {
    const recallNumber = req.params.number;
    const apiUrl = `https://api.fda.gov/food/enforcement.json?search=report_date:[20040101+TO+20131231]&limit=${recallNumber}`;

    try {
        const response = await axios.get(apiUrl);
        const recalls = response.data.results;

        // Sort recalls by report_date (extra credit)
        recalls.sort((a, b) => new Date(a.report_date) - new Date(b.report_date));

        res.json({ results: recalls.slice(0, 5) });
    } catch (error) {
        console.error('Error fetching recall data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Citation: https://chat.openai.com/share/0adb7905-888f-4cad-95a1-734c8cde196d

