import { lazy, ComponentType } from 'react';

/**
 * A wrapper around React.lazy that automatically reloads the page if the import fails.
 * This is useful for SPAs where a deployment might delete old chunks, causing client-side routing errors.
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
    componentImport: () => Promise<{ default: T }>
) =>
    lazy(async () => {
        const pageHasAlreadyBeenForceRefreshed = JSON.parse(
            window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
        );

        try {
            const component = await componentImport();
            window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
            return component;
        } catch (error) {
            if (!pageHasAlreadyBeenForceRefreshed) {
                // Assuming that the user is not on the latest version of the application.
                // Let's refresh the page immediately.
                window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                window.location.reload();
            }
            // If we already reloaded and it still fails, it's a real error.
            throw error;
        }
    });
