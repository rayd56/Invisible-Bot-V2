const g = require("fca-aryan-nix");

module.exports = {
  config: {
    name: "bioka",
    version: "1.0",
    author: "Celestin",
    role: 1, // 🔒 ADMIN ONLY
    shortDescription: "Publication sur le compte du bot",
    longDescription: "Publie un message sur le compte Facebook du bot en mentionnant l’admin",
    category: "ADMIN",
    guide: "Bioka <message à publier>"
  },

  onStart: async function ({ api, event, args }) {
    const senderID = event.senderID;
    const senderName = event.senderName || "Administrateur";
    const content = args.join(" ");

    if (!content) {
      return api.sendMessage(
        "⚠️ Utilisation : Bioka <message à publier>",
        event.threadID,
        event.messageID
      );
    }

    try {
      const postBody =
`📝 Publication Bioka

${content}

— Publié par @${senderName}`;

      // Publier sur le compte du bot
      await api.createPost({
        body: postBody,
        mentions: [
          {
            tag: senderName,
            id: senderID
          }
        ]
      });

      return api.sendMessage(
        {
          body: "✅ Publication effectuée avec succès sur le compte du bot.",
          replyTo: event.messageID
        },
        event.threadID
      );

    } catch (err) {
      return api.sendMessage(
        "❌ Impossible de publier. Facebook a peut-être bloqué cette action.",
        event.threadID,
        event.messageID
      );
    }
  }
};

const w = new g.GoatWrapper(module.exports);
w.applyNoPrefix({ allowPrefix: true });
