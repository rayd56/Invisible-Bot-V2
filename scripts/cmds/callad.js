module.exports = {
    config: {
        name: "callad",
        version: "3.2",
        author: "Octavio Wina",
        role: 0,
        category: "system",
        shortDescription: "Contact supérieur avec système reply",
        guide: {
            fr: "{pn} <message>"
        }
    },

    onStart: async ({ api, event, args, usersData }) => {
        if (!args.length)
            return api.sendMessage("❌ Écris ton message pour le supérieur.", event.threadID);

        const content = args.join(" ");
        const name = await usersData.getName(event.senderID);
        const targetThreadID = "4200466550263927";

        const msg =
`╭─「 📞 APPEL SUPÉRIEUR 」─╮
│
│ De : @${name}
│
│ ${content}
│
╰────────────────────╯

TID origine : ${event.threadID}`;

        api.sendMessage({
            body: msg,
            mentions: [{
                id: event.senderID,
                tag: `@${name}`
            }]
        }, targetThreadID, (err, info) => {

            global.GoatBot.onReply.set(info.messageID, {
                commandName: "callad",
                author: event.senderID,
                threadID: event.threadID
            });

        });

        return api.sendMessage(
`Yo humain tu sais qu'est qui es la biologie informatique.? 
Bien que mon admis accepte seulement ton message sinon.... 
C'est la flemme pour toi 😈
Attend la réponse si tu l'ose.`,
        event.threadID
        );
    },

    onReply: async ({ api, event, Reply }) => {
        if (event.threadID !== "4200466550263927") return;

        const response = event.body;

        const replyMsg =
`╭─「 👑 RÉPONSE DU SUPÉRIEUR 」─╮
│
│ Voilà mon petit… tu n’as même pas pu écrire correctement.
│ Voici ta réponse :
│
│ ${response}
│
╰────────────────────────╯`;

        return api.sendMessage(replyMsg, Reply.threadID);
    }
};
