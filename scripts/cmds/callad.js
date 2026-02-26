const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];
const CONTACT_GROUP_ID = "4200466550263927";  // ID du groupe de logs
const ALLOWED_RESPONDERS = ["61577243652962"]; // Seuls ces UIDs peuvent répondre
module.exports = {
	config: {
		name: "callad",
		version: "4.0",
		author: "ᎬᎷᏢᎬᏒᎬᏌᏒ ᏒᎾᎷᎬᎾ",
		countDown: 5,
		role: 0,
		description: "Contact Admin",
		category: "contacts",
		guide: "   {pn} <message>"
	},

	langs: {
		en: {
			missingMessage: "🎧| 𝗣𝗹𝗲𝗮𝘀𝗲 enter 𝘁𝗵𝗲 message 𝘆𝗼𝘂 want 𝘁𝗼 send ✍️🤼",
			notConfigured: "⚠️ | Contact system is not configured",
			success: "✅ | 𝗬𝗼𝘂𝗿 message 𝗵𝗮𝘀 been 𝘀𝗲𝗻𝘁 to 𝗮𝗱𝗺𝗶𝗻!\n| They 𝘄𝗶𝗹𝗹 reply 𝘀𝗼𝗼𝗻.\n\n 𝗡𝗕: Just 𝗿𝗲𝗽𝗹𝘆 to 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝘀 to 𝗰𝗼𝗻𝘁𝗶𝗻𝘂𝗲✍️🤠",
			sendError: "| An error occurred while sending your message🪶😐",
			fromGroup: "\nFrom group: %1\nThread ID: %2",
			fromUser: "\nFrom user",
			adminReply: "Reply 𝗳𝗿𝗼𝗺 admin❯_ ɾ𝖺ɥÐ𝖾ɳ Ð 𝗚ɧ𝗈𝗎𝗅:\n❯_━━━━━━Ι ❖ Ι━━━━━━_❮\n𝗠𝘀𝗴: %1\n┗━━━━━━━Ι ❖ Ι━━━━━━━┛",
			replySuccess: "✅ | Reply 𝘀𝗲𝗻𝘁!✍️🤠",
			userReply: "┏━━━━━━━Ι ❖ Ι━━━━━━━┓\n𝗥𝗲𝗽𝗹𝘆 from %1:\n%2\n┗━━━━━━━Ι ❖ Ι━━━━━━━┛\n 𝗥𝗲𝗽𝗹𝘆 to 𝘁𝗵𝗶𝘀 message 𝘁𝗼 𝗿𝗲𝘀𝗽𝗼𝗻𝗱",
			newUserJoined: "┏━━━━━━━Ι ❖ Ι━━━━━━━┓\n𝗡𝗘𝗪 USER 𝗝𝗢𝗜𝗡𝗘𝗗 CONVERSATION\n. ❯_━━━━━━━━━━━━_❮\nFrom: %1\n𝗨𝗜𝗗: %2%3\n\n 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n%4\n┗━━━━━━━Ι ❖ Ι━━━━━━━┛\n"
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		// Vérifier si le système est configuré
		if (!CONTACT_GROUP_ID || CONTACT_GROUP_ID === "TON_ID_DE_GROUPE_ICI_MON_PETIT") {
			return message.reply(getLang("notConfigured"));
		}

		// Vérifier si un message est fourni
		if (!args[0]) {
			return message.reply(getLang("missingMessage"));
		}

		const { senderID, threadID, isGroup } = event;
		const senderName = await usersData.getName(senderID);
		
		// Construire le message pour le groupe
		let contactMsg = "┏━━━━━━━Ι ❖ Ι━━━━━━━┓\n";
		contactMsg += "          𝗡𝗘𝗪 𝗖𝗢𝗡𝗧𝗔𝗖𝗧\n";
		contactMsg += "❯_━━━━━━Ι ❖ Ι━━━━━━_❮\n";
		contactMsg += `𝗗𝗲: ${senderName}\n`;
		contactMsg += `𝗨𝗶𝗱: ${senderID}`;
		
		if (isGroup) {
			const threadInfo = await threadsData.get(threadID);
			contactMsg += getLang("fromGroup", threadInfo.threadName || "Sans nom", threadID);
		} else {
			contactMsg += getLang("fromUser");
		}
		
		contactMsg += "\n\n 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:\n";
		contactMsg += args.join(" ");
		contactMsg += "\n┗━━━━━━━Ι ❖ Ι━━━━━━━┛\n";
		contactMsg += "📝 𝗥𝗲𝗽𝗼𝗻𝗱𝘀 à 𝗰𝗲 message 𝗽𝗼𝘂𝗿 répondre✍️🤠";

		const formMessage = {
			body: contactMsg,
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		// Envoyer dans le groupe de contact
		try {
			const messageSent = await api.sendMessage(formMessage, CONTACT_GROUP_ID);
			
			// Sauvegarder la conversation
			global.GoatBot.onReply.set(messageSent.messageID, {
				commandName,
				messageID: messageSent.messageID,
				userThreadID: threadID,
				userID: senderID,
				userName: senderName,
				userMessageID: event.messageID,
				type: "waitingAdminReply"
			});

			// Confirmer à l'utilisateur
			return message.reply(getLang("success"));
		}
		catch (error) {
			console.log("Erreur callad:", error);
			return message.reply(getLang("sendError"));
		}
	},

	onReply: async function ({ args, event, api, message, Reply, usersData, threadsData, commandName, getLang }) {
		const { type, userThreadID, userID, userName, userMessageID } = Reply;
		if (type === "waitingAdminReply" && event.threadID === CONTACT_GROUP_ID) {
			// Vérification: Seuls les UIDs autorisés peuvent répondre
			if (!ALLOWED_RESPONDERS.includes(event.senderID)) {
				return; // Ignorer si ce n'est pas un admin autorisé
			}
			
			const replyMessage = {
				body: getLang("adminReply", args.join(" ")),
				attachment: await getStreamsFromAttachment(
					event.attachments.filter(item => mediaTypes.includes(item.type))
				)
			};

			// Envoyer la réponse à l'utilisateur
			api.sendMessage(replyMessage, userThreadID, (err, info) => {
				if (err) {
					return message.reply("❌ | Erreur lors de l'envoi");
				}

				// Sauvegarder pour que l'user ORIGINAL puisse répondre
				global.GoatBot.onReply.set(info.messageID, {
					commandName,
					messageID: info.messageID,
					adminMessageID: event.messageID,
					userID: userID,
					userName: userName,
					userThreadID: userThreadID,
					type: "waitingUserReply"
				});
   // Sauvegarder AUSSI sur le message de l'admin dans le groupe
				global.GoatBot.onReply.set(event.messageID, {
					commandName,
					messageID: event.messageID,
					currentUserID: userID,
					currentUserName: userName,
					currentUserThreadID: userThreadID,
					type: "openConversation"
				});

				message.reply(getLang("replySuccess"));
			}, userMessageID);
		}
		
		else if (type === "waitingUserReply" && event.senderID === userID) {
			const userReplyMsg = {
				body: getLang("userReply", userName, args.join(" ")),
				mentions: [{
					id: userID,
					tag: userName
				}],
				attachment: await getStreamsFromAttachment(
					event.attachments.filter(item => mediaTypes.includes(item.type))
				)
			};

			// Envoyer dans le groupe de contact
			api.sendMessage(userReplyMsg, CONTACT_GROUP_ID, (err, info) => {
				if (err) {
					return message.reply("❌ | Erreur");
				}

				// Re-sauvegarder pour continuer la conversation
				global.GoatBot.onReply.set(info.messageID, {
					commandName,
					messageID: info.messageID,
					userThreadID: userThreadID,
					userID: userID,
					userName: userName,
					userMessageID: event.messageID,
					type: "waitingAdminReply"
				});

				message.reply(getLang("replySuccess"));
			}, Reply.adminMessageID);
		}
		// NOUVEAU USER REJOINT LA CONVERSATION (dans le groupe)
		else if (type === "openConversation" && event.threadID === CONTACT_GROUP_ID) {
			// Si c'est un nouvel user (pas l'user actuel de la conversation)
			if (event.senderID !== Reply.currentUserID && !ALLOWED_RESPONDERS.includes(event.senderID)) {
				const newUserID = event.senderID;
				const newUserName = await usersData.getName(newUserID);
				
				// Déterminer d'où vient le nouveau user
				let fromInfo = "";
				const isGroup = event.isGroup;
				if (isGroup) {
					const threadInfo = await threadsData.get(event.threadID);
					fromInfo = getLang("fromGroup", threadInfo.threadName || "Sans nom", event.threadID);
				} else {
					fromInfo = getLang("fromUser");
				}

				// Message pour le groupe
				const newUserMsg = {
					body: getLang("newUserJoined", newUserName, newUserID, fromInfo, args.join(" ")),
					mentions: [{
						id: newUserID,
						tag: newUserName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				// Envoyer dans le groupe
				api.sendMessage(newUserMsg, CONTACT_GROUP_ID, (err, info) => {
					if (err) return;

					// Sauvegarder pour que l'admin puisse répondre au nouveau user
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						userThreadID: event.threadID,
						userID: newUserID,
						userName: newUserName,
						userMessageID: event.messageID,
						type: "waitingAdminReply"
					});
				}, event.messageID);

				// Confirmer au nouveau user
				message.reply(getLang("success"));
			}
		}
	}
};
