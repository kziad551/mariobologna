import 'primereact/resources/themes/md-light-deeppurple/theme.css'; // Try this one
import 'primereact/resources/primereact.min.css';
import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
