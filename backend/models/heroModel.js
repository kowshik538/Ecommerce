import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  buttonText: String,
  image: String,
}, { timestamps: true });

export const Hero = mongoose.model("Hero", heroSchema);
