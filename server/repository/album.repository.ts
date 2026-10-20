import { Album } from '../models/Album'
import { Artist } from '../models/Artist'
import { logger } from '../logger'
import { FileMetadataTags } from '../types/file.type'

class AlbumRepository {
  private readonly TAG = this.constructor.name

  public findByNameAndArtist = async (name: string, artistName: string): Promise<Album | null> => {
    return Album.findOne({ where: { name }, include: [{ model: Artist, where: { name: artistName } }] })
  }

  public createByName = async (metadata: FileMetadataTags | null): Promise<void> => {
    // const name = metadata?.format_tag_album_name?.trim() || 'unknown'
    // const artistName = metadata?.format_tag_album_artist?.trim() || 'unknown'
    // const [artist] = await Artist.findOrCreate({
    //   where: { name: artistName },
    //   defaults: { name: artistName }
    // })

    // const releasedAt = metadata?.format_tag_date ? `${metadata.format_tag_date}-01-01` : undefined
    // const defaults = {
    //   name,
    //   ArtistId: artist.id,
    //   genre: metadata?.format_tag_genre ?? null,
    //   released_at: releasedAt ?? null,
    //   disctotal: metadata?.format_tag_disctotal ?? null
    // }
    // const [album, created] = await Album.findOrCreate({
    //   where: { name, ArtistId: artist.id },
    //   defaults
    // })

    // if (created) {
    //   return album
    // }

    // const updatedFields: string[] = []

    // if (metadata?.format_tag_genre && album.genre !== metadata.format_tag_genre) {
    //   album.genre = metadata.format_tag_genre
    //   updatedFields.push('genre')
    // }
    // if (releasedAt && album.released_at !== releasedAt) {
    //   album.released_at = releasedAt
    //   updatedFields.push('released_at')
    // }
    // if (metadata?.format_tag_disctotal != null && album.disctotal !== metadata.format_tag_disctotal) {
    //   album.disctotal = metadata.format_tag_disctotal
    //   updatedFields.push('disctotal')
    // }

    // if (updatedFields.length > 0) {
    //   await album.save()
    //   logger.info(`[${this.TAG}]: Updated album metadata: ${updatedFields.join(', ')}`)
    // }

    // return album
  }
}

export default AlbumRepository
