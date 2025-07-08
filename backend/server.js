import { createServer } from "./src/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = createServer();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});