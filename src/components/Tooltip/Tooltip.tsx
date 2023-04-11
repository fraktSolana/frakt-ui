import { FC } from 'react';
import { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip';
import RcTooltip from 'rc-tooltip';
import cx from 'classnames';

import 'rc-tooltip/assets/bootstrap_white.css';
import styles from './Tooltip.module.scss';
import { QuestionCircleOutlined } from '@ant-design/icons';

const Tooltip: FC<RcTooltipProps> = ({
  children,
  overlayClassName,
  ...props
}) => (
  <RcTooltip
    {...props}
    arrowContent={<></>}
    overlayClassName={cx(overlayClassName, styles['rcTooltipInner'])}
    getTooltipContainer={(triggerNode) => (triggerNode as any).parentNode}
  >
    {children ? (
      children
    ) : (
      <QuestionCircleOutlined className={styles.questionIcon} />
    )}
  </RcTooltip>
);

export default Tooltip;
