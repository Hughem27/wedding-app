const { app } = require('@azure/functions');
const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const containerName = "hugh-and-hannah";

app.http('UploadMedia', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`UploadMedia function triggered`);

        const { fileName } = await request.json();
        if (!fileName) {
            return { status: 400, body: 'Missing fileName in request body.' };
        }

        const uniqueFileName = `${uuidv4()}-${fileName}`;

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists();

        const blobClient = containerClient.getBlockBlobClient(uniqueFileName);
        const expiresOn = new Date(new Date().valueOf() + 3600 * 1000);

        const sasToken = generateBlobSASQueryParameters({
            containerName,
            blobName: uniqueFileName,
            permissions: BlobSASPermissions.parse("cw"),
            expiresOn,
            protocol: SASProtocol.Https
        }, sharedKeyCredential).toString();

        const uploadUrl = `${blobClient.url}?${sasToken}`;

        return {
            status: 200,
            jsonBody: { uploadUrl }
        };
    }
});
