const axios = require("axios"); 

// ================= CADRE ================= 
function cadre(text) {
  return `╭── 🔎 GITHUB FORK SEARCH ──╮\n${text}\n╰────────────────────────────╯`;
}

// ================= RECHERCHE ================= 
async function searchFork(query) {
  try {
    const searchQuery = encodeURIComponent(`${query} fork:true`);
    const url = `https://api.github.com/search/repositories?q=${searchQuery}&sort=stars&order=desc&per_page=5`;
    const res = await axios.get(url, {
      headers: { "Accept": "application/vnd.github+json" },
      timeout: 20000
    });
    if (!res.data.items || res.data.items.length === 0) {
      return null;
    }
    return res.data.items[0]; // le plus populaire
  } catch (err) {
    return "error";
  }
}

// ================= CMD ================= 
module.exports = {
  config: {
    name: "fork",
    version: "4.0",
    author: "Octavio Wina",
    role: 2, // Modifié pour admin uniquement
    category: "dev",
    shortDescription: "Recherche un vrai fork sur GitHub",
    guide: {
      fr: "{pn} <nom du projet>"
    }
  },
  onStart: async ({ message, args }) => {
    if (!args.length) return message.reply(cadre("❌ Indique le nom du projet à rechercher."));
    const query = args.join(" ");
    await message.reply(cadre(`⏳ Recherche de forks réels pour : ${query}...`));
    const fork = await searchFork(query);
    if (fork === "error") return message.reply(cadre("❌ Erreur GitHub API."));
    if (!fork) return message.reply(cadre("❌ Aucun fork trouvé sur GitHub."));
    const reply = ` 📦 Nom : ${fork.full_name}\n 👤 Auteur : ${fork.owner.login}\n ⭐ Stars : ${fork.stargazers_count}\n 🍴 Forks : ${fork.forks_count}\n 🌐 GitHub : ${fork.html_url}\n 📥 Cloner : git clone ${fork.clone_url} `;
    return message.reply(cadre(reply));
  }
};
