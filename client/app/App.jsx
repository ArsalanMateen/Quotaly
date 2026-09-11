import { useState } from "react";
import { Panel } from "../components/ui/Panel.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { PageHeading } from "../components/layout/PageHeading.jsx";
import { Notice } from "../components/ui/Notice.jsx";
import { WorkspaceConnect } from "../features/workspace/WorkspaceConnect.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { useWorkspace } from "./useWorkspace.js";

const navigation = [
  {
    id: "overview",
    icon: "grid",
    label: "Overview",
    heading: "Usage at a glance.",
    description: "Keep an eye on what you consume and stay comfortably within your plan.",
  },
];
const pageDetails = (page) => navigation.find((item) => item.id === page);

export default function App() {
  const [page, setPage] = useState("overview");
  const details = pageDetails(page);
  const { session, busy, loading, canResume, notice, dismissNotice, actions } = useWorkspace();

  async function startSandbox() {
    if (await actions.startSandbox()) setPage("overview");
  }

  async function startFresh() {
    if (await actions.startFresh()) setPage("overview");
  }

  return (
    <AppShell page={details} navigation={navigation} onNavigate={setPage}>
      <PageHeading
        title={details.heading}
        description={details.description}
        onDisconnect={session ? actions.disconnect : undefined}
        disconnectDisabled={busy}
      />
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
        <Spinner />
      )}
    </AppShell>
  );
}
