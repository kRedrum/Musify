import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { logger } from '../logger'
import { FileMetadataTags } from '../types/file.type'

class FileMetadataService {
  public readonly TAG = this.constructor.name

  constructor() {}

  private probeFile = (file_path: string) => {
    return new Promise((resolve, reject) => {
      const args = [
        '-hide_banner',
        '-loglevel',
        'fatal',
        '-show_error',
        '-show_format',
        '-show_streams',
        '-show_programs',
        '-show_chapters',
        '-show_private_data',
        '-print_format',
        'json'
      ]
      const probe = spawn('ffprobe', [...args, file_path])

      const output: string[] = []
      const error: string[] = []

      probe.stdout.setEncoding('utf8')
      probe.stderr.setEncoding('utf8')

      probe.stdout.on('data', (data) => {
        output.push(data)
      })

      probe.stderr.on('data', (data) => {
        error.push(data)
      })

      probe.on('error', (err) => {
        reject(err)
      })

      probe.on('exit', (code) => {
        if (code) {
          reject(error.join(''))
        }
      })

      probe.on('close', () => {
        try {
          resolve(JSON.parse(output.join('')))
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  private getFormatTag = (key: string, probedData: any): string | null => {
    const tags = probedData?.format?.tags ?? {}
    const tagKey = Object.keys(tags).find((tagKey) => tagKey.toLowerCase() === key.toLowerCase())
    const tagValue = tagKey && tags[tagKey]
    if (!tagValue) {
      logger.debug(
        `[${this.TAG}]: Tag '${key}' not found in format tags, available tags: ${Object.keys(tags).join(', ')}`
      )
      return null
    }
    return tagValue
  }

  public calculateBitrate = (): number => {
    return 0
    // grep from format
    // or calculate from embeded data
  }

  public getAlbumImage = (filePath: string) => {
   // grep image from embeded data
   // if no image grep it from path
   // where should i save it if it comes with ffmpeg
  }

  public async getFileMetadata(filePath: string): Promise<FileMetadataTags | null> {
    if (!fs.existsSync(filePath)) {
      return null
    }

    let probeData: any
    try {
      probeData = await this.probeFile(filePath)
    } catch (error) {
      logger.error(`[${this.TAG}]: Error occurred while probing file ${path}: ${error}`)
      return null
    }

    if (!probeData?.format) {
      logger.debug(`[${this.TAG}]: No tags found in probed data for file ${filePath}`)
      return null
    }

    return {
      format_tag_album_name: this.getFormatTag('album', probeData) || null,
      format_tag_album_artist: this.getFormatTag('album_artist', probeData) || null,
      format_tag_composer: this.getFormatTag('composer', probeData),
      format_tag_title: this.getFormatTag('title', probeData),
      format_tag_genre: this.getFormatTag('genre', probeData),
      format_tag_date: parseInt(this.getFormatTag('date', probeData) || '', 10) || null,
      format_tag_track: parseInt(this.getFormatTag('track', probeData) || '', 10) || null,
      format_tag_tracktotal: parseInt(this.getFormatTag('tracktotal', probeData) || '', 10) || null,
      format_tag_disc: parseInt(this.getFormatTag('disc', probeData) || '', 10) || null,
      format_tag_disctotal: parseInt(this.getFormatTag('disctotal', probeData) || '', 10) || null,
      format_name: probeData.format.format_name || null,
      duration: Math.round(Number(probeData.format.duration)),
      bitrate: Number(probeData.format.bit_rate) || this.calculateBitrate()
    }
  }
}

export default FileMetadataService
