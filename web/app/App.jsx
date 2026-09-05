import { useState } from 'react';
import { Panel } from '../components/ui/Panel.jsx';
import { AppShell } from '../components/layout/AppShell.jsx';
import { PageHeading } from '../components/layout/PageHeading.jsx';
import { navigation, pageDetails } from './navigation.js';

export default function App() {
  const [page, setPage] = useState('overview');
  const details = pageDetails(page);

  return (
    <AppShell
      connected={false}
      busy={false}
      page={details}
      navigation={navigation}
      onNavigate={setPage}
    >
      <PageHeading title={details.heading} description={details.description} />
      <Panel as="section" empty>
        <strong>Your usage story starts here.</strong>
        <p>Open a workspace to explore metering and plans.</p>
      </Panel>
    </AppShell>
  );
}
