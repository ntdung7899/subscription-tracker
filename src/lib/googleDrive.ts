import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/drive.file']

export class GoogleDriveService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI
    )
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
  }

  async getToken(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    return tokens
  }

  async uploadFile(fileName: string, fileContent: string, mimeType: string) {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client })

    const fileMetadata = {
      name: fileName,
    }

    const media = {
      mimeType: mimeType,
      body: fileContent,
    }

    try {
      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      })

      return file.data
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error)
      throw error
    }
  }

  async backupDatabase(dbContent: string) {
    const fileName = `subscription-tracker-backup-${new Date().toISOString()}.db`
    return this.uploadFile(fileName, dbContent, 'application/octet-stream')
  }
}

export const googleDrive = new GoogleDriveService()
