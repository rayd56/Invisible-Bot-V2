module.exports = {
  config: {
    name: "noti",
    version: "2.0",
    author: "Octavio Wina",
    role: 2, 
    category: "group",
    shortDescription: "Notification officielle du supérieur",
    guide: {
      fr: "{pn} <message>"
    }
  },
  onStart: async ({ message, args, event, usersData, api }) => {
    if (!args.length) {
      return message.reply("❌ Écris le message de notification.");
    }
    const content = args.join(" ");
    const userName = await usersData.getName(event.senderID);
    const notiMsg = `╭─「 🔔 NOTIFICATION OFFICIELLE 」─╮
│
│ ${content}
│
╰────────────────────────────╯
Message de mon supérieur @${userName}
il vous dit ${content}
Utilisée !callad pour me contacté`;

    try {
      const threadList = await api.getThreadList(10, null, ['INBOX']);
      threadList.forEach((thread) => {
        if (thread.isGroup) {
          api.sendMessage({
            body: notiMsg,
            mentions: [{ id: event.senderID, tag: `@${userName}` }]
          }, thread.threadID);
        }
      });
      return message.reply("✅ Notification envoyée dans tous les groupes.");
    } catch (error) {
      console.error, message.reply("❌ Une erreur est survenue lors de l'envoi de la notification.");
    }
  }
};
