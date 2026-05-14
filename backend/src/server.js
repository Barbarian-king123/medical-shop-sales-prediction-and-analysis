const app = require("./app");

const PORT = process.env.PORT || 5000;

// 👇 THIS IS app.listen
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(process.env.JWT_SECRET);
});

// Optional: handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  server.close(() => {
    process.exit(1);
  });
});