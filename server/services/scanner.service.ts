import { supportedAudioGlobs } from '../const.ts'
import { fdir } from 'fdir'
import { logger } from '../logger.ts'
import { Track } from '../models/Track.ts'
import fs from 'fs/promises'
import TrackRepository from '../repository/track.repository.ts'

export class ScannerService {
  private readonly TAG = this.constructor.name
  private isScanning = false

  constructor(private readonly trackRepository: TrackRepository) {
  }

  public async scan(folderPath: string): Promise<void> {
    if (this.isScanning) {
      logger.warn(`[${this.TAG}]: Scan is already running, skipping scan request`)
      return
    }

    this.isScanning = true

    try {
      logger.info(`[${this.TAG}]: Starting scan for folder: ${folderPath}`)

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

      for (const { file, fileStat } of filesWithStats) {
        const existingTrack = existingLibraryTracks.find((track) => {
          if (track.path === file && track.inode !== fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path is the same, but inode has changed: ${fileStat.ino}`)
            return true
          }

          if (track.path !== file && track.inode === fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path has changed, but inode is the same: ${fileStat.ino}`)
            return true
          }

          if (track.path !== file && track.inode !== fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path and inode have changed: ${fileStat.ino}`)
            return false
          }

          if (track.path === file && track.inode === fileStat.ino) {
            logger.debug(`[${this.TAG}]: file path and inode are the same, skipping: ${fileStat.ino}`)
            return true
          }

          return false
        })

        if (existingTrack) {
          await this.trackRepository.update(existingTrack, {
            ...fileStat,
            path: file
          })
        } else {
          // const trackWithAssociations = await buildNewTrackObject(file, fileStat)
          // await createWithAssociations(trackWithAssociations)
        }
      }
      if (foundLibraryItems.size > 0) {
        await this.trackRepository.updateTracksMissingIds([...foundLibraryItems])
        logger.info(
          `[${this.TAG}]: Marked ${existingLibraryTracks.length - foundLibraryItems.size} tracks as missing`
        )
      }
    } finally {
      this.isScanning = false
    }
  }
}
