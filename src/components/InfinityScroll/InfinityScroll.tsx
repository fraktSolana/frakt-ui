import InfiniteScrollComponent, {
  Props,
} from 'react-infinite-scroll-component';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { Loader } from '../Loader';
import EmptyList from '../EmptyList';

interface InfinityScrollProps {
  itemsToShow?: number;
  next: () => void;
  infinityScrollProps?: Omit<
    Props,
    'dataLength' | 'next' | 'hasMore' | 'children'
  >;
  wrapperClassName?: string;
  emptyMessage?: string;
  emptyMessageClassName?: string;
  isLoading?: boolean;
  customLoader?: JSX.Element;
  children: JSX.Element[];
  scrollableTargetId?: string;
}

const InfinityScroll = ({
  itemsToShow = 20,
  next,
  wrapperClassName,
  isLoading = false,
  emptyMessage = 'No items found',
  children,
  infinityScrollProps,
  scrollableTargetId = 'app-content',
  emptyMessageClassName,
  customLoader,
}: InfinityScrollProps): JSX.Element => {
  if (isLoading) {
    return (
      customLoader || (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      )
    );
  }

  if (!children.length) {
    return <EmptyList className={emptyMessageClassName} text={emptyMessage} />;
  }

  return (
    <InfiniteScrollComponent
      scrollableTarget={scrollableTargetId}
      next={next}
      dataLength={itemsToShow}
      hasMore={true}
      loader={false}
      style={{ overflow: 'initial' }}
      {...infinityScrollProps}
    >
      <div className={classNames(wrapperClassName)}>
        {children?.slice(0, itemsToShow).map((child) => child)}
      </div>
    </InfiniteScrollComponent>
  );
};

export default InfinityScroll;
