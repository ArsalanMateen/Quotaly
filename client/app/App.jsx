import { useState } from "react";
import { Panel } from "../components/ui/Panel.jsx";
import { AppShell } from "../components/layout/AppShell.jsx";
import { PageHeading } from "../components/layout/PageHeading.jsx";

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

  return (
    <AppShell page={details} navigation={navigation} onNavigate={setPage}>
      <PageHeading title={details.heading} description={details.description} />
      <Panel as="section" empty>
        <strong>Your usage story starts here.</strong>
        <p>Open a workspace to explore metering and plans.</p>
      </Panel>
    </AppShell>
  );
}
