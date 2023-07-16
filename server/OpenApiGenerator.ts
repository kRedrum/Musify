import fs from 'fs'
import path from 'path'
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { logger } from './logger'
import { version as packageVersion } from './package.json'
import { ItemUpdateRequestSchema } from './types/track.types'

class OpenApiGenerator {
  private readonly TAG = this.constructor.name
  private readonly registry: OpenAPIRegistry

  constructor() {
    this.registry = new OpenAPIRegistry()
  }

  public generateOpenApiDocs(baseUrl: string): void {
    fs.mkdirSync('docs', { recursive: true })

    const generator = new OpenApiGeneratorV3(this.registry.definitions)
    const document = generator.generateDocument({
      openapi: '3.0.0',
      info: {
        title: 'Musify API',
        version: packageVersion
      },
      servers: [{ url: baseUrl || '/' }]
    })

    const filePath = path.join('docs', 'swagger.json')
    fs.writeFileSync(filePath, JSON.stringify(document, null, 2))
    logger.info(`[${this.TAG}]: OpenAPI documentation generated at ${filePath}`)
  }

  public registerOpenApi(): void {
    this.registry.registerComponent('securitySchemes', 'basicAuth', {
      type: 'http',
      scheme: 'bearer'
    })
    this.registerItemControllerOpenApi()
  }

  public registerItemControllerOpenApi(): void {
    this.registry.registerPath({
      method: 'post',
      path: `/items/scan`,
      summary: 'Scan configured path for music and retrive metadata',
      security: [{ basicAuth: [] }],
      responses: {
        200: { description: 'music path scan succesfull' },
        401: { description: 'user is not authorized' },
        403: { description: 'A user with admin permission is needed' },
        404: { description: 'Could not find path for music scan' }
      }
    })
    this.registry.registerPath({
      method: 'delete',
      path: `/items/{itemId}`,
      summary: 'Deletes given item',
      security: [{ basicAuth: [] }],
      request: ItemUpdateRequestSchema,
      responses: {
        // 403: { description: 'A user with config policy needed' }
      }
    })
    this.registry.registerPath({
      method: 'get',
      path: `/items/{itemId}`,
      summary: 'Retrieves given item',
      security: [{ basicAuth: [] }],
      responses: {
        // 403: { description: 'A user with read permission is needed' }
      }
    })
    this.registry.registerPath({
      method: 'patch',
      path: `/items/metadata/{trackId}`,
      summary: 'Update track metadata',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Track sucesfully updated' }
        // 403: { description: '' }
      }
    })
    this.registry.registerPath({
      method: 'get',
      path: `/items/metadata/{trackId}`,
      summary: 'Retrieve track metadata',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Item metadata retrieved successfully' }
        // 403: { description: 'A user with read permission is needed' }
      }
    })
    this.registry.registerPath({
      method: 'get',
      path: `/items/metadata/{trackId}/external`,
      summary: 'Retrieve track metadata from external providers',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'External item metadata retrieved successfully' }
        // 403: { description: 'A user with read permission is needed' }
      }
    })
  }
}

export default new OpenApiGenerator()
