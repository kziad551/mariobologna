import 'primereact/resources/themes/md-light-deeppurple/theme.css'; // Try this one
import 'primereact/resources/primereact.min.css';
import {RemixBrowser, ScrollRestoration} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

// Product pages handle their own scroll-to-top behavior
// No global scroll handling needed here

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
