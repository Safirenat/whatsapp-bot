const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const products = require('./products');

const app = express();
app.use(bodyParser.json());

let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'my-bot-session' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📲 Сканируй QR-код для входа в WhatsApp');
});

client.on('authenticated', () => {
  console.log('✅ Авторизация прошла');
});

client.on('ready', () => {
  isReady = true;
  console.log('✅ WhatsApp клиент готов к работе');
});

client.on('disconnected', (reason) => {
  isReady = false;
  console.log('❌ Клиент отключён:', reason);
});

// 🔹 Входящие сообщения
client.on('message', async (msg) => {
  console.log('📩 Входящее сообщение:', {
    from: msg.from,
    body: msg.body,
  });

  try {
    const text = msg.body.trim().toLowerCase();

    if (text === 'привет') {
      // await msg.reply('Привет! Напиши "каталог", чтобы получить список товаров.');
      await client.sendMessage(msg.from, 'Привет! Напиши "каталог", чтобы получить список товаров.');

    } else if (text === 'каталог') {
      await msg.reply(
        '📦 Каталог:\n1. Стол — 5000₽\n2. Стул — 2000₽\n3. Полка — 1500₽\n\nНапиши номер, чтобы узнать подробнее, или "хочу [номер]" для заказа.'
      );
    } else if (/^\d+$/.test(text)) {
      const selectedId = parseInt(text);
      const product = products.find(p => p.id === selectedId);

      if (product) {
        try {
          // const media = await MessageMedia.fromUrl(product.image);
          const media = MessageMedia.fromFilePath(product.image);

          await client.sendMessage(msg.from, media);
        } catch (err) {
          console.warn('⚠️ Фото не загрузилось:', err.message);
        }

        await client.sendMessage(
          msg.from,
          `🔎 ${product.name}\n💵 ${product.price}\n📝 ${product.description}\n\nЧтобы заказать, напиши: хочу ${product.id}`
        );
      } else {
        await msg.reply('❌ Товар не найден. Напиши "каталог", чтобы посмотреть список.');
      }
    } else if (/^хочу\s+\d+$/.test(text)) {
      const selectedId = parseInt(text.split(' ')[1]);
      const product = products.find(p => p.id === selectedId);

      if (product) {
        await msg.reply(`🎉 Отличный выбор!\nМы зафиксировали ваш интерес к "${product.name}" за ${product.price}. Менеджер свяжется с вами.`);
      } else {
        await msg.reply('❌ Не удалось найти товар. Проверь номер и попробуй снова.');
      }
    } else {
      await msg.reply('🤖 Я бот. Напиши "каталог", номер товара или "хочу [номер]".');
    }
  } catch (err) {
    console.error('❌ Ошибка при ответе на сообщение:', err.message);
  }
});

client.initialize();

// ──────────────────────────────────────────────
// Express API: статус и отправка
// ──────────────────────────────────────────────

app.get('/status', (req, res) => {
  if (isReady) {
    res.send('✅ Client is ready');
  } else {
    res.status(503).send('❌ Client not ready');
  }
});

app.post('/send', async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).send('❗ Отсутствует chatId или message');
  }

  if (!isReady || !client.info) {
    return res.status(503).send('❌ Клиент не готов');
  }

  try {
    console.log(`📤 Отправка: [${chatId}] ${message}`);
    await client.sendMessage(chatId, message);
    res.send('✅ Message sent');
  } catch (err) {
    console.error('❌ Ошибка при отправке сообщения:', err.message);
    res.status(500).send('Ошибка при отправке сообщения');
  }
});

app.listen(4000, () => {
  console.log('🚀 Бот запущен и слушает на http://localhost:4000');
});
