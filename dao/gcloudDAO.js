import { Storage } from "@google-cloud/storage";

const storage = new Storage({keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS});

const bucketName = "scizotti-images";
const bucket = storage.bucket(bucketName);

// bucket.upload(
//     './test2.jpg',
//     {
//       destination: `test2.jpg`,
//     },
//     function (err, file) {
//       if (err) {
//         console.error(`Error uploading image test1.png: ${err}`)
//       } else {
//         console.log(`Image test1.png uploaded to ${bucketName}.`)
//       }
//     }
//   )

export default bucket;