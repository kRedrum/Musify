import express from 'express'
import helmet from 'helmet'
import { logger } from './logger'
import { getClientIp } from 'request-ip'
import Server from './Server'
import { ItemController } from './controllers/item.controller'
import { ScannerService } from './services/scanner.service'
import TrackRepository from './repository/track.repository'
import fs from 'fs'
import FileMetadataService from './services/file.metadata.service'
import AlbumService from './services/album.service'
import AlbumRepository from './repository/album.repository'

export class ServerBuilder {
  private readonly TAG = this.constructor.name
  private readonly app: express.Express

  constructor() {
    this.app = express()
  }

  public configureApplication(): ServerBuilder {
    const router = this.app.router

    // --> Repositories
    const trackRepository = new TrackRepository()
    const albumRepository = new AlbumRepository()

    // --> Services
    const albumService = new AlbumService(albumRepository)
    const fileMetadataService = new FileMetadataService()
    const scannerService = new ScannerService(trackRepository, albumRepository, fileMetadataService)

    // --> Controllers
    const libraryController = new ItemController(scannerService)

    libraryController.registerRoutes(router)

    this.app.use('/api', router)
    return this
  }

  public addRealIP(): ServerBuilder {
    this.app.use((req, _res, next) => {
      const realIp = getClientIp(req)

      try {
        Object.defineProperty(req, 'ip', {
          enumerable: true,
          configurable: true,
          value: realIp
        })
      } catch (error) {
        logger.error(`[${this.TAG}]: Error occurred while getting client IP: ${error}`)
      } finally {
        next()
      }
    })
    return this
  }

  public addClientStaticBuildArtifact(staticPath: string): ServerBuilder {
    if (!fs.existsSync(staticPath)) {
      logger.warn(`[${this.TAG}]: Static build artifact path does not exist: ${staticPath}`)
      return this
    }
    this.app.use(express.static(staticPath))
    return this
  }

  public createAppPaths = (config_path: string) => {
    const folderToCreate = [
      `${config_path}`,
      `${config_path}/db`,
      `${config_path}/logs`,
      `${config_path}/certs`
    ]
    folderToCreate.forEach((folder) => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true })
        logger.info(`[${this.TAG}]: Created folder at ${folder}`)
      }
    })
    return this
  }

  public addSecurityHeaders(trustProxy: boolean): ServerBuilder {
    this.app.use(helmet())
    this.app.set('trust proxy', trustProxy)
    return this
  }

  public build(): Server {
    return new Server(this.app)
  }
}
