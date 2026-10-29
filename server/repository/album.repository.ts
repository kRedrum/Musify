import { Album } from '../models/Album'
import { Artist } from '../models/Artist'
import { logger } from '../logger'
import { InferCreationAttributes } from 'sequelize'

class AlbumRepository {
  private readonly TAG = this.constructor.name

  public findByNameAndArtist = async (name: string | null, artistName: string | null): Promise<Album | null> => {
    return Album.findOne({ where: { name }, include: [{ model: Artist, where: { name: artistName } }] })
  }

  public update = async (existingAlbum: Album, newAlbum: Partial<InferCreationAttributes<Album>>) => {
    const updatedFields: string[] = []

    if (newAlbum?.genre && existingAlbum.genre !== newAlbum.genre) {
      existingAlbum.genre = newAlbum.genre
      updatedFields.push('genre')
    }
    if (newAlbum?.disctotal != null && existingAlbum.disctotal !== newAlbum.disctotal) {
      existingAlbum.disctotal = newAlbum.disctotal
      updatedFields.push('disctotal')
    }

    if (updatedFields.length > 0) {
      await existingAlbum.save()
      logger.info(`[${this.TAG}]: Updated album metadata: ${updatedFields.join(', ')}`)
    }
  }

  public createAlbum = async (name: string | null, artistName: string | null): Promise<Album | null> => {
    if (!name && !artistName) {
      return null
    }
    let album = await this.findByNameAndArtist(name, artistName)

    if (!album) {
      album = Album.build({
        name: name
      })
    album = await album.save()
    }

    return album
  }
}

export default AlbumRepository
