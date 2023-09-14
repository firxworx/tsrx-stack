import { generateOpenApi } from '@ts-rest/open-api'
import { apiContract } from '@rfx/common-contracts'

/**
 * OpenAPI (Swagger) document for this app generated from the ts-rest contract.
 */
export const openApiDocument = generateOpenApi(
  apiContract,
  {
    info: {
      title: 'Combined API',
      version: '0.0.1',
      description: 'Example fastify + ts-rest contract API with OpenAPI.',
    },
  },
  { setOperationId: true },
)
