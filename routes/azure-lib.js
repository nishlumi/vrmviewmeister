// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/*
 Setup: Enter your storage account name and shared key in main()
*/

const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');



class UserAzureBlobManager {
    constructor(accname, acckey) {

        // Enter your storage account name and shared key
        this.account = accname || "";
        this.accountKey = acckey || "";
        this.sharedKeyCredential = new StorageSharedKeyCredential(this.account, this.accountKey);

        this.blobServiceClient = new BlobServiceClient(
            // When using AnonymousCredential, following url should include a valid SAS or support public access
            `https://${this.account}.blob.core.windows.net`,
            this.sharedKeyCredential
        );
        this.containerClient = null;
    }
    async SetContainer(container_name) {
        let i = 1;
        for await (const container of this.blobServiceClient.listContainers()) {
            console.log(`Container ${i++}: ${container.name}`);
            if (container.name == container_name) {
                //containerClient = container;
                this.containerClient = this.blobServiceClient.getContainerClient(container.name );
            }
        }
    }
    async ListBlob(container_name, alsoData = false) {
        let blobs = this.containerClient.listBlobsFlat({});
        var ret = [];
        for await (const bb of blobs) {
            var linedata = {
                "id" : bb.name,
                "name": bb.name,
                "fullname": `${container_name}/${bb.name}`,
                "size": bb.properties.contentLength,
                "type": bb.properties.contentType,
                "createDate": bb.properties.createdOn.valueOf(),
                "updatedDate": bb.properties.lastModified.valueOf(),
                "dir" : {
                    "name" : container_name,
                    "id" : "",
                }
            };
            if (alsoData == true) {
                var dt = await this.DownloadAs("string",bb.name,{});
                linedata["data"] = dt;
            }
            ret.push(linedata);
        }
        return ret;
    }
    async DownloadAs(astype, filename, options) {
        const bbClient = this.containerClient.getBlobClient(filename);
        const downloadBB = await bbClient.download();
        
        if (astype == "string") {
            async function streamToBuffer(readableStream) {
                return new Promise((resolve, reject) => {
                    const chunks = [];
                    readableStream.on("data", (data) => {
                        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
                    });
                    readableStream.on("end", () => {
                      resolve(Buffer.concat(chunks));
                    });
                    readableStream.on("error", reject);
                });
            }
            
            const downloaded = (
                await streamToBuffer(downloadBB.readableStreamBody)
            );
            return downloaded.toString();
        }else if (astype == "buffer") {
            var buf = await bbClient.downloadToBuffer();
            var arr = [];
            buf.forEach(v => {
                arr.push(v);
            });
            
            return arr;
        }

    }
    async Upload(filename, data) {
        if (this.containerClient) {

            //var createContainerResponse = await containerClient.create();
            //console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);
    
            // Create a blob
            //const content = "hello";
            const blobName = filename;
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            const uploadBlobResponse = await blockBlobClient.upload(data, Buffer.byteLength(data));
            console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);

            return uploadBlobResponse;
        }else{
            return null;
        }
    }
}


// A helper method used to read a Node.js readable stream into string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}


exports.UserAzureBlobManager = UserAzureBlobManager;