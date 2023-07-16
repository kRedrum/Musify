import path from 'path'
import Database from './Database'
import { Express } from 'express'
import { logger } from './logger'
class Server {
  protected readonly TAG = this.constructor.name
  protected readonly app: Express

  constructor(app: Express) {
    this.app = app
  }

  public start(port: number, host: string, baseUrl: string): void {
    logger.info(`[${this.TAG}]: Starting server with configuration`, {
      config: {
        PORT: port,
        HOST: host,
        BASE_URL: baseUrl
      }
    })

    this.app.listen(port, host, (error) => {
      if (error) {
        logger.error(`[${this.TAG}]: Error occurred while starting server: ${error}`)
      }

      logger.info(`[${this.TAG}]: Server is running on http://${host}:${port}${baseUrl}`)
    })
  }


  public initializeDatabase(configPath: string): void {
    Database.init(path.join(configPath, 'db'))
  }
}

export default Server
