import Feedback from "../models/feedback.model.js";
export const generatedFeedback = async (req, res) => {
  //   const { userId, title, video, scheduleDateTime } = req.body;

  try {
    const newFeedback = new Feedback({
      ...req.body,
    });
    console.log(newFeedback);
    const savednewFeedback = await newFeedback.save();
    res.status(201).json(savednewFeedback);
  } catch (error) {
    console.error("Error genrating feedback:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
};
export const getfeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    res.status(200).send(feedback);
  } catch (error) {
    res.status(500).send("Not Found");
  }
};
export const getUserAllFeedbacks = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const feedbacks = await Feedback.find({ userId });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve feedbacks" });
  }
};
export const getAdvertisementAllFeedbacks = async (req, res) => {
  try {
    const { advertismentId } = req.params;
    console.log(advertismentId);
    const feedbacks = await Feedback.find({ advertismentId });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve feedbacks" });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).send(feedback);
  } catch (error) {
    res.status(500).send("Not Found");
  }
};
