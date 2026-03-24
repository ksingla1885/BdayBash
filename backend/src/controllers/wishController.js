import { customAlphabet } from 'nanoid';
import Wish from '../models/Wish.js';
import OpenAI from 'openai';
import { cloudinary } from '../config/cloudinary.js';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);

// GET /api/wish/signature
export const getSignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'bdaybash' },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({ signature, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate signature' });
  }
};

// POST /api/wish/create
export const createWish = async (req, res) => {
  try {
    const { receiverName, senderName, message, tone, images, musicUrl } = req.body;

    if (!receiverName || !senderName || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (images && images.length > 6) {
      return res.status(400).json({ error: 'Maximum 6 images allowed' });
    }

    let slug;
    let exists = true;
    while (exists) {
      slug = nanoid();
      exists = await Wish.findOne({ slug });
    }

    const wish = await Wish.create({
      slug,
      receiverName,
      senderName,
      message,
      tone: tone || 'emotional',
      images,
      musicUrl,
    });

    res.status(201).json({ slug: wish.slug, id: wish._id });
  } catch (err) {
    console.error('createWish error:', err);
    res.status(500).json({ error: String(err.message || 'Server error') });
  }
};

// GET /api/wish/:slug
export const getWish = async (req, res) => {
  try {
    const wish = await Wish.findOne({ slug: req.params.slug });
    if (!wish) return res.status(404).json({ error: 'Wish not found' });
    res.json(wish);
  } catch (err) {
    console.error('getWish error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const generateMessage = async (req, res) => {
  try {
    const { receiverName, senderName, tone } = req.body;

    // Prioritize Groq if present, otherwise check for valid OpenAI key
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    const apiKey = groqKey || (openaiKey && openaiKey !== 'your_openai_api_key' ? openaiKey : null);
    
    if (!apiKey) {
      console.warn("No AI API key found. Using fallback messages.");
      const fallbacks = {
        emotional: `Dearest ${receiverName}, on your special day, I want to express how much you mean to me. You bring so much light and joy into the world just by being you. May your birthday be filled with all the love and happiness you give to others every day. Happy Birthday! Love, ${senderName} ❤️`,
        funny: `Happy Birthday ${receiverName}! 🎂 You've reached an age where your back goes out more than you do. But hey, at least you're not as old as you'll be next year! Enjoy your day of being the center of attention (and possibly the oldest person in the room). Cheers! — ${senderName} 😂`,
        savage: `${receiverName}, congratulations on surviving another year of your questionable life choices. 💀 You’re aging like fine milk. Just kidding (mostly). Don't expect a expensive gift, my presence is your present. Happy Birthday, you legend! — ${senderName} 🔥`,
      };
      return res.json({ message: fallbacks[tone] || fallbacks.emotional });
    }

    const isGroq = !!groqKey;
    const client = new OpenAI({
      apiKey: apiKey,
      ...(isGroq ? { baseURL: "https://api.groq.com/openai/v1" } : {}),
    });

    const toneInstructions = {
      emotional: 'heartfelt, poetic, deep, and touching. Focus on memories and the beauty of their soul.',
      funny: 'hilarious, witty, relatable, and full of personality. Use clever puns and lighthearted jokes.',
      savage: 'brutally funny, roasts, "lovingly" mean, and total chaos. Use internet slang and savage wit.',
    };

    const completion = await client.chat.completions.create({
      model: isGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a creative birthday message writer. 
          STRICT RULES:
          1. Tone: ${toneInstructions[tone] || toneInstructions.emotional}
          2. Receiver: ${receiverName}
          3. Sender: ${senderName}
          4. Length: 50-120 words.
          5. Variety: BE UNIQUE. Do not use generic clichés like "another trip around the sun" unless you add a twist. 
          6. Style: Use a modern, engaging style with appropriate emojis.
          7. Output: JUST the message. No "Here is your message:", no quotes.`,
        },
        {
          role: 'user',
          content: `Write a completely fresh and unique ${tone} birthday message from ${senderName} to ${receiverName}. Use unique metaphors related to ${tone}.`,
        },
      ],
      temperature: 0.85, // Higher temperature for more variety
      max_tokens: 300,
    });

    const message = completion.choices[0].message.content.trim().replace(/^"|"$/g, '');
    res.json({ message });
  } catch (err) {
    console.error('generateMessage error details:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate a fresh message. AI might be busy.' });
  }
};
