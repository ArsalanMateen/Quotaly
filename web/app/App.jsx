import { useState } from 'react';
import { Button } from '../components/ui/Button.jsx';
import { Panel } from '../components/ui/Panel.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeading } from '../components/layout/PageHeading.jsx';
import { Notice } from '../components/ui/Notice.jsx';
import { WorkspaceConnect } from '../features/workspace/WorkspaceConnect.jsx';
import { WorkspaceDashboard } from '../features/workspace/WorkspaceDashboard.jsx';
import { useWorkspace } from './useWorkspace.js';
import { navigation, pageDetails } from './navigation.js';

export default function App() {
  const [page, setPage] = useState('overview');
  const details = pageDetails(page);
  const { session, snapshot, busy, loading, canResume, notice, dismissNotice, actions } = useWorkspace();

  async function startSandbox() {
    if (await actions.startSandbox()) setPage('overview');
  }

  async function startFresh() {
    if (await actions.startFresh()) setPage('overview');
  }

  return (
    <AppShell
      connected={Boolean(session)}
      busy={busy}
      page={details}
      navigation={navigation}
      onNavigate={setPage}
      onDisconnect={actions.disconnect}
    >
      <PageHeading title={details.heading} description={details.description} />
      {notice && <Notice error={notice.error} onDismiss={dismissNotice}>{notice.text}</Notice>}
      {!loading && !session ? (
        <WorkspaceConnect
          busy={busy}
          canResume={canResume}
          onStartSandbox={startSandbox}
          onStartFresh={startFresh}
        />
      ) : session && snapshot ? (
        <WorkspaceDashboard snapshot={snapshot} />
      ) : (
        <Panel as="section" empty aria-busy={!notice}>
          <strong>{notice ? 'Workspace could not be loaded.' : 'Loading your workspace…'}</strong>
          {notice && <Button variant="secondary" disabled={busy} onClick={actions.refresh}>Try again</Button>}
        </Panel>
      )}
    </AppShell>
  );
}
