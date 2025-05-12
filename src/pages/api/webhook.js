import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client;

// Инициализация клиента WhatsApp
const startClient = () => {
  client = new Client();

  client.on('qr', (qr) => {
    // Выводим QR код в терминал для сканирования
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.initialize();
};

startClient();

export default async (req, res) => {
  if (req.method === 'POST') {
    const { message, chatId } = req.body;

    if (message && chatId) {
      try {
        // Отправляем сообщение в WhatsApp
        await client.sendMessage(chatId, message);
        res.status(200).json({ status: 'success', message: 'Message sent!' });
      } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
      }
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid data!' });
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed!' });
  }
};
