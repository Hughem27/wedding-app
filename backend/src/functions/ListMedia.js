const { app } = require("@azure/functions");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const containerName = "hugh-and-hannah";

app.http("ListMedia", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    let urls = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      const url = `${containerClient.url}/${blob.name}`;
      urls.push(url);
    }

   
    return {
      status: 200,
      jsonBody: { images: urls },
    };
  },
});
