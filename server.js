const express = require('express');
const yahooFinance = require('yahoo-finance');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/stock-price', async (req, res) => {
    const { symbol } = req.query;
    try {
        const quote = await yahooFinance.quote({
            symbol: symbol,
            modules: ['price']
        });
        res.json(quote.price.regularMarketPrice);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stock price' });
    }
});

app.get('/historical-volatility', async (req, res) => {
    const { symbol, years } = req.query;
    try {
        const to = new Date();
        const from = new Date();
        from.setFullYear(from.getFullYear() - years);

        const historical = await yahooFinance.historical({
            symbol: symbol,
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0],
            period: 'd'
        });

        const returns = historical.map((quote, index, array) => {
            if (index === 0) return 0;
            return (quote.close - array[index - 1].close) / array[index - 1].close;
        }).slice(1);

        const volatility = Math.sqrt(252) * standardDeviation(returns);
        res.json(volatility);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching historical volatility' });
    }
});

function standardDeviation(arr) {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
