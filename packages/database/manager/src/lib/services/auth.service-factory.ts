import * as argon2 from 'argon2'

import type { AuthPasswordCredentials, UserDao } from '@rfx/common-data'
import type { UserRepository } from '../entities/public/user/user.repository-factory'

export interface AuthService {
  /**
   * Authenticate a user using `email` and `password` credentials.
   * @returns UserDao (including sensitive fields) on success or `undefined` on failure
   */
  authenticate: (credentials: AuthPasswordCredentials) => Promise<UserDao | undefined>
}

export const createAuthService = (userRepository: UserRepository): AuthService => ({
  async authenticate({ email, password }) {
    const user = await userRepository.findByEmailForAuth(email)

    if (!user) {
      // perform a dummy hash verification --
      // for possible mitigation of certain timing attacks: both success and failure cases take similar time
      const dummyArgon2Hash =
        '$argon2id$v=19$m=65536,t=3,p=4$QffPHVmPsCEzkKnRNBJjAg$qclvnlUGuax/zD9/YpBV9fMBrvUiWS0tgByQ5G4Pl7M'
      await argon2.verify(dummyArgon2Hash, password)

      return undefined
    }

    const isValidPassword = await argon2.verify(user.password, password)

    // @future could throw this as an error for more granular handling/logging downstream
    if (!isValidPassword) {
      return undefined
    }

    return user
  },
})
