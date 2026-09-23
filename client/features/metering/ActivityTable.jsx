import styles from "./ActivityTable.module.css";
import { Panel } from "../../components/ui/Panel.jsx";
import { Icon } from "../../components/ui/Icon.jsx";
import { SectionHeading } from "../../components/ui/SectionHeading.jsx";
import {
  formatEventDate,
  formatMoney,
  formatNumber,
} from "../../lib/format.js";

function ActivityRow({ event }) {
  return (
    <tr>
      <td>
        <span className={styles.id}>
          Generation <small>{event.id.slice(0, 8)}</small>
        </span>
      </td>
      <td>{formatNumber(event.usage.tokens)}</td>
      <td className={styles.mono}>{formatMoney(event.costMicroUsd)}</td>
      <td>{formatEventDate(event.createdAt)}</td>
      <td>
        <span className={styles.badge}>Recorded</span>
      </td>
    </tr>
  );
}

export function ActivityTable({ events }) {
  return (
    <Panel as="section">
      <SectionHeading
        className={styles.heading}
        title="Recent activity"
        description="Your latest successful generations."
      />
      <div className={styles.wrap}>
        <table
          className={styles.table}
          aria-label="Recent successful generations"
        >
          <thead>
            <tr>
              <th scope="col">EVENT</th>
              <th scope="col">TOKENS</th>
              <th scope="col">COST</th>
              <th scope="col">RECORDED</th>
              <th scope="col">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </tbody>
        </table>
        {!events.length && (
          <Panel.Empty>
            <Icon type="pulse" />
            <strong>A clean slate.</strong>
            <p>Run your first generation to start your usage history.</p>
          </Panel.Empty>
        )}
      </div>
    </Panel>
  );
}
