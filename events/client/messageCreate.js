const w3func = require('../../web3');
const chalk = require("chalk");

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.channel.id === "1018242383625863188") {
            messageArray = message.content.split(" ");
            console.log(`[logdata]${messageArray}`);

            const chain = messageArray[0];
            const blockNumber = messageArray[1];
            console.log(`[logdata]Chain : ${chalk.green(chain)}  |  Block Number: ${chalk.green(blockNumber)}`);

            var numberChecker = w3func.isNumber(blockNumber);
            console.log(`[logdata][numberChecker]${chalk.green(numberChecker)}`);

            if (numberChecker) {
                try {
                    console.log(`[logdata]Trying to fetch data..`);
                    await w3func.getNewListing(blockNumber, chain);
                    await w3func.getListingPriceChange(blockNumber, chain);
                    await w3func.getPurchasedListing(blockNumber, chain);
                    await w3func.getCancelledListing(blockNumber, chain);
                } catch (error) {
                    console.log(`[logdata]Error in fetching data. Might be a RPC limit error.`)
                    console.log(error);
                }
            }
        }
    }
}