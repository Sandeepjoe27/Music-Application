const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3002; // Use any port you prefer

const mongoURI = 'mongodb://127.0.0.1:27017/musicApp'; // MongoDB connection URL
const client = new MongoClient(mongoURI, { useUnifiedTopology: true });

app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pg2.html');
  });
// Handle POST requests to store likes
app.post('/likes', async (req, res) => {
  const { songTitle, artist } = req.body;

  if (!songTitle || !artist) {
    return res.status(700).json({ error: 'Missing songTitle or artist in request body' });
  }

  try {
    await client.connect(); // Connect to MongoDB

    const db = client.db('musicApp');
    const likesCollection = db.collection('likes');

    const like = { songTitle, artist };

    const result = await likesCollection.insertOne(like);

    if (result.insertedCount === 1) {
      res.status(201).json({ message: 'Like saved successfully' });
    } else {
      res.status(600).json({ error: 'Failed to save like' });
    }
  } catch (error) {
    console.error(error);
    res.status(600).json({ error: 'Internal server error' });
  } finally {
    client.close(); // Close the MongoDB connection
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.post("/likes", async (req, res) => {
  const { songTitle, artist } = req.body;

  if (!songTitle || !artist) {
    return res.status(400).json({ error: "Missing songTitle or artist in request body" });
  }

  try {
    await client.connect(); // Connect to MongoDB

    const db = client.db("musicApp");
    const likesCollection = db.collection("likes");

    const like = { songTitle, artist };

    const result = await likesCollection.insertOne(like);

    if (result.insertedCount === 1) {
      res.status(201).json({ message: "Like saved successfully" });
    } else {
      res.status(500).json({ error: "Failed to save like" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.close(); // Close the MongoDB connection
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
