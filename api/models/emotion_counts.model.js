import mongoose from "mongoose";
const { Schema } = mongoose;

const emotionCountsSchema = new Schema({
  emotion_counts: {
    type: {
      anger: Number,
      contempt: Number,
      disgust: Number,
      fear: Number,
      happy: Number,
      neutral: Number,
      surprise: Number,
      sad: Number,
    },
    default: {
      anger: 0,
      contempt: 0,
      disgust: 0,
      fear: 0,
      happy: 0,
      neutral: 0,
      surprise: 0,
      sad: 0,
    },
  },
  advertisementId: {
    type: String,
    required: true,
  },
  scheduleDateTime: {
    type: Date,
    required: true,
  },
  timestamp: {
    type: Number,
  },
});
export default mongoose.model("Emotion_counts", emotionCountsSchema);
