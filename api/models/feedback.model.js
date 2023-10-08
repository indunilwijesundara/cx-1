import mongoose from "mongoose";
const { Schema } = mongoose;

const feedbackSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    advertismentId: {
      type: String,
      required: true,
    },
    feedback: {
      type: {
        Happy: Number,
        Sad: Number,
        Angry: Number,
        Disgust: Number,
        Fear: Number,
        Neutral: Number,
        Surprise: Number,
      },
      default: {
        Happy: 0,
        Sad: 0,
        Angry: 0,
        Disgust: 0,
        Fear: 0,
        Neutral: 0,
        Surprise: 0,
      },
    },
  },
  {
    timesTamps: true,
  }
);
export default mongoose.model("Feedbacks", feedbackSchema);
