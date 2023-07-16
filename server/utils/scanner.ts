import { logger } from "../logger";
import { spawn } from "node:child_process"
import { Stats } from "node:fs";

const TAG = 'MetadataHelper'

type MetadataTags = {
  format_tag_album_name?: string
  format_tag_album_artist?: string
  format_tag_composer?: string
  format_tag_title?: string
  format_tag_genre?: string
  format_tag_date?: number
  format_tag_track?: number
  format_tag_tracktotal?: number
  format_tag_disc?: number
  format_tag_disctotal?: number
}



export const probeFile = (file_path: string) => {
  return new Promise((resolve, reject) => {
    const args = ['-hide_banner', '-loglevel', 'fatal', '-show_error', '-show_format', '-show_streams', '-show_programs', '-show_chapters', '-show_private_data', '-print_format', 'json']
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFormatTag = (key: string, probedData: any) => {
  const tags = probedData?.format?.tags ?? {}
  const tagKey = Object.keys(tags).find((tagKey) => tagKey.toLowerCase() === key.toLowerCase())
  const tagValue = tagKey && tags[tagKey]
  if (!tagValue) {
    logger.warn(`[${TAG}]: Tag '${key}' not found in format tags, available tags: ${Object.keys(tags).join(', ')}`)
    return null
  }
  return tagValue
}

export const extractMetadataFromFile = async (path: string): Promise<MetadataTags | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let probeData: any;
  try {
    probeData = await probeFile(path)
  } catch (error) {
    logger.error(`[${TAG}]: Error occurred while probing file ${path}: ${error}`)
    return null
  }

  if (!probeData?.format) {
    logger.warn(`[${TAG}]: No tags found in probed data for file ${path}`)
    return null
  }

  const tags = {
    format_tag_album_name: getFormatTag('album', probeData),
    format_tag_album_artist: getFormatTag('album_artist', probeData),
    format_tag_composer: getFormatTag('composer', probeData),
    format_tag_title: getFormatTag('title', probeData),
    format_tag_genre: getFormatTag('genre', probeData),
    format_tag_date: parseInt(getFormatTag('date', probeData) || '', 10) || undefined,
    format_tag_track: parseInt(getFormatTag('track', probeData) || '', 10) || undefined,
    format_tag_tracktotal: parseInt(getFormatTag('tracktotal', probeData) || '', 10) || undefined,
    format_tag_disc: parseInt(getFormatTag('disc', probeData) || '', 10) || undefined,
    format_tag_disctotal: parseInt(getFormatTag('disctotal', probeData) || '', 10) || undefined,
  }

  return tags
}

export const buildNewTrackObject = async (file: string, fileStats: Stats): Promise<NewTrackObject> => {
  const embeddedMetadata = await extractMetadataFromFile(file)

  if (!embeddedMetadata) {
    logger.warn(`[${TAG}]: No embedded metadata found for file ${file}, using default values`)
  }

  return {
    atime: fileStats.atime,
    ctime: fileStats.ctime,
    mtime: fileStats.mtime,
    size: fileStats.size,
    inode: fileStats.ino,
    metadata: {
      id: undefined,
      name: embeddedMetadata?.format_tag_title ?? 'unknown',
      num: embeddedMetadata?.format_tag_track ?? null,
      duration: embeddedMetadata?.duration ?? 0,
      format: embeddedMetadata?.format ?? 'unknown',
      bitrate: null
    },
    album: {
      name: embeddedMetadata?.format_tag_album_name ?? 'unknown',
      title: embeddedMetadata?.format_tag_album_name ?? 'unknown',
      length: embeddedMetadata?.format_tag_tracktotal ?? 0,
      genre: embeddedMetadata?.format_tag_genre ?? null,
      released_at: embeddedMetadata?.format_tag_date?.toString() ?? null,
      artist: {
        name: embeddedMetadata?.format_tag_album_artist ?? 'unknown'
      }
    }
  }
}
