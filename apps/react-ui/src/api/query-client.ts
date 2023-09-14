import { initQueryClient } from '@ts-rest/react-query'
import { tsRestFetchApi, type ApiFetcherArgs } from '@ts-rest/core'

import { apiContract } from '@rfx/common-contracts'
import { API_URL } from '../constants'

/**
 * Client powered by react-query for the blog API associated with the ts-rest Blog contract.
 *
 * @see https://ts-rest.com/docs/core/custom for client customization + custom clients
 * @see https://ts-rest.com/docs/core/fetch for api client documentation
 * @see https://github.com/OtterlySpace/turbo-stack-otterly/blob/main/apps/front/src/utils/client.tsx example with more context
 */
export const apiQuery = initQueryClient(apiContract, {
  baseUrl: API_URL,
  baseHeaders: {},

  api: async (args: ApiFetcherArgs) => {
    args = {
      ...args,
      credentials: 'same-origin',
    }

    return tsRestFetchApi(args)
  },
  credentials: 'same-origin',

  // uncomment if using json query serialization
  // jsonQuery: true,
})
