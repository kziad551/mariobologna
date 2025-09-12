import 'primereact/resources/themes/md-light-deeppurple/theme.css'; // Try this one
import 'primereact/resources/primereact.min.css';
import {RemixBrowser, ScrollRestoration} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

// Minimal scroll handling for product pages
if (typeof window !== 'undefined') {
  // Only handle scroll to top for product pages on new navigation
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      // For product pages, scroll to top only on pathname changes
      if (window.location.pathname.includes('/products/') && !window.location.hash) {
        const isNavigatingBack = window.performance && 
          window.performance.navigation && 
          window.performance.navigation.type === 2;
          
        if (!isNavigatingBack) {
          window.scrollTo(0, 0);
        }
      }
    }, 5);
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
