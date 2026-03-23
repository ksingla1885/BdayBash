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

    const apiKey = process.env.GROQ_API_KEY || (process.env.OPENAI_API_KEY !== 'your_openai_api_key' ? process.env.OPENAI_API_KEY : null);
    
    if (!apiKey) {
      // Fallback messages if no AI key
      const fallbacks = {
        emotional: `Dear ${receiverName}, on this special day I want you to know that having you in my life is the greatest gift I've ever received. Every moment with you is a treasure I hold close to my heart. May this birthday bring you all the joy, love, and happiness you so deeply deserve. With all my love, ${senderName} 💖`,
        funny: `Hey ${receiverName}! Congratulations — you've successfully survived another trip around the sun! 🌍 Also, you're not getting older, you're just leveling up in the game of life (with more bugs and less hair). Stay weird, stay wonderful! Happy Birthday from ${senderName} 😂🎂`,
        savage: `${receiverName}, let's be real — you're getting old. Like, dinosaur old. But hey, at least you're still breathing, which is more than can be said for your youth. Happy Birthday! — ${senderName} 💀🔥`,
      };
      return res.json({ message: fallbacks[tone] || fallbacks.emotional });
    }

    // Determine if we're using Groq or OpenAI
    const isGroq = process.env.GROQ_API_KEY ? true : false;
    const client = new OpenAI({
      apiKey: apiKey,
      ...(isGroq ? { baseURL: "https://api.groq.com/openai/v1" } : {}),
    });

    const toneInstructions = {
      emotional: 'Write a heartfelt, emotional, and touching birthday message.',
      funny: 'Write a hilarious, funny, and witty birthday message with jokes and emojis.',
      savage: 'Write a savage, roasting, brutally funny birthday message that still feels affectionate.',
    };

    const completion = await client.chat.completions.create({
      model: isGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional birthday message writer. ${toneInstructions[tone] || toneInstructions.emotional} Keep it under 150 words. Use the receiver's name (${receiverName}) and sign off from ${senderName}.`,
        },
        {
          role: 'user',
          content: `Write a ${tone} birthday message from ${senderName} to ${receiverName}.`,
        },
      ],
    });

    const message = completion.choices[0].message.content;
    res.json({ message });
  } catch (err) {
    console.error('generateMessage error:', err);
    res.status(500).json({ error: 'Failed to generate message' });
  }
};
