const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "fluxpro",
    version: "1.0",
    author: "Christus",
    countDown: 5,
    role: 0,
    description: {
      fr: "Génère une image IA en utilisant l'API Oculux Flux 1.1 Pro",
    },
    category: "générateur d'image",
    guide: {
      fr: "{pn} <prompt>\nExemple : {prefix}fluxpro samouraï cyberpunk sous la pluie",
    },
  },

  onStart: async function ({ message, event, args, api, commandName }) {
    const prefix =
      global.utils?.getPrefix?.(event.threadID) ||
      global.GoatBot?.config?.prefix ||
      "/";

    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply(
        `⚠️ Veuillez fournir un prompt.\nExemple : ${prefix}${commandName} dragon futuriste volant dans l'espace`
      );
    }

    api.setMessageReaction("🎨", event.messageID, () => {}, true);
    const waitingMsg = await message.reply(
      "🎨 Génération de votre image... Veuillez patienter..."
    );

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://dev.oculux.xyz/api/flux-1.1-pro?prompt=${encodedPrompt}`;
    const imgPath = path.join(__dirname, "cache", `fluxpro_${event.senderID}.png`);

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, response.data);

      await message.reply(
        {
          body: `✅ Voici votre image FluxPro IA.\n🖋️ Prompt : ${prompt}`,
          attachment: fs.createReadStream(imgPath),
        },
        () => {
          fs.unlinkSync(imgPath);
          if (waitingMsg?.messageID) api.unsendMessage(waitingMsg.messageID);
        }
      );
    } catch (error) {
      console.error("Erreur de génération FluxPro :", error);
      message.reply("⚠️ Échec lors de la génération de l'image FluxPro. Veuillez réessayer plus tard.");
      if (waitingMsg?.messageID) api.unsendMessage(waitingMsg.messageID);
    }
  },
};
