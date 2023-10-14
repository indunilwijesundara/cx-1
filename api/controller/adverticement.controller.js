import moment from "moment-timezone";
import Advertisement from "../models/adverticement.model.js";
export const createAdverticement = async (req, res) => {
  try {
    // Extract the scheduleDate, scheduleTime, endScheduleDate, and endScheduleTime from the request body
    const { scheduleDate, scheduleTime, endScheduleDate, endScheduleTime, ...restOfData } = req.body;

    // Combine scheduleDate and scheduleTime to create a valid Date object for local time
    const scheduleDateTimeLocal = moment.tz(`${scheduleDate}T${scheduleTime}`, 'YYYY-MM-DDTHH:mm:ss.SSS', 'YOUR_TIMEZONE').toDate();

    // Combine endScheduleDate and endScheduleTime to create a valid Date object for local time
    const endScheduleDateTimeLocal = moment.tz(`${endScheduleDate}T${endScheduleTime}`, 'YYYY-MM-DDTHH:mm:ss.SSS', 'YOUR_TIMEZONE').toDate();

    // Create a new Advertisement document with the local time values
    const newAdvertisement = new Advertisement({
      ...restOfData, 
      scheduleDateTime: scheduleDateTimeLocal,
      endScheduleDateTime: endScheduleDateTimeLocal,
    });

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
export const getUserAllAdverticements = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the user ID as a parameter
    console.log(userId)
    const advertisements = await Advertisement.find({userId}); // Filter by user ID
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve advertisements" });
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
export const approveAdverticement = async (req, res) => {
  const { advertiseId } = req.params;
console.log(advertiseId)
  try {
    // Find the advertisement by ID and update the status to true
    const advertisement = await Advertisement.findByIdAndUpdate(
      advertiseId,
      { status: true },
      { new: true }
    );

    res.json({ message: 'Advertisement approved successfully', advertisement });
  } catch (error) {
    console.error('Error approving advertisement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const rejectAdverticement = async (req, res) => {
  const { advertiseId } = req.params;
console.log(advertiseId)
  try {
    // Find the advertisement by ID and update the status to true
    const advertisement = await Advertisement.findByIdAndUpdate(
      advertiseId,
      { status: false },
      { new: true }
    );

    res.json({ message: 'Advertisement approved successfully', advertisement });
  } catch (error) {
    console.error('Error approving advertisement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

