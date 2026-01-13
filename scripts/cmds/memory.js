module.exports = {
  config: {
    name: "memory",
    aliases: ["memo"],
    version: "1.0",
    author: "rayd",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Jeu de mémoire avec emojis"
    },
    longDescription: {
      fr: "Mémorise une suite d’emojis et répète-la correctement"
    },
    category: "games",
    guide: {
      fr: "Utilise : memory"
    }
  },
  onStart: async function ({ api, event }) {
    const emojiPacks = [
      ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍"],
      ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
      ["😀", "😂", "🥲", "😍", "😎", "🤓", "😡", "😭"],
      ["⚽", "🏀", "🎮", "🎯", "🏓", "🏸"],
      ["🚗", "🚕", "🚌", "🚓", "🚑", "🚒"],
      ["🌟", "🔥", "💎", "⚡", "🌈", "❄️"]
    ];
    const emojis = emojiPacks[Math.floor(Math.random() * emojiPacks.length)];
    const length = Math.floor(Math.random() * 3) + 3;
    let sequence = [];
    for (let i = 0; i < length; i++) {
      sequence.push(emojis[Math.floor(Math.random() * emojis.length)]);
    }
    api.sendMessage(
      `🧠 MEMORY GAME 🧠\n\nMémorise cette suite :\n\n${sequence.join(" ")}\n\n⏳ 5 secondes...`,
      event.threadID,
      (err, info) => {
        setTimeout(() => {
          api.unsendMessage(info.messageID); // Supprime le message initial
          api.sendMessage(
            "⌨️ Répète maintenant la suite EXACTEMENT :",
            event.threadID,
            (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "memory",
                author: event.senderID,
                sequence
              });
            }
          );
        }, 5000);
      }
    );
  },
  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    const userInput = event.body.trim().split(/\s+/);
    const correct = Reply.sequence;
    const win = userInput.length === correct.length && userInput.every((e, i) => e === correct[i]);
    if (win) {
      api.sendMessage("🎉 Félicitations ! T'as trouvé ! 🧠🔥", event.threadID);
    } else {
      api.sendMessage(
        `❌ Mauvaise réponse !\n\n✅ Réponse correcte :\n${correct.join(" ")}`,
        event.threadID
      );
    }
    global.GoatBot.onReply.delete(event.messageReply.messageID);
  }
};
