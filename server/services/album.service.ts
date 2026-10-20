import AlbumRepository from "../repository/album.repository"

class AlbumService {
  constructor (private readonly albumRepository: AlbumRepository) {}

  public create() {}
}

export default AlbumService
