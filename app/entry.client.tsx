import 'primereact/resources/themes/md-light-deeppurple/theme.css'; // Try this one
import 'primereact/resources/primereact.min.css';
import {RemixBrowser, ScrollRestoration} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

// Custom scroll restoration logic
if (typeof window !== 'undefined') {
  // Store scroll positions by pathname + search params relevant to product filtering
  const SCROLL_POSITIONS = new Map();

  // Save position on navigation attempts
  window.addEventListener('beforeunload', () => {
    const key = window.location.pathname + window.location.search;
    SCROLL_POSITIONS.set(key, window.scrollY);
  });

  // Also save position just before navigation
  if (window.history && window.history.scrollRestoration) {
    // Let browser handle scroll position for back/forward navigation
    window.history.scrollRestoration = 'auto';
    
    // Capture scroll before any navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function(state, title, url) {
      const key = window.location.pathname + window.location.search;
      SCROLL_POSITIONS.set(key, window.scrollY);
      return originalPushState.call(this, state, title, url);
    };
  }

  // When navigating back to a collection page, restore position
  window.addEventListener('popstate', () => {
    // Allow a small timeout for DOM to update before attempting to scroll
    setTimeout(() => {
      // Special handling for collection pages
      if (window.location.pathname.includes('/collections/')) {
        const key = window.location.pathname + window.location.search;
        const savedPosition = SCROLL_POSITIONS.get(key);
        
        if (savedPosition !== undefined && savedPosition > 0) {
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto' // Use 'auto' instead of 'smooth' for back button
          });
        }
      }
      // For product pages, always start at the top when navigating directly
      else if (window.location.pathname.includes('/products/')) {
        // Only scroll to top if not navigating back (when using browser back button)
        const isNavigatingBack = window.performance && 
          window.performance.navigation && 
          window.performance.navigation.type === 2;
          
        if (!isNavigatingBack) {
          window.scrollTo(0, 0);
        }
      }
    }, 5); // Very short timeout to ensure it happens right after render
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
