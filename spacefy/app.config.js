export default {
  expo: {
    name: "Spacefy",
    slug: "spacefy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      cloudinaryApiUrl: "https://api.cloudinary.com/v1_1",
      cloudinaryCloudName: "dv9x0sxfn",
      cloudinaryApiKey: "123456789012345",
      cloudinaryApiSecret: "abcdefghijklmnopqrstuvwxyz"
    }
  }
}; 