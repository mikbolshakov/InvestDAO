const express = require('express');
const {connectToMoralis} = require("./Prices/Moralis.js")
const {getCurrentEthPrice} = require("./Prices/priceEth.js")
const {getCurrentBtcPrice} = require("./Prices/priceWBtc.js")
const {registerValidation} = require("./validations.js")

const PORT = 3001;
const app = express();

app.use(express.json());
app.get("/api", async (req, res) => {
  const ethPrice = await getCurrentEthPrice(); 
  const BtcPrice = await getCurrentBtcPrice(); 
  res.json({message: [BtcPrice, ethPrice]});
})

app.post('/auth/register', registerValidation, UserController.register);

async function startApp() {
    try {
        await connectToMoralis()
        app.listen(PORT, () => console.log("Server is working on port " + PORT));
    } catch (error) {
        console.log(error);
    }
}

startApp();