import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Ownly AI, the official intelligent assistant for Ownly — Decentralized Digital Product Passport built on Monad Testnet.

Key Knowledge & Features of Ownly:
1. Decentralized Digital Product Passport: Permanently records warranties, invoices, driver licenses, national IDs, ownership history, and repair records.
2. Monad Testnet: High-speed 10,000 TPS EVM blockchain commitment (Chain ID 10143).
3. Decentralized Storage: Files are encrypted client-side using AES-256 and pinned directly to Pinata IPFS.
4. SHA-256 Web Crypto Verification: On-chain file integrity checker comparing uploaded physical documents against anchored SHA-256 hashes (Verified vs Modified).
5. Ownership Transfers: Zero-friction transfer of digital passports to secondary buyers in a single Web3 transaction.
6. Service Logs: Repair center receipts, maintenance history, and battery/component servicing logged permanently on-chain.

Formatting & Response Instructions:
- State clearly that you are Ownly AI.
- NEVER mention OpenRouter, OpenAI, Llama, Gemini, Claude, or any third-party AI backend.
- DO NOT use markdown bold asterisks like **text**. Write clean, readable plain text without raw markdown symbols.
- Keep answers concise, helpful, friendly, and structured.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured.' },
        { status: 500 }
      );
    }

    const payload = {
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 800,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://ownly.app',
        'X-Title': 'Ownly Digital Passport',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', errorText);

      // Try fallback model if model is busy
      const fallbackPayload = {
        ...payload,
        model: 'google/gemini-2.5-flash',
      };
      const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://ownly.app',
          'X-Title': 'Ownly Digital Passport',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallbackPayload),
      });

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        const content = data.choices?.[0]?.message?.content || 'I am Ownly AI. How can I assist with your Digital Passports today?';
        return NextResponse.json({ reply: content });
      }

      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'I am Ownly AI. How can I assist with your Digital Passports today?';

    return NextResponse.json({ reply: content });
  } catch (error: any) {
    console.error('Chat API Handler Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error in chat service.' },
      { status: 500 }
    );
  }
}
