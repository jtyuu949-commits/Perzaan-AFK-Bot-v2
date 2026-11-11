const mineflayer = require('mineflayer');

// Настройки подключения и авторизации
const botArgs = {
  host: 'ваш_сервер.aternos.me', // Адрес вашего сервера
  port: 25565,                   // Порт сервера
  username: 'BotPlayer',         // Никнейм бота
  version: false,                // Автоопределение версии
  password: 'MyStrongPassword123' // Пароль для регистрации и входа
};

function createBot() {
  const bot = mineflayer.createBot(botArgs);
  let activityInterval = null;

  // Слушаем сообщения в чате для автоматической регистрации и входа
  bot.on('messagestr', (message) => {
    const msg = message.toLowerCase();

    // Если сервер просит зарегистрироваться
    if (msg.includes('/register') || msg.includes('/reg') || msg.includes('зарегистрируйтесь')) {
      console.log('Сервер запросил регистрацию. Отправляю команду...');
      // Некоторые плагины требуют ввод пароля дважды (/register пароль пароль)
      bot.chat(`/register ${botArgs.password} ${botArgs.password}`);
    } 
    // Если сервер просит войти в аккаунт
    else if (msg.includes('/login') || msg.includes('/l ') || msg.includes('авторизуйтесь') || msg.includes('войдите')) {
      console.log('Сервер запросил вход. Отправляю пароль...');
      bot.chat(`/login ${botArgs.password}`);
    }
  });

  // Действия при успешном спавне на сервере
  bot.on('spawn', () => {
    console.log('Бот зашел на сервер!');

    // Очищаем старый таймер, если бот перезаходил
    if (activityInterval) clearInterval(activityInterval);

    // Имитация активности каждые 15 секунд
    activityInterval = setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);

      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      bot.look(yaw, pitch);

      bot.swingArm();
    }, 15000);
  });

  // Переподключение при кике или перезагрузке
  bot.on('end', () => {
    console.log('Бот отключен. Переподключение через 10 секунд...');
    if (activityInterval) clearInterval(activityInterval);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Произошла ошибка:', err.message);
  });
}

createBot();

