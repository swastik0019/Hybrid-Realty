import cloudinary from "cloudinary";

const connectCloudinary = () => {
  try {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Cloudinary Connected");
  } catch (error) {
    console.log("Error while configuring cloudinary : ", error);
  }
};

export default connectCloudinary;
