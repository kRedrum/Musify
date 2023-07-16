import { Op } from 'sequelize'
import { logger } from '../logger'
import { Album } from '../models/Album'
import { Track, NewTrackObject } from '../models/Track'

class TrackRepository {
  private readonly TAG = this.constructor.name

  constructor() {}

  public getAllTracks = async (): Promise<Track[]> => {
    return Track.findAll()
  }

  public update = async (
    existingTrack: Track,
    newTrack: {
      size: number | null
      ino: number | null
      path: string
      mtime: Date
      atime: Date
      ctime: Date
    }
  ): Promise<void> => {
    const updatedFields: string[] = []

    if (existingTrack.size !== newTrack.size) {
      logger.info(`[${this.TAG}]: file size has changed, updating track`)
      existingTrack.size = newTrack.size
      updatedFields.push('size')
    }

    if (existingTrack.inode !== newTrack.ino) {
      logger.debug(`[${this.TAG}]: file inode has changed, updating track`)
      existingTrack.inode = newTrack.ino
      updatedFields.push('inode')
    }

    if (existingTrack.path !== newTrack.path) {
      logger.info(`[${this.TAG}]: file path has changed, updating track`)
      existingTrack.path = newTrack.path
      updatedFields.push('path')
    }

    if (existingTrack.mtime?.valueOf() !== newTrack.mtime.valueOf()) {
      logger.info(`[${this.TAG}]: file mtime has changed, updating track`)
      existingTrack.mtime = newTrack.mtime
      updatedFields.push('mtime')
    }

    if (existingTrack.atime?.valueOf() !== newTrack.atime.valueOf()) {
      logger.info(`[${this.TAG}]: file atime has changed, updating track`)
      existingTrack.atime = newTrack.atime
      updatedFields.push('atime')
    }

    if (existingTrack.ctime?.valueOf() !== newTrack.ctime.valueOf()) {
      logger.info(`[${this.TAG}]: file ctime has changed, updating track`)
      existingTrack.ctime = newTrack.ctime
      updatedFields.push('ctime')
    }

    if (updatedFields.length > 0) {
      logger.debug(`[${this.TAG}]: Updated fields: ${updatedFields.join(', ')}`)
      await existingTrack.save()
    } else {
      logger.debug(`[${this.TAG}]: No fields updated for track: ${existingTrack.path}`)
    }
  }

  public createWithAssociations = async (track: NewTrackObject): Promise<Track> => {
    return Track.create(
      { ...track },
      {
        include: [
          { association: Track.associations.metadata },
          {
            association: Track.associations.album,
            include: [{ association: Album.associations.artist }]
          }
        ]
      }
    )
  }

  public updateTracksMissingIds = async (idsToKeep: string[]): Promise<[number]> => {
    if (idsToKeep.length === 0) {
      return [0]
    }

    return Track.update({ isMissing: true }, { where: { id: { [Op.notIn]: idsToKeep } } })
  }
}

export default TrackRepository
