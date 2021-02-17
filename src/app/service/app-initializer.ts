import { AuthenticationService } from './authentication.service';

/**
 * Application Initializer
 *
 * See: https://angular.io/api/core/APP_INITIALIZER
 *
 * @param authService the autnentication service
 */
export function appInitializer(
  authService: AuthenticationService
): () => Promise<any> {
  return (): Promise<any> =>
    /**
     * Refresh the JWT access token on app startup up to auto-authenticate.  This will
     * ensure that if the user does a hard refresh, and he is already logged-in, that
     * we refresh and store the new access token.
     */
    new Promise<void>((resolve, reject) => {
        authService.refreshToken().subscribe().add(resolve);
    });
}
