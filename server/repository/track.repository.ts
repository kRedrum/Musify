import { Attributes, InferAttributes, InferCreationAttributes, Op } from 'sequelize'
import { logger } from '../logger'
import { Track } from '../models/Track'
import { Album } from '../models/Album'

class TrackRepository {
  private readonly TAG = this.constructor.name

  constructor() {}

  public getAllTracks = async (): Promise<Track[]> => {
    return Track.findAll({ include: [{ model: Album }] })
  }

  public create = async (track: InferCreationAttributes<Track, { omit: 'id' }>): Promise<Track> => {
    return Track.create(track)
  }

  public updateTracksMissingIds = async (idsToKeep: string[]): Promise<[number]> => {
    return Track.update({ isMissing: true }, { where: { id: { [Op.notIn]: idsToKeep } } })
  }

  public update = async (
    existingTrack: Track,
    newTrack: Partial<InferCreationAttributes<Track>>
  ): Promise<void> => {
    const updatedFields = []

    if (newTrack.name && existingTrack.name !== newTrack.name) {
      existingTrack.name = newTrack.name
      updatedFields.push('name')
    }

    if (newTrack.num && existingTrack.num !== newTrack.num) {
      existingTrack.num = newTrack.num
      updatedFields.push('num')
    }

    if (newTrack.duration && existingTrack.duration !== newTrack.duration) {
      existingTrack.duration = newTrack.duration
      updatedFields.push('duration')
    }

    if (newTrack.format && existingTrack.format !== newTrack.format) {
      existingTrack.format = newTrack.format
      updatedFields.push('format')
    }

    if (newTrack.bitrate && existingTrack.bitrate !== newTrack.bitrate) {
      existingTrack.bitrate = newTrack.bitrate
      updatedFields.push('bitrate')
    }

    if (newTrack.size && existingTrack.size !== newTrack.size) {
      logger.info(`[${this.TAG}]: file size has changed, updating track`)
      existingTrack.size = newTrack.size
      updatedFields.push('size')
    }

    if (newTrack.inode && existingTrack.inode !== newTrack.inode) {
      logger.debug(`[${this.TAG}]: file inode has changed, updating track`)
      existingTrack.inode = newTrack.inode
      updatedFields.push('inode')
    }

    if (newTrack.path && existingTrack.path !== newTrack.path) {
      logger.info(`[${this.TAG}]: file path has changed, updating track`)
      existingTrack.path = newTrack.path
      updatedFields.push('path')
    }

    if (newTrack.mtime && existingTrack.mtime?.valueOf() !== newTrack.mtime.valueOf()) {
      logger.info(`[${this.TAG}]: file mtime has changed, updating track`)
      existingTrack.mtime = newTrack.mtime
      updatedFields.push('mtime')
    }

    if (newTrack.atime && existingTrack.atime?.valueOf() !== newTrack.atime.valueOf()) {
      logger.info(`[${this.TAG}]: file atime has changed, updating track`)
      existingTrack.atime = newTrack.atime
      updatedFields.push('atime')
    }

    if (newTrack.ctime && existingTrack.ctime?.valueOf() !== newTrack.ctime.valueOf()) {
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
}

export default TrackRepository
