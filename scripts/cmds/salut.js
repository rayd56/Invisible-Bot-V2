const fonts = {
  mathsans: {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
  }
};

function convertToMathSans(text) {
  return text.split('').map(char => fonts.mathsans[char] || char).join('');
}

module.exports = {
  config: {
    name: "salut",
    version: "1.0",
    author: "Luka", // ⚠️  Ne modifie pas pas l'auteur 
    countDown: 0,
    role: 0,
    shortDescription: "Répond avec une salutation personnalisée",
    longDescription: "Répond avec un message de salutation qui inclut le nom de l'utilisateur lorsque quelqu'un écrit 'salut'.",
    category: "FUN",
  },
  onStart: async function() {},
  onChat: async function({ event, message, api }) {
    try {
      if (event.body && event.body.toLowerCase() === "salut") {
        const senderID = event.senderID;
        const senderInfo = await api.getUserInfo(senderID);
        const senderName = senderInfo[senderID]?.name || 'utilisateur';     
        const responses = [
          `Salut ${senderName} ! Comment puis-je t'aider aujourd'hui ?`,
          `Bonjour ${senderName} ! Que puis-je faire pour toi ? 😇`,
          `Hey ${senderName} ! Comment ça va ? 🪶`,
          `Salut ${senderName}, quel est le programme aujourd'hui ? 🤡`,
          `Salut ${senderName}, tout va bien ?🏀`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const styledResponse = convertToMathSans(randomResponse);
        await message.reply(styledResponse);
        
        await api.setMessageReaction("🍓", event.messageID, () => {}, true);
      }
    } catch (error) {
      console.error("Erreur lors du traitement du message :", error);
    }
  }
};
