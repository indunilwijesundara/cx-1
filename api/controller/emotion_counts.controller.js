import Advertisement from "../models/adverticement.model.js";
import EmotionCounts from "../models/emotion_counts.model.js";
import MatchingData from "../models/feedback.model.js";

export const getAllEmotionalCounts = async (req, res) => {
  try {
    // Use Mongoose to find the data by ID
    const data = await EmotionCounts.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching emotional counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllemotionsTimeEqualAdverticementTime = async (req, res) => {
  try {
    // Retrieve all EmotionCounts data from your database
    const emotionDataFromDB = await EmotionCounts.find();

    // Retrieve all Advertisement data from your database
    const advertisementData = await Advertisement.find();

    // Compare the data based on your logic
    const matchingData = [];

    for (const emotionData of emotionDataFromDB) {
      let closestMatch = null;
      let closestDiff = Infinity;

      for (const adverticement of advertisementData) {
        const timestamp = emotionData.timestamp;
        const scheduleDateTime = adverticement.scheduleDateTime.getTime();
        const x = scheduleDateTime / 1000;

        const diff =(timestamp - x);
     
        if (0<=diff <= 30) {
          closestMatch = adverticement;
          closestDiff = diff;
          console.log("timestamp",timestamp)
          console.log("scheduleDateTime",x)
         
        }
      }

      if (closestMatch) {
        const newMatchingData = new MatchingData({
          emotion_counts: {
            anger: emotionData.emotion_counts.anger,
            contempt: emotionData.emotion_counts.contempt,
            disgust: emotionData.emotion_counts.disgust,
            fear: emotionData.emotion_counts.fear,
            happy: emotionData.emotion_counts.happy,
            neutral: emotionData.emotion_counts.neutral,
            sad: emotionData.emotion_counts.sad,
            surprise: emotionData.emotion_counts.surprise,
          },
          advertisement: closestMatch._id
        });

        try {
          await newMatchingData.save();
        } catch (saveError) {
          console.error("Error saving matching data:", saveError);
          return res.status(500).json({ error: "Error saving matching data" });
        }

        matchingData.push({ emotionData, adverticement: closestMatch });
      }
    }

    res.status(200).json(matchingData);
  } catch (error) {
    console.error("Error fetching matching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
