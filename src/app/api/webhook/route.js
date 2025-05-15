import { NextResponse } from 'next/server';
// import products from '../../products';
import products from '../products';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Webhook работает' });
}

export async function POST(req) {
  const { message, chatId } = await req.json();

  if (!message || !chatId) {
    return NextResponse.json({ status: 'error', message: 'Missing message or chatId' }, { status: 400 });
  }

  try {
    let finalMessage = message;

    if (message.toLowerCase() === 'каталог') {
      finalMessage = products.map(
        (p, i) => `${i + 1}. ${p.name} — ${p.price}\n${p.description}`
      ).join('\n\n');
    }

    // Отправка боту
    const res = await fetch('http://localhost:4000/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: finalMessage }),
    });

    const text = await res.text();

    return NextResponse.json({ status: 'success', message: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 'error', message: 'Failed to send' }, { status: 500 });
  }
}
