if (process.env.NODE_ENV === 'development') require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
if (process.env.NODE_ENV === 'production') require("dotenv").config();
const { viewLocalFiles } = require("../utils/files");
const { getVectorDbClass } = require("../utils/helpers");

function systemEndpoints(app) {
  if (!app) return;

  app.get("/ping", (_, response) => {
    response.sendStatus(200);
  });

  app.get("/setup-complete", (_, response) => {
    try {
      const vectorDB = process.env.VECTOR_DB || "pinecone";
      const results = {
        VectorDB: vectorDB,
        OpenAiKey: !!process.env.OPEN_AI_KEY,
        OpenAiModelPref: process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo",
        ...(vectorDB === "pinecone"
          ? {
            PineConeEnvironment: process.env.PINECONE_ENVIRONMENT,
            PineConeKey: !!process.env.PINECONE_API_KEY,
            PineConeIndex: process.env.PINECONE_INDEX,
          }
          : {}),
        ...(vectorDB === "chroma"
          ? {
            ChromaEndpoint: process.env.CHROMA_ENDPOINT,
          }
          : {}),
      };
      response.status(200).json({ results });
    } catch (e) {
      console.error(e.message)
      response.sendStatus(500);
    }

  });

  app.get("/system-vectors", async (_, response) => {
    try {
      const VectorDb = getVectorDbClass();
      const vectorCount = await VectorDb.totalIndicies();
      response.status(200).json({ vectorCount });
    } catch (e) {
      console.error(e.message)
      response.sendStatus(500);
    }
  });

  app.get("/local-files", async (_, response) => {
    try {
      const localFiles = await viewLocalFiles();
      response.status(200).json({ localFiles });
    } catch (e) {
      console.error(e.message)
      response.sendStatus(500);
    }
  });
}

module.exports = { systemEndpoints };