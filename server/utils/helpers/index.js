const { Pinecone } = require("../pinecone");
const { Chroma } = require("../chroma");

function getVectorDbClass() {
  const vectorSelection = process.env.VECTOR_DB || "pinecone";
  switch (vectorSelection) {
    case "pinecone":
      return Pinecone;
    case "chroma":
      return Chroma;
    default:
      console.error("No vector db set in environment yet!")
      return null;
  }
}

module.exports = {
  getVectorDbClass,
};
