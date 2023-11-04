const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function insertData(email, pass, cpass) {
  try {
    await client.connect();
    const db = client.db("signup");
    const collection = db.collection("sign");

    const document = {
      Email: email,
      password: pass,
      confirmpassword: cpass,
    };

    const result = await collection.insertOne(document);
    console.log("Data inserted with _id: " + result.insertedId);
  } catch (err) {
    console.error("Error inserting data: ", err);
  } finally {
    await client.close();
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/sign.html");
});

app.post("/add", (req, res) => {
  const { email, pass, cpass } = req.body;

  const pat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (pat.test(email) && pass.length <= 10 && pass == cpass) {
    insertData(email, pass, cpass);
    res.redirect("/"); // Redirect to the same route
  } else {
    res.status(400).send("Invalid data. Please check your input.");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/pg1.html");
});

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    await client.connect();
    const db = client.db("signup");
    const collection = db.collection("sign");

    const user = await collection.findOne({ Email: email, password: pass });

    if (user) {
      // User found in the database, proceed with the login logic
      res.redirect("/intro.html");
    } else {
      // User not found, return an error message
      res.status(400).send("Invalid login credentials. new user please signup.");
    }
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).send("An error occurred during login.");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


