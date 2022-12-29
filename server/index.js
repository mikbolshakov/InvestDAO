const express = require('express');
const {connectToMoralis} = require("./Moralis.js")
const {getCurrentEthPrice} = require("./priceEth.js")
const {getCurrentBtcPrice} = require("./priceWBtc.js")

const PORT = 3001;
const app = express();

app.use(express.json());
app.get("/api", async (req, res) => {
  const ethPrice = await getCurrentEthPrice(); 
  const BtcPrice = await getCurrentBtcPrice(); 
  res.json({message: [BtcPrice, ethPrice]});
})

async function startApp() {
    try {
        await connectToMoralis()
        app.listen(PORT, () => console.log("Server is working on port " + PORT));
    } catch (error) {
        console.log(error);
    }
}

startApp();