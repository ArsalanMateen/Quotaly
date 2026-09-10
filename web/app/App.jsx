import { useState } from 'react';
import { Panel } from '../components/ui/Panel.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeading } from '../components/layout/PageHeading.jsx';
import { Notice } from '../components/ui/Notice.jsx';
import { WorkspaceConnect } from '../features/workspace/WorkspaceConnect.jsx';
import { useWorkspace } from './useWorkspace.js';
import { navigation, pageDetails } from './navigation.js';

export default function App() {
  const [page, setPage] = useState('overview');
  const details = pageDetails(page);
  const { session, busy, loading, canResume, notice, dismissNotice, actions } = useWorkspace();

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
      ) : session ? (
        <Panel as="section" empty>
          <strong>Workspace ready.</strong>
          <p>Your usage dashboard is coming together.</p>
        </Panel>
      ) : (
        <Panel as="section" empty aria-busy>
          <strong>Loading your workspace…</strong>
        </Panel>
      )}
    </AppShell>
  );
}
