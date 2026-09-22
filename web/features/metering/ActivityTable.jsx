import styles from './ActivityTable.module.css';
import { Button } from '../../components/ui/Button.jsx';
import { Panel } from '../../components/ui/Panel.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { SectionHeading } from '../../components/ui/SectionHeading.jsx';
import { formatEventDate, formatMoney, formatNumber } from '../../lib/format.js';

function ActivityRow({ event }) {
  return (
    <tr>
      <td>
        <span className={styles.activityTable__icon}>
          <Icon type="bolt" />
        </span>
        <span className={styles.activityTable__id}>
          Generation <small>{event.id.slice(0, 8)}</small>
        </span>
      </td>
      <td>{formatNumber(event.usage.tokens)}</td>
      <td className={styles.activityTable__mono}>{formatMoney(event.costMicroUsd)}</td>
      <td>{formatEventDate(event.createdAt)}</td>
      <td>
        <span className={styles.activityTable__badge}>Recorded</span>
      </td>
    </tr>
  );
}

export function ActivityTable({ events, busy, refreshing, onRefresh }) {
  return (
    <Panel as="section">
      <SectionHeading
        className={styles.activityTable__heading}
        title="Recent activity"
        description="Your latest successful generations."
      >
        <Button
          variant="text"
          className={styles.activityTable__refreshBtn}
          disabled={busy}
          onClick={onRefresh}
        >
          <Icon type="refresh" />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </SectionHeading>
      <div className={styles.activityTable__wrap}>
        <table className={styles.activityTable__table} aria-label="Recent successful generations">
          <thead>
            <tr>
              <th scope="col">EVENT</th>
              <th scope="col">TOKENS</th>
              <th scope="col">COST (USD)</th>
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
