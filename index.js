require("dotenv").config("/.env")
const TelegramApi = require("node-telegram-bot-api");
const token_bot = "5650909348:AAFYcHI5VpwtMdSeYi4_PkjQiV_SxbHpY2E"
const bot = new TelegramApi(token_bot, {polling: true});

const startBot = () => {
    bot.setMyCommands([
        {command: "/weather", description: "Погода в Канаде"},
        {command: "/read", description: "Хочу почитать"},
        {command: "/mailing", description: "Сделать рассылку"},
    ])
    
    bot.on("message", msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.chat.username;

        if( text === "/start"){
            
            return bot.sendMessage(chatId, `Здравствуйте. Нажмите на любую интересующую Вас кнопку`);
        }

        return bot.sendMessage(chatId, `Бот вас не понимает. Пожалуйста, ${user}, используйте команды`);
    })
};

startBot();



    