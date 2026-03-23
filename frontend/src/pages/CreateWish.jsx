import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

const CreateWish = () => {
  const [formData, setFormData] = useState({
    receiverName: '',
    senderName: '',
    message: '',
    tone: 'emotional',
  });
  const [images, setImages] = useState([]);
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleMusicChange = (e) => {
    if (e.target.files?.[0]) {
      setMusic(e.target.files[0]);
    }
  };

  const handleGenerateMessage = async () => {
    if (!formData.receiverName || !formData.senderName) {
      alert("Please enter both receiver and sender names first!");
      return;
    }
    setGenerating(true);
    try {
      const { data } = await api.post('/wish/generate-message', {
        receiverName: formData.receiverName,
        senderName: formData.senderName,
        tone: formData.tone,
      });
      setFormData(prev => ({ ...prev, message: data.message }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate message. Please try writing manually.");
    } finally {
      setGenerating(false);
    }
  };

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    // 1. Get Signature from backend
    const { data: sig } = await api.get('/wish/signature');
    
    // 2. Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', sig.timestamp);
    formData.append('signature', sig.signature);
    formData.append('folder', 'bdaybash');

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`,
      formData
    );

    return {
      url: res.data.secure_url,
      publicId: res.data.public_id
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Images
      const uploadedImages = [];
      for (const img of images) {
        const result = await uploadToCloudinary(img, 'image');
        uploadedImages.push(result);
      }

      // 2. Upload Music if exists
      let musicUrl = null;
      if (music) {
        const result = await uploadToCloudinary(music, 'video'); // Cloudinary uses video for audio
        musicUrl = result.url;
      }

      // 3. Create Wish on Backend
      const response = await api.post('/wish/create', {
        ...formData,
        images: uploadedImages,
        musicUrl
      });

      navigate(`/wish/${response.data.slug}/share`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Upload failed. Try smaller files or check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white"
      >
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            Create a Surprise ✨
          </h2>
          <p className="mt-2 text-gray-600">Make their birthday unforgettable</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">For Who?</label>
                <input
                  type="text"
                  name="receiverName"
                  required
                  value={formData.receiverName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="e.g. Sarah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">From Who?</label>
                <input
                  type="text"
                  name="senderName"
                  required
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="e.g. John"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tone</label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                <option value="emotional">🥺 Heartfelt & Emotional</option>
                <option value="funny">😂 Funny & Humorous</option>
                <option value="savage">🔥 Brutally Savage</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <button
                  type="button"
                  onClick={handleGenerateMessage}
                  disabled={generating}
                  className="text-xs text-pink-500 hover:text-pink-600 font-medium px-3 py-1 bg-pink-50 rounded-full transition-colors"
                >
                  {generating ? '✍️ Generating...' : '✨ Use AI Magic'}
                </button>
              </div>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                placeholder="Write your wishes here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Memories (Images)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-600
                  hover:file:bg-indigo-100 transition-all
                  bg-white/50 border border-gray-200 rounded-xl"
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group">
                      <img 
                        src={URL.createObjectURL(img)} 
                        alt="preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">#{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs font-bold">{images.length}px</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">🎵 Background Music <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleMusicChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-600
                  hover:file:bg-violet-100 transition-all
                  bg-white/50 border border-gray-200 rounded-xl"
              />
              {music && (
                <p className="mt-2 text-sm text-violet-500 text-right">🎶 {music.name}</p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Magic... 🎁' : 'Generate Surprise Link ✨'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateWish;
