import Advertisement from "../models/adverticement.model.js";

export const createAdverticement = async (req, res) => {
  //   const { userId, title, video, scheduleDateTime } = req.body;

  try {
    const newAdvertisement = new Advertisement({
      ...req.body,
    });
    console.log(newAdvertisement);
    const savedAdvertisement = await newAdvertisement.save();
    res.status(201).json(savedAdvertisement);
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({ error: "Failed to create advertisement" });
  }
};
export const editAdverticement = async (req, res) => {
  const { advertisementId } = req.params; // Assuming you pass the advertisement ID as a route parameter
  console.log(advertisementId);
  const updateFields = req.body;
  console.log(updateFields);
  try {
    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      advertisementId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedAdvertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    res.status(200).json(updatedAdvertisement);
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({ error: "Failed to update advertisement" });
  }
};
export const getAdverticement = async (req, res) => {
  try {
    const adverticement = await Advertisement.findById(req.params.id);
    res.status(200).send(adverticement);
  } catch (error) {
    res.status(500).send("Not Found");
  }
};
export const getAllAdverticements = async (req, res) => {
  try {
    const adverticement = await Advertisement.find();
    res.status(200).send(adverticement);
  } catch (error) {
    res.status(500).send("Not Found");
  }
};
export const deleteAdverticement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndDelete(req.params.id);

    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    res.status(500).send("Not found");
  }
};
