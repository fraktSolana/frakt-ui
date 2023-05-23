import { FC } from 'react';
import classNames from 'classnames';

import { useImagePreload } from '@frakt/hooks';

import styles from './ImageWithPreload.module.scss';

interface ImageWithPreloadProps {
  src: string;
  className?: string;
  alt?: string;
}

const ImageWithPreload: FC<ImageWithPreloadProps> = ({
  src,
  className,
  alt,
}) => {
  const imageLoaded = useImagePreload(src);

  return (
    <>
      {imageLoaded ? (
        <img className={className} src={src} alt={alt} />
      ) : (
        <div className={classNames(styles.preload, className)}>Loading...</div>
      )}
    </>
  );
};

export default ImageWithPreload;
