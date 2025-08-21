import { Hero } from "../models/heroModel.js";
import fs from "fs";

export const addHeroSlide = async (req, res) => {
  try {
    const { title, subtitle, buttonText } = req.body;
    const image = req.file.filename;

    const newSlide = new Hero({ title, subtitle, buttonText, image });
    await newSlide.save();
    res.status(200).json({ success: true, message: "Slide added", data: newSlide });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await Hero.find();
    res.status(200).json({ success: true, data: slides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await Hero.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ success: false, message: "Slide not found" });

    const imagePath = `uploads/${slide.image}`;
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    res.status(200).json({ success: true, message: "Slide deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateHeroSlide = async (req, res) => {
  try {
    const { title, subtitle, buttonText } = req.body;
    const updateData = { title, subtitle, buttonText };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Hero.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({ success: true, message: "Slide updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};