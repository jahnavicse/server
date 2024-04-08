import mongoose from "mongoose";

const prodSchema = mongoose.Schema(

    { name: { type: String, required: true },
      price: { type: String, required: true }
    },
    { timestamps: true }
  );
 export default mongoose.model("products", prodSchema);