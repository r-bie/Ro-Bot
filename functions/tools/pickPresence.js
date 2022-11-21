const { ActivityType } = require("discord.js");

module.exports = (client) => {
    client.pickPresence = async () => {
        const options = [
            {
                type: ActivityType.Listening,
                text: " Looper Bot.",
                status: "dnd"
            }
        ];

        client.user.setPresence({
            activities: [{
                name: options[0].text,
                type: options[0].type
            }],
            status: options[0].status,
        });
    }
}