import { supportedAudioGlobs } from '../const.ts'
import { fdir } from 'fdir'
import { logger } from '../logger.ts'
import { Track } from '../models/Track.ts'
import fs from 'fs/promises'
import TrackRepository from '../repository/track.repository.ts'
import FileMetadataService from './file.metadata.service.ts'
import AlbumRepository from '../repository/album.repository.ts'

export class ScannerService {
  private readonly TAG = this.constructor.name
  private isScanning = false

  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly fileService: FileMetadataService
  ) {}

  public async scan(folderPath: string): Promise<void> {
    if (this.isScanning) {
      logger.warn(`[${this.TAG}]: Scan is already running, skipping scan request`)
      return
    }

    this.isScanning = true

    logger.info(`[${this.TAG}]: Starting scan for folder: ${folderPath}`)

    try {
      const existingLibraryTracks = await this.trackRepository.getAllTracks()
      const foundLibraryItems = new Set<Track['id']>()

      const files = await new fdir().withFullPaths().glob(supportedAudioGlobs).crawl(folderPath).withPromise()

      const filesWithStats = await Promise.all(
        files.map(async (file) => {
          const fileStat = await fs.stat(file)

          return {
            file,
            fileStat
          }
        })
      )

      for (const { file: filePath, fileStat } of filesWithStats) {
        const existingTrack = existingLibraryTracks.find((track) => {
          if (track.path === filePath && track.inode !== fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path is the same, but inode has changed: ${fileStat.ino}`)
            return true
          }

          if (track.path !== filePath && track.inode === fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path has changed, but inode is the same: ${fileStat.ino}`)
            return true
          }

          if (track.path !== filePath && track.inode !== fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path and inode have changed: ${fileStat.ino}`)
            return false
          }

          if (track.path === filePath && track.inode === fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path and inode are the same: ${fileStat.ino}`)
            return true
          }

          return false
        })

        const fileMetadata = await this.fileService.getFileMetadata(filePath)
        if (!fileMetadata) {
          logger.info(`[${this.TAG}]: Couldn't find metadata for: ${filePath}`)
        } else {
          // album = await this.albumRepository.findOrCreate(fileMetadata)
        }

        if (existingTrack) {
          foundLibraryItems.add(existingTrack.id)
          // await this.trackRepository.update(existingTrack, {
          //   ...fileStat,
          //   path: filePath
          // })
        } else {
          // const createdTrack = await this.trackRepository.create({
          //   isMissing: false,
          //   path: filePath,
          //   atime: fileStat.atime,
          //   ctime: fileStat.ctime,
          //   mtime: fileStat.mtime,
          //   size: fileStat.size,
          //   inode: fileStat.ino,
          //   AlbumId: album.id,
          //   bitrate: fileMetadata.bitrate,
          //   duration: fileMetadata.duration,
          //   format: fileMetadata.format_name
          // })
          // foundLibraryItems.add(createdTrack.id)
        }
      }

      await this.trackRepository.updateTracksMissingIds([...foundLibraryItems])
      const missingTracksCount = existingLibraryTracks.filter(
        (track) => !foundLibraryItems.has(track.id)
      ).length
      logger.info(`[${this.TAG}]: Marked ${missingTracksCount} tracks as missing`)
    } finally {
      this.isScanning = false
    }
  }
}
