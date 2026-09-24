import styles from './PlanSummary.module.css';
import labelStyles from '../../components/ui/Label.module.css';
import planAllowanceStyles from './PlanAllowance.module.css';
import { Icon } from '../../components/ui/Icon.jsx';
import { formatNumber, formatResetDate } from '../../lib/format.js';

export function PlanSummary({ plan, limits, resetsAt, onExplore }) {
  return (
    <section className={styles.planSummary}>
      <div className={styles.planSummary__top}>
        <span className={labelStyles.tag}>YOUR PLAN</span>
        <span className={styles.planSummary__symbol}>✳</span>
      </div>
      <h2 className={styles.planSummary__title}>
        {plan.name}
        <span className={styles.planSummary__suffix}>plan</span>
      </h2>
      <p className={styles.planSummary__description}>
        A clear allowance.
        <br />
        No surprises along the way.
      </p>
      <div className={styles.planSummary__rule} />
      <div className={planAllowanceStyles.planAllowance}>
        <Icon type="check" />
        {formatNumber(limits.apiCalls)} API calls / month
      </div>
      <div className={planAllowanceStyles.planAllowance}>
        <Icon type="check" />
        {formatNumber(limits.tokens)} AI tokens / month
      </div>
      <button className={styles.planSummary__button} onClick={onExplore}>
        Explore your plan
      </button>
      <small className={styles.planSummary__footnote}>
        Resets {formatResetDate(resetsAt)} · UTC
      </small>
    </section>
  );
}
