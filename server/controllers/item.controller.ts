import { Request, Response, Router } from 'express'
import fs from 'fs'
import { logger } from '../logger'
import { ScannerService } from '../services/scanner.service'
import { ItemUpdateRequestSchema } from '../types/track.types'
import { validateRequest } from '../utils/validation'

export class ItemController {
  private readonly TAG = this.constructor.name

  constructor(private readonly scannerService: ScannerService) {}

  public registerRoutes(router: Router): void {
    router.post(`/item/scan`, this.scan)
  }

  private scan = async (req: Request, res: Response): Promise<Response> => {
    const data = validateRequest(req, ItemUpdateRequestSchema)
    if (!data) {
      return res.status(400).json()
    }

    const musicFolder = process.env.MUSIC_PATH
    if (!musicFolder || !fs.existsSync(musicFolder)) {
      logger.error(`[${this.TAG}]: Cannot find ${musicFolder} path`)
      return res.status(404).json()
    }

    await this.scannerService.scan(musicFolder)

    return res.status(200).json()
  }

  private updateItem = (): void => {
    /**
     * TODO:
     * can be updated with provided value
     * can be quick matched using metadat provider
     */
  }

}
