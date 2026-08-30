import { OpenRouter } from '@openrouter/sdk';
import dotenv from 'dotenv';

dotenv.config();

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateWish = async (req, res) => {
  const { receiverName, tone, keywords, senderName } = req.body;

  if (!receiverName || !tone) {
    return res.status(400).json({ error: 'Receiver name and tone are required' });
  }

  const prompt = `
    Write a highly creative and engaging birthday wish for ${receiverName} from ${senderName || 'their friend'}.
    Tone: ${tone}
    Keywords/Context: ${keywords || 'general birthday wish'}
    
    Requirements:
    - If tone is 'savage', be roast-level funny but keep it friendly enough for a birthday.
    - If tone is 'emotional', make it deeply touching and heartwarming.
    - If tone is 'funny', use puns, jokes, or lighthearted humor.
    - Keep it under 100 words.
    - Do not include any intro or outro text, just the wish itself.
  `;

  try {
    const completion = await openrouter.chat.send({
      chatRequest: {
        model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
        messages: [{ role: 'user', content: prompt }],
      }
    });

    const wish = completion.choices[0]?.message?.content?.trim();
    if (!wish) {
      throw new Error('Received empty response from OpenRouter');
    }
    res.json({ wish });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate wish. Please try again.' });
  }
};

