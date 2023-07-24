import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { main } from "./example/upscale-ws";
import "dotenv/config";
import { Midjourney } from "./src";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upscal", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).send("Missing required field: text");
    return;
  }
  process.argv[2] = text;
  try {
    const client = new Midjourney({
      ServerId: <string>process.env.SERVER_ID,
      ChannelId: <string>process.env.CHANNEL_ID,
      SalaiToken: <string>process.env.SALAI_TOKEN,

      Ws: true,
    });
    await client.Connect();
    const text = process.argv[2];
    const Imagine = await client.Imagine(
      text,
      (uri: string, progress: string) => {}
    );
    console.log(Imagine);
    if (!Imagine) {
      return;
    }
    const Upscale = await client.Upscale({
      index: 2,
      msgId: <string>Imagine.id,
      hash: <string>Imagine.hash,
      flags: Imagine.flags,
    });
    console.log(Upscale);
    res.status(201).send(JSON.stringify(Upscale));
    client.Close();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
