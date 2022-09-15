require("dotenv").config("/.env");

const { default: axios } = require("axios");
axios.defaults.withCredentials = true;

const TelegramApi = require("node-telegram-bot-api");
const token_bot = process.env.TOKEN_API;
const bot = new TelegramApi(token_bot, { polling: true });
const archive =
  "https://drive.google.com/file/d/1Xs_YjOLgigsuKl17mOnR_488MdEKloCD/view";
const photo =
  "https://pythonist.ru/wp-content/uploads/2020/03/photo_2021-02-03_10-47-04-350x2000-1.jpg";

class GismeteoApi {
  async getWeather() {
    try {
      const { data } = await axios
        .get(process.env.REQUEST_URL)
        .then((response) => response)
        .catch((error) => error);

      return { data };
    } catch (error) {
      console.log(error);
    }
  }
}

const mailing_options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Уверен", callback_data: "true" },
        { text: "Отмена", callback_data: "false" },
      ],
    ],
  }),
};

const startBot = () => {
  let flag = false;

  bot.setMyCommands([
    { command: "/weather", description: "Погода в Канаде" },
    { command: "/read", description: "Хочу почитать" },
    { command: "/mailing", description: "Сделать рассылку" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const user = msg.chat.username;

    if (text === "/start") {
      return bot.sendMessage(
        chatId,
        `Здравствуйте. Нажмите на любую интересующую Вас кнопку`
      );
    }

    if (text === "/read") {
      await bot.sendPhoto(chatId, photo);
      await bot.sendMessage(
        chatId,
        "Идеальный карманный справочник для быстрого ознакомления с особенностями работы разработчиков на Python. Вы найдете море краткой информации о типах и операторах в Python, именах специальных методов, встроенных функциях, исключениях и других часто используемых стандартных модулях."
      );
      return bot.sendMessage(chatId, archive);
    }

    if (text === "/weather") {
      const weather = new GismeteoApi();
      const data = weather.getWeather(chatId);

      return data.then((data) => {
        const temp = Math.round(data.data.main.temp - 273);
        const nameCity = data.data.name;

        return bot.sendMessage(chatId, `Погода в ${nameCity} ${temp} ℃.`);
      });
    }

    if (text === "/mailing") {
      return bot.sendMessage(
        chatId,
        "Вы выбрали рассылку всем пользователям. Вы уверен что хотите это сделать?",
        mailing_options
      );
    }

    if (flag == true) {
      await bot.sendMessage(chatId, text);
      flag = false;
    }

    return bot.sendMessage(
      chatId,
      `Бот вас не понимает. Пожалуйста, ${user}, используйте команды.`
    );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "true") {
      await bot.sendMessage(
        chatId,
        "Введите сообщение, которое хотите отправить всем пользователям."
      );
      flag = true;
    }
  });
};

startBot();
