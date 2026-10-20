import OpenApiGenerator from './OpenApiGenerator'
import { ServerBuilder } from './ServerBuilder'
import path from 'path'

const main = async () => {
  const baseUrl = process.env.BASE_URL || '/api'
  const port = Number(process.env.HTTP_PORT || 80)
  const host = process.env.HOST || '127.0.0.1'
  const trustProxy = process.env.TRUST_PROXY === 'true'
  const config = process.env.CONFIG_PATH || './config'
  const clientDistPath = path.resolve(__dirname, '../client/build')

  const server = new ServerBuilder()
    .addRealIP()
    .createAppPaths(config)
    .addSecurityHeaders(trustProxy)
    .addClientStaticBuildArtifact(clientDistPath)
    .configureApplication()
    .build()

  OpenApiGenerator.registerOpenApi()
  OpenApiGenerator.generateOpenApiDocs(baseUrl)

  await server.initializeDatabase(config)
  server.start(port, host, baseUrl)
}

main()
