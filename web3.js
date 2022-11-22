const Web3 = require('web3');

const weapABI = require('./abis/weapon.json');
const shieldABI = require('./abis/shield.json');
const bazaarABI = require('./abis/bazaar.json');
const charsABI = require('./abis/character.json');
const treasuryABI = require('./abis/treasury.json');
const USER_ADDRESS = "0xA8e48AfbD74f58d16290A5253571430665A3f78c";

var contractAddress = {
    bnb: {
        character: '0xc6f252c2CdD4087e30608A35c022ce490B58179b',
        weapon: '0x7E091b0a220356B157131c831258A9C98aC8031A',
        shield: '0xf9E9F6019631bBE7db1B71Ec4262778eb6C3c520',
        bazaar: '0x90099dA42806b21128A094C713347C7885aF79e2',
        treasury: '0x812Fa2f7d89e5d837450702bd51120920dccaA99',
        burn: '0xbE555D81117EEe690ACBaC54aF735AC32d763Fd2',
        // discord text channels
        charTrades: '1021850931656134686',
        weapTrades: '1026428691561070653',
        shieldTrades: '1026428828945481758'
    },
    oec: {
        character: '0x6A1d1803d4EDF5CF27EDb64ae95A22F81707eA38',
        weapon: '0x364759180A6484e57ECD73C042264A6Da75770e8',
        shield: '0x8c52FabF2442b0EB83518DaB93A8073Ce5B0BA15',
        bazaar: '0x5ea2373e281E92FE3c53dc36cE855D89BF25F6F8',
        // discord text channels
        charTrades: '1026972816085618778',
        weapTrades: '1027680724184211486',
        shieldTrades: '1027680765732991026'
    },
    heco: {
        character: '0xF6092CDEaabd02069cB56E2b770367AAcf49dfba',
        weapon: '0xa0f254436E43239D2B3947A9D590C495738B6A4C',
        shield: '0xb4eD70aC5B00ca0fd9526089489979e116E45ec0',
        bazaar: '0x17afd75cbd5b51b4bae8d071ed9394f4ef13cece'
    },
    skale: {
        character: '0x48bdd9a266fF01eEb81b1F89daB76b3816Ee848a',
        weapon: '0x3F715995647fe44Db45411bb9e81b7A1aD5A8387',
        shield: '0xEc9d6815931872C799682239ACeA0AE072d92C8f',
        bazaar: '0x570e6797DAFC13D40b8153078072D8a9c7E82eD8',
        burn: '0xc0b99caa246f04f4b74579c05f8c5198492cc3d1',
        // discord text channels
        charTrades: '1027629421261230110',
        weapTrades: '1027691451880054924',
        shieldTrades: '1027691886686769305'
    }
}

var nodes = {
    bnb: 'https://rpc.ankr.com/bsc',
    oec: 'https://exchainrpc.okex.org',
    heco: 'https://http-mainnet.hecochain.com',
    skale: 'https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'
}

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function getClassFromTrait(trait) {
    switch (parseInt(trait)) {
        case 0: return '🔥'
        case 1: return '🍀'
        case 2: return '⚡'
        case 3: return '💧'
        default: return '💪'
    }
}

function getClassFromTraitStat(trait) {
    switch (parseInt(trait)) {
        case 0: return '🔥 STR'
        case 1: return '🍀 DEX'
        case 2: return '⚡ CHA'
        case 3: return '💧 INT'
        default: return '💪 PWR'
    }
}

function getNftType(nftAddress, chain) {
    if (nftAddress === contractAddress[chain].weapon) {
        return "Weapon";
    } else if (nftAddress === contractAddress[chain].character) {
        return "Character";
    } else if (nftAddress === contractAddress[chain].shield) {
        return "Shield";
    } else {
        return "Others";
    }
}

function starsChecker(a, b, c, d, e, f, g) {
    var x = parseInt(a) + 1;
    switch (x) {
        case 6:
            z = (parseInt(b) + parseInt(d) + parseInt(f)) / 3; // get average power
            container = `${parseFloat(z).toFixed(2)} AvePower   | ${getClassFromTraitStat(c)} ${b} ${getClassFromTraitStat(e)} ${d} ${getClassFromTraitStat(g)} ${f}`;
            return container.toString();
        case 5: // case 5-6 stars
            z = (parseInt(b) + parseInt(d) + parseInt(f)) / 3; // get average power
            container = `${parseFloat(z).toFixed(2)} AvePower   | ${getClassFromTraitStat(c)} ${b} ${getClassFromTraitStat(e)} ${d} ${getClassFromTraitStat(g)} ${f}`;
            return container.toString();
        case 4: // case 4 stars
            z = (parseInt(b) + parseInt(d)) / 2; // get average power
            container = `${parseFloat(z).toFixed(2)} AvePower   | ${getClassFromTraitStat(c)} ${b} ${getClassFromTraitStat(e)} ${d}`;
            return container.toString();
        default: // case 1-3 stars
            container = ` ${getClassFromTraitStat(c)} ${b}`;
            return container.toString();
    }
}

function getStat1TraitWeap(statPattern) {
    container = parseInt(statPattern) % 5;
    return container;
}

function getStat2TraitWeap(statPattern) {
    container = (statPattern / 5) % 5;
    return container;
}

function getStat3TraitWeap(statPattern) {
    container = (statPattern / 25) % 5;
    return container;
}

async function getCBCData(nftID, chain) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    const contract = new web3.eth.Contract(charsABI, contractAddress[chain].character);
    const getLevel = await contract.methods.getLevel(nftID).call({ from: USER_ADDRESS });
    const getPower = await contract.methods.getPower(nftID).call({ from: USER_ADDRESS });
    const getStamina = await contract.methods.getStaminaPoints(nftID).call({ from: USER_ADDRESS });
    const getTrait = await contract.methods.getTrait(nftID).call({ from: USER_ADDRESS });
    const getBonusPower = await contract.methods.getTotalPower(nftID).call({ from: USER_ADDRESS });
    var x = parseInt(getBonusPower) - parseInt(getPower);
    var y = parseInt(getLevel) + 1;
    var container = `${getClassFromTrait(getTrait)} ${nftID}  |  Lvl ${y}  |  ${getPower} Base Power  |  ${x} Bonus Power  |  ${getStamina} Stamina`;
    return container;
}

async function getCBWData(nftID, chain) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    const contract = new web3.eth.Contract(weapABI, contractAddress[chain].weapon);
    const getStars = await contract.methods.getStars(nftID).call({ from: USER_ADDRESS });
    const getTrait = await contract.methods.getTrait(nftID).call({ from: USER_ADDRESS });
    const getStatPattern = await contract.methods.getStatPattern(nftID).call({ from: USER_ADDRESS });

    var x = parseInt(getStatPattern); // get pattern for trait data
    const getStat1 = await contract.methods.getStat1(nftID).call({ from: USER_ADDRESS });
    const getStat1Trait = getStat1TraitWeap(x);

    const getStat2 = await contract.methods.getStat2(nftID).call({ from: USER_ADDRESS });
    const getStat2Trait = getStat2TraitWeap(x);

    const getStat3 = await contract.methods.getStat3(nftID).call({ from: USER_ADDRESS });
    const getStat3Trait = getStat3TraitWeap(x);

    const getBonusPower = await contract.methods.getBonusPower(nftID).call({ from: USER_ADDRESS });

    var w = await starsChecker(getStars, getStat1, getStat1Trait, getStat2, getStat2Trait, getStat3, getStat3Trait); // checks stars (0-4)

    var x = parseInt(getStars) + 1;
    for (i = 0, len = x, text = ""; i < len; i++) { // display how many stars
        text += "⭐";
    }

    var container = `${getClassFromTrait(getTrait)} ${nftID}  |  ${text}  |  ${w} BP: ${getBonusPower}`
    return container;
}

async function getCBSData(nftID, chain) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    const contract = new web3.eth.Contract(shieldABI, contractAddress[chain].shield);
    const getStars = await contract.methods.getStars(nftID).call({ from: USER_ADDRESS });
    const getTrait = await contract.methods.getTrait(nftID).call({ from: USER_ADDRESS });
    const getStatPattern = await contract.methods.getStatPattern(nftID).call({ from: USER_ADDRESS });

    var y = parseInt(getStatPattern); // get pattern for trait data
    const getStat1 = await contract.methods.getStat1(nftID).call({ from: USER_ADDRESS });
    const getStat1Trait = await contract.methods.getStat1Trait(y).call({ from: USER_ADDRESS });

    const getStat2 = await contract.methods.getStat2(nftID).call({ from: USER_ADDRESS });
    const getStat2Trait = await contract.methods.getStat2Trait(y).call({ from: USER_ADDRESS });

    const getStat3 = await contract.methods.getStat3(nftID).call({ from: USER_ADDRESS });
    const getStat3Trait = await contract.methods.getStat3Trait(y).call({ from: USER_ADDRESS });

    var w = await starsChecker(getStars, getStat1, getStat1Trait, getStat2, getStat2Trait, getStat3, getStat3Trait); // checks stars (0-4)

    var x = parseInt(getStars) + 1;
    for (i = 0, len = x, text = ""; i < len; i++) { // display how many stars
        text += "⭐";
    }

    var container = `${getClassFromTrait(getTrait)} ${nftID}  |  ${text}  |  ${w}`;
    return container;
}

async function getNewListing(currBlockNumber, chain, client) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    var toBlockNumber = Number(currBlockNumber) + Number(1999);
    const contract = new web3.eth.Contract(bazaarABI, contractAddress[chain].bazaar); // init bazaar abi, contract
    const response = await contract.getPastEvents('NewListing', { fromBlock: currBlockNumber, toBlock: toBlockNumber }); // get past new listing events based on block number variable

    const arrayResponse = response; // convert response into an array
    var arrayLength = arrayResponse.length; // array length initialize for [for loop]
    console.log(`[logdata][getNewListing]${arrayResponse.length}`); // logs array length

    for (let i = 0; i < arrayLength; i++) { // send bazaar data to discord #bsc text channel
        var x = getNftType(arrayResponse[i].returnValues.nftAddress, chain) // initialize nft type for [if statements]
        const getFinalPrice = await contract.methods.getFinalPrice(arrayResponse[i].returnValues.nftAddress, arrayResponse[i].returnValues.nftID).call({ from: USER_ADDRESS });
        if (x === "Character") { // fetch all required data for CBC
            var y = parseFloat(getFinalPrice * 0.000000000000000001).toFixed(3);
            var link = `https://bazaar.market/buy/cb-${x.toLowerCase()}?id=${arrayResponse[i].returnValues.nftID}`;
            var container = await getCBCData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔼 List		-  [**SKILL: ${y}**  |  ${container}  |  Bazaar Link: ${link}]`;

            client.channels.fetch(contractAddress[chain].charTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Weapon") { // fetch all required data for CBw
            var y = parseFloat(getFinalPrice * 0.000000000000000001).toFixed(3);
            var link = `https://bazaar.market/buy/cb-${x.toLowerCase()}?id=${arrayResponse[i].returnValues.nftID}`;
            var container = await getCBWData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔼 List		-  [**SKILL: ${y}**  |  ${container}  |  Bazaar Link: ${link}]`;

            client.channels.fetch(contractAddress[chain].weapTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Shield") { // fetch all required data for CBS
            var y = parseFloat(getFinalPrice * 0.000000000000000001).toFixed(3);
            var link = `https://bazaar.market/buy/cb-${x.toLowerCase()}?id=${arrayResponse[i].returnValues.nftID}`;
            var container = await getCBSData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔼 List		-  [**SKILL: ${y}**  |  ${container}  |  Bazaar Link: ${link}]`;

            client.channels.fetch(contractAddress[chain].shieldTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else {
            console.log("[logdata]NFT Type not supported.")
        }
    }

    response.map(async result => {
        const { blockNumber } = await result
        const { nftAddress, nftID, price } = await result.returnValues
        txBlock = blockNumber;
        var parsedPrice = parseFloat(price * 0.000000000000000001).toFixed(3);
        nftType = getNftType(nftAddress, chain);
        nftIdNumber = nftID;

        var bazaarStringLogs = `[logdata]🔼 Listed - [NFT type: ${nftType}  |  NFT ID: ${nftIdNumber}  |  Price: ${parsedPrice}  |  Block Number: ${txBlock}  ]`;
        console.log(bazaarStringLogs);
    });
}

async function getListingPriceChange(currBlockNumber, chain, client) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    var toBlockNumber = Number(currBlockNumber) + Number(1999);
    const contract = new web3.eth.Contract(bazaarABI, contractAddress[chain].bazaar); // init bazaar abi, contract
    const response = await contract.getPastEvents('ListingPriceChange', { fromBlock: currBlockNumber, toBlock: toBlockNumber }); // get past new listing events based on block number variable

    const arrayResponse = response; // convert response into an array
    var arrayLength = arrayResponse.length; // array length initialize for [for loop]
    console.log(`[logdata][getListingPriceChange]${arrayResponse.length}`); // logs array length

    for (let i = 0; i < arrayLength; i++) { // send bazaar data to discord #bsc text channel
        var x = getNftType(arrayResponse[i].returnValues.nftAddress, chain) // initialize nft type for [if statements]
        const getFinalPrice = await contract.methods.getFinalPrice(arrayResponse[i].returnValues.nftAddress, arrayResponse[i].returnValues.nftID).call({ from: USER_ADDRESS });
        if (x === "Character") { // fetch all required data for CBC
            var y = parseFloat(getFinalPrice * 0.000000000000000001).toFixed(3);
            var link = `https://bazaar.market/buy/cb-${x.toLowerCase()}?id=${arrayResponse[i].returnValues.nftID}`;
            var container = await getCBCData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔄 Relist	-  [**SKILL: ${y}**  |  ${container}  |  Bazaar Link: ${link}]`;

            client.channels.fetch(contractAddress[chain].charTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Weapon") { // fetch all required data for CBw
            var y = parseFloat(getFinalPrice * 0.000000000000000001).toFixed(3);
            var link = `https://bazaar.market/buy/cb-${x.toLowerCase()}?id=${arrayResponse[i].returnValues.nftID}`;
            var container = await getCBWData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔄 Relist	-  [**SKILL: ${y}**  |  ${container}  |  Bazaar Link: ${link}]`;

            client.channels.fetch(contractAddress[chain].weapTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Shield") { // fetch all required data for CBS
            var y = parseFloat(getFinalPrice * 0.000000000000000001).toFixed(3);
            var link = `https://bazaar.market/buy/cb-${x.toLowerCase()}?id=${arrayResponse[i].returnValues.nftID}`;
            var container = await getCBSData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔄 Relist	-  [**SKILL: ${y}**  |  ${container}  |  Bazaar Link: ${link}]`;

            client.channels.fetch(contractAddress[chain].shieldTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else {
            console.log("[logdata]NFT Type not supported.")
        }
    }

    response.map(async result => {
        const { blockNumber } = await result
        const { nftAddress, nftID, newPrice } = await result.returnValues
        txBlock = blockNumber;
        var parsedPrice = parseFloat(newPrice * 0.000000000000000001).toFixed(3);
        nftType = getNftType(nftAddress, chain);
        nftIdNumber = nftID;

        var bazaarStringLogs = `[logdata]🔄 Relist - [NFT type: ${nftType}  |  NFT ID: ${nftIdNumber}  |  Price: ${parsedPrice}  |  Block Number: ${txBlock}]`;
        console.log(bazaarStringLogs);
    });
}

async function getPurchasedListing(currBlockNumber, chain, client) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    var toBlockNumber = Number(currBlockNumber) + Number(1999);
    const contract = new web3.eth.Contract(bazaarABI, contractAddress[chain].bazaar); // init bazaar abi, contract
    const response = await contract.getPastEvents('PurchasedListing', { fromBlock: currBlockNumber, toBlock: toBlockNumber }); // get past new listing events based on block number variable

    const arrayResponse = response; // convert response into an array
    var arrayLength = arrayResponse.length; // array length initialize for [for loop]
    console.log(`[logdata][getPurchasedListing]${arrayResponse.length}`); // logs array length

    for (let i = 0; i < arrayLength; i++) { // send bazaar data to discord #bsc text channel
        var x = getNftType(arrayResponse[i].returnValues.nftAddress, chain) // initialize nft type for [if statements]
        if (x === "Character") { // fetch all required data for CBC
            var y = parseFloat(arrayResponse[i].returnValues.price * 0.000000000000000001).toFixed(3)
            var container = await getCBCData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔽 Sold		-  [**SKILL: ${y}**  |  ${container}]`;

            client.channels.fetch(contractAddress[chain].charTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
            const channel = await client.channels.fetch(contractAddress[chain].shieldTrades);
            channel.send({ content: bazaarString });
        } else if (x === "Weapon") { // fetch all required data for CBw
            var y = parseFloat(arrayResponse[i].returnValues.price * 0.000000000000000001).toFixed(3)
            var container = await getCBWData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔽 Sold		-  [**SKILL: ${y}**  |  ${container}]`;

            client.channels.fetch(contractAddress[chain].shieldTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Shield") { // fetch all required data for CBS
            var y = parseFloat(arrayResponse[i].returnValues.price * 0.000000000000000001).toFixed(3)
            var container = await getCBSData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🔽 Sold		-  [**SKILL: ${y}**  |  ${container}]`;

            client.channels.fetch(contractAddress[chain].shieldTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else {
            console.log("[logdata]NFT Type not supported.");
        }
    }

    response.map(async result => {
        const { blockNumber } = await result
        const { nftAddress, nftID, price } = await result.returnValues
        txBlock = blockNumber;
        var parsedPrice = parseFloat(price * 0.000000000000000001).toFixed(3);
        nftType = getNftType(nftAddress, chain);
        nftIdNumber = nftID;

        var bazaarStringLogs = `[logdata]🔽 Sold - [NFT type: ${nftType}  |  NFT ID: ${nftIdNumber}  |  Price: ${parsedPrice}  |  Block Number: ${txBlock}]`;
        console.log(bazaarStringLogs);
    });
}

async function getCancelledListing(currBlockNumber, chain, client) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    var toBlockNumber = Number(currBlockNumber) + Number(1999);
    const contract = new web3.eth.Contract(bazaarABI, contractAddress[chain].bazaar); // init bazaar abi, contract
    const response = await contract.getPastEvents('CancelledListing', { fromBlock: currBlockNumber, toBlock: toBlockNumber }); // get past new listing events based on block number variable

    const arrayResponse = response; // convert response into an array
    var arrayLength = arrayResponse.length; // array length initialize for [for loop]
    console.log(`[logdata][getCancelledListing]${arrayResponse.length}`); // logs array length

    for (let i = 0; i < arrayLength; i++) { // send bazaar data to discord #bsc text channel
        var x = getNftType(arrayResponse[i].returnValues.nftAddress, chain) // initialize nft type for [if statements]
        if (x === "Character") { // fetch all required data for CBC
            var container = await getCBCData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🛑 Cancel	-  [${x}  |  ${container}]`;

            client.channels.fetch(contractAddress[chain].charTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Weapon") { // fetch all required data for CBw
            var container = await getCBWData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🛑 Cancel	-  [${x}  |  ${container}]`;

            client.channels.fetch(contractAddress[chain].weapTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else if (x === "Shield") { // fetch all required data for CBS
            var container = await getCBSData(arrayResponse[i].returnValues.nftID, chain);
            bazaarString = `🛑 Cancel	-  [${x}  |  ${container}]`;

            client.channels.fetch(contractAddress[chain].shieldTrades)
                .then(channel => {
                    channel.send(bazaarString);
                });
        } else {
            console.log("[logdata]NFT Type not supported.")
        }
    }

    response.map(async result => {
        const { blockNumber } = await result
        const { nftAddress, nftID } = await result.returnValues
        txBlock = blockNumber;
        nftType = getNftType(nftAddress, chain);
        nftIdNumber = nftID;

        var bazaarStringLogs = `[logdata]🛑 Cancel - [NFT type: ${nftType}  |  NFT ID: ${nftIdNumber}  |  Block Number: ${txBlock}]`;
        console.log(bazaarStringLogs);
    });
}

async function getAllPartner(chain, client) {
    // declaring web3 environment
    const web3 = new Web3(new Web3.providers.HttpProvider(nodes[chain]));

    const contract = new web3.eth.Contract(treasuryABI, contractAddress[chain].treasury);
    const getActivePartnerProjectsIds = await contract.methods.getActivePartnerProjectsIds().call({ from: USER_ADDRESS });
    let projectArray = getActivePartnerProjectsIds;
    const getAmountOfActiveProjects = await contract.methods.getAmountOfActiveProjects().call({ from: USER_ADDRESS });
    x = getAmountOfActiveProjects;

    for (let i = 0; i < x; i++) {
        const getProjectData = await contract.methods.getProjectData(projectArray[i]).call({ from: USER_ADDRESS });
        const getProjectMultiplier = await contract.methods.getProjectMultiplier(projectArray[i]).call({ from: USER_ADDRESS });
        const getRemainingPartnerTokenSupply = await contract.methods.getRemainingPartnerTokenSupply(projectArray[i]).call({ from: USER_ADDRESS });

        var partnerArray = getProjectData;
        var projectID = projectArray[i];
        var tokenImg = partnerArray[0];
        var tokenDesc = partnerArray[1];
        var projectLink = partnerArray[2];
        var getTokenName = tokenDesc.split(" ")[0];
        var multiplier = parseFloat(getProjectMultiplier * 0.000000000000000001).toFixed(3);
        var claimable = parseFloat(getRemainingPartnerTokenSupply * 0.000000000000000001).toFixed(3);

        if (partnerArray[3].length > 0) {
            var projectTax = partnerArray[3];
        } else {
            var projectTax = 'No additional fee on trading this token.';
        }

        const partnerEmbedMsg = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`TOKEN : ${getTokenName}  |  ID : ${projectID}`)
            .setURL(projectLink)
            .setDescription(tokenDesc)
            .setThumbnail(tokenImg)
            .setFooter({ text: `Note: ${projectTax}`, value: 'Some value here', inline: true })
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Project Details', value: 'Here are some multiplier and remaining token info.' },
                { name: 'Project Multiplier', value: `${multiplier}`, inline: true },
                { name: 'Remaining Tokens', value: `${claimable}`, inline: true },
            )

        client.channels.fetch('1018245386797850655')
            .then(channel => {
                channel.send({ embeds: [partnerEmbedMsg] });
            });
    }
}

module.exports = { isNumber, getCBCData, getCBWData, getCBSData, getNewListing, getListingPriceChange, getPurchasedListing, getCancelledListing, getAllPartner }