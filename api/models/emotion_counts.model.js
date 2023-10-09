import mongoose from "mongoose";
const { Schema } = mongoose;

const emotionCountsSchema = new Schema(
  {

    emotion_counts: {
      type: {
anger: Number,
contempt: Number,
disgust: Number,
fear: Number,
happy: Number,
neutral: Number,
surprise: Number,
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
    most_detected_emotion:
    {
      type:String,
      required: true,
    },timestamp:{
type:Number
    }
  },
 
);
export default mongoose.model("Emotion_counts", emotionCountsSchema);
