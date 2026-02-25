const g = require("fca-aryan-nix");

module.exports = {
  config: {
    name: "bioka",
    version: "3.1",
    author: "Celestin",
    role: 1, // ADMIN ONLY
    shortDescription: "Publication globale stylée",
    longDescription: "Bioka publie un message stylé avec signature @Celestin",
    category: "ADMIN",
    guide: "Bioka <message>"
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
      const threads = await api.getThreadList(50, null, ["INBOX"]);
      const groups = threads.filter(t => t.isGroup === true);

      let success = 0;

      for (const group of groups) {
        const styledMessage =
`🌍✨ **BIOKA • COMMUNIQUÉ OFFICIEL**
━━━━━━━━━━━━━━━━━━
📝 ${content}

👤 Auteur : @${senderName}
🤖 Diffusé par : Bioka Bot

━━━━━━━━━━━━━━━━━━
✍️ **Signature : @Célestin  **
🔥 Respect • Discipline • Élégance`;

        await api.sendMessage(
          {
            body: styledMessage,
            mentions: [{ tag: senderName, id: senderID }]
          },
          group.threadID
        );

        success++;
        await new Promise(r => setTimeout(r, 6000)); // anti-spam
      }

      return api.sendMessage(
        `✅ **Bioka** a publié avec la signature **@Celestin** dans **${success} groupes** ✔️`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      return api.sendMessage(
        "❌ Publication bloquée par la sécurité Facebook.",
        event.threadID,
        event.messageID
      );
    }
  }
};
