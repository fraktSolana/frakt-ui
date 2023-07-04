import { FC } from 'react';
import { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip';
import RcTooltip from 'rc-tooltip';
import classNames from 'classnames';

import 'rc-tooltip/assets/bootstrap_white.css';
import styles from './Tooltip.module.scss';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface TooltipProps extends RcTooltipProps {
  innerClassName?: string;
}

const Tooltip: FC<TooltipProps> = ({
  children,
  overlayClassName,
  innerClassName,
  trigger = 'hover',
  ...props
}) => (
  <RcTooltip
    {...props}
    arrowContent={<></>}
    overlayClassName={classNames(overlayClassName, styles['rcTooltipInner'])}
    getTooltipContainer={(triggerNode) => (triggerNode as any).parentNode}
  >
    {children ? (
      children
    ) : (
      <QuestionCircleOutlined
        className={classNames(styles.questionIcon, innerClassName)}
      />
    )}
  </RcTooltip>
);

export default Tooltip;
