require('dotenv').config();
const express = require('express');
const pinoHttp = require('pino-http');
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3000;

const logger = pinoHttp();

app.use(express.json());
app.use(logger);

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Sentiment analysis route using req.body.sentence
app.post('/sentiment', async (req, res) => {
  const { sentence } = req.body;  // <-- fixed to use body instead of query

  if (!sentence) {
    req.log.error('No sentence provided');
    return res.status(400).json({ error: 'No sentence provided' });
  }

  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer('English', stemmer, 'afinn');

  try {
    const analysisResult = analyzer.getSentiment(sentence.split(' '));

    let sentiment = 'neutral';
    if (analysisResult < 0) {
      sentiment = 'negative';
    } else if (analysisResult > 0.33) {
      sentiment = 'positive';
    }

    req.log.info(`Sentiment analysis result: ${analysisResult}`);
    res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
  } catch (error) {
    req.log.error(`Error performing sentiment analysis: ${error}`);
    res.status(500).json({ message: 'Error performing sentiment analysis' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
