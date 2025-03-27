import mongoose from "mongoose";

const businessInfoSchema = new mongoose.Schema({
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
});

const BusinessInfoModel = mongoose.models.businessInfo || mongoose.model("businessInfo", businessInfoSchema);

export default BusinessInfoModel;
