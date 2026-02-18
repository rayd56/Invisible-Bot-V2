const axios = require("axios");

// ================= API Gemini =================
const API_URL = "https://christus-api.vercel.app/ai/gemini-proxy2?prompt=";

// ================= Cadre visuel =================
function cadre(text) {
    return `╭── NODE GENERATOR ──╮\n${text}\n╰──────────────────╯`;
}

// ================= Générateur de code =================
async function generateCode(description) {
    const prompt = `
Tu es un développeur expert Node.js.
Génère un code complet fonctionnel selon la demande :
- Si l'utilisateur demande une cmd GoatBot v2, génère une cmd complète prête à utiliser.
- Si l'utilisateur demande un bot, génère un bot Node.js complet (index.js + cmds).
- Le code doit être JavaScript propre, sans bug, directement exécutable.
- Inclure axios si nécessaire.
- Commenter où placer les clés API.
- Aucun texte hors code.
Demande utilisateur : ${description}
`;

    try {
        const res = await axios.get(API_URL + encodeURIComponent(prompt), { timeout: 40000 });
        return res.data?.result || "// ❌ IA silencieuse";
    } catch {
        return "// ❌ Erreur serveur IA";
    }
}

// ================= CMD GoatBot =================
module.exports = {
    config: {
        name: "node",
        version: "2.5",
        author: "Octavio Wina",
        role: 0,
        category: "ai",
        shortDescription: "Générateur Node.js en direct",
        guide: {
            fr: "{pn} <décris le code à générer>"
        }
    },

    onStart: async ({ message, args, event }) => {
        if (!args.length) {
            return message.reply(cadre("❌ Décris exactement ce que tu veux générer."));
        }

        const description = args.join(" ");
        message.reply(cadre("⏳ Génération en cours…"));

        const code = await generateCode(description);

        // Répond directement avec le code dans le chat
        return message.reply(cadre(code));
    }
};
