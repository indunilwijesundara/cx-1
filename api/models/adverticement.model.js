import mongoose from "mongoose";
const { Schema } = mongoose;

const adverticementSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    scheduleDateTime: {
      type: Date,
      required: true,
    },
   
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Adverticements", adverticementSchema);
