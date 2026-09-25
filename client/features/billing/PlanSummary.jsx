import styles from "./PlanSummary.module.css";
import labelStyles from "../../components/ui/Label.module.css";
import planAllowanceStyles from "./PlanAllowance.module.css";
import { Icon } from "../../components/ui/Icon.jsx";
import { formatNumber } from "../../lib/format.js";

export function PlanSummary({ plan, limits, onExplore }) {
  return (
    <section className={styles.root}>
      <div className={styles.top}>
        <span className={labelStyles.tag}>YOUR PLAN</span>
        <span className={styles.symbol}>✳</span>
      </div>
      <h2 className={styles.title}>
        {plan.name}
        <span className={styles.suffix}>plan</span>
      </h2>
      <p className={styles.description}>
        A clear allowance.
        <br />
        No surprises along the way.
      </p>
      <div className={styles.rule} />
      <div className={planAllowanceStyles.root}>
        <Icon type="check" />
        {formatNumber(limits.apiCalls)} API calls / month
      </div>
      <div className={planAllowanceStyles.root}>
        <Icon type="check" />
        {formatNumber(limits.tokens)} AI tokens / month
      </div>
      <button className={styles.button} onClick={onExplore}>
        Explore your plan
      </button>
    </section>
  );
}
