import {google} from "googleapis";

const CLIENT_ID = '739050254943-l2giqpleeni7ji1d758c9cb9i7tkigtq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04dttbYlfoLoKCgYIARAAGAQSNwF-L9IrVB8cjIAlDznF3YPVfFluAmmesrbgfHPo4Y_l9byP9xXLaXTjh50xSPY-GhpAGAwszv4';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = new google.drive({
    version: 'v3',
    auth: oauth2Client,
})

async function uploadImageToDrive(fileObject, bufferStream) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileObject.originalname,
                mimeType: fileObject.mimeType,
                parents: ['1tRaNriHw1TRzqNneSpxdG-JmrM9NU-sI']
            },
            media: {
                mimeType: fileObject.mimeType,
                body: bufferStream,
            }
        })
        console.log(response.data);
        return response
    } catch (error) {
        console.log(error.message)
    }
}

async function deleteImageFromDrive(id) {
    try {
        const response = await drive.files.delete({
            fileId: id
        })

        console.log(response.data, response.status)
    } catch (error) {
        console.log(error);
    }
}

export {uploadImageToDrive, deleteImageFromDrive}
