import mongoose from 'mongoose';

const wishSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    receiverName: {
      type: String,
      required: true,
      trim: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ['emotional', 'funny', 'savage'],
      default: 'emotional',
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    musicUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Wish = mongoose.model('Wish', wishSchema);
export default Wish;
