const chalk = require("chalk");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.pickPresence;
        console.log(`${client.user.tag} is ${chalk.green('online')}!`);
        console.log("");
    }
}