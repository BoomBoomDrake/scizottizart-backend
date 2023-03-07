import {google} from "googleapis";

const CLIENT_ID = '739050254943-l2giqpleeni7ji1d758c9cb9i7tkigtq.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04yobu8ge-GOECgYIARAAGAQSNwF-L9IreMtxyoqEIiNTzb9ZxDzlTZrS1NinU5oV_CYHFtHXUeJXu6gHlaDhhsp7u8eOzrUKX0g';

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

export default async function uploadImageToDrive(fileObject, bufferStream) {
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
