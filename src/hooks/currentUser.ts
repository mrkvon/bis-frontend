import { skipToken } from '@reduxjs/toolkit/dist/query'
import { api } from 'app/services/bis'
import { useEffect } from 'react'
import { getUserRoles } from 'utils/helpers'
import { useAuth } from './auth'
import { useCurrentRole } from './useCurrentRole'

export const useCurrentUser = () => {
  const auth = useAuth()

  const { data, ...restWhoami } = api.endpoints.whoami.useQuery(
    auth ? undefined : skipToken,
  )
  const { data: currentUser, ...restUser } = api.endpoints.readUser.useQuery(
    data?.id ? { id: data.id } : skipToken,
  )
  const [logout] = api.endpoints.logout.useMutation()

  // when whoami fails with 401, we sign the user out
  // it's very likely that the signout api call will fail
  // but in any case, app will reset (see src/app/store to check out that logic)
  // and offer the user clean login form
  useEffect(() => {
    ;(async () => {
      if (
        restWhoami.isError &&
        'status' in restWhoami.error &&
        restWhoami.error.status === 401
      ) {
        try {
          await logout().unwrap()
        } finally {
          // globalThis.location.href = globalThis.location.href
        }
      }
    })()
  }, [logout, restWhoami.error, restWhoami.isError])

  const [role, , setInitialRole] = useCurrentRole()

  // when we get currentUser, and a role is not set, we set a default role
  useEffect(() => {
    if (currentUser && !role) {
      const defaultRole = getUserRoles(currentUser).includes('organizer')
        ? 'organizer'
        : 'user'
      setInitialRole(defaultRole)
    }
  }, [currentUser, role, setInitialRole])

  return {
    data: currentUser,
    isLoading: restWhoami.isLoading || restUser.isLoading,
    isAuthenticated: auth,
    isError: restWhoami.isError || restUser.isError,
    error: restWhoami.error || restUser.error,
  }
}
