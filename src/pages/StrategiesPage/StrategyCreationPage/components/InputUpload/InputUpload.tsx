import { FC, useRef } from 'react';

import { useDrag } from './useDrag';
import { Trash, UploadImg } from '@frakt/icons';
import styles from './InputUpload.module.scss';
import { FormValues } from '../../types';

interface InputUploadProps {
  imageUrl: string;
  setImageUrl: any;
}

const InputUpload: FC<InputUploadProps> = ({ imageUrl, setImageUrl }) => {
  const drop = useRef(null);

  useDrag(drop);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target?.files?.length) {
      setImageUrl((prev: FormValues) => ({
        ...prev,
        imageUrl: URL.createObjectURL(e.target.files[0]),
      }));
    }

    if (e.dataTransfer?.files?.length) {
      const { files } = e.dataTransfer;
      setImageUrl((prev: FormValues) => ({
        ...prev,
        imageUrl: URL.createObjectURL(files[0]),
      }));
    }
  };

  const closeAndRemoveImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    URL.revokeObjectURL(imageUrl);
    setImageUrl((prev) => ({ ...prev, imageUrl: '' }));
  };

  return (
    <div className={styles.inputUpload}>
      <div className={styles.title}>strategy pfp</div>

      <input
        accept="image/*"
        name="image"
        id="image"
        className={styles.input}
        onChange={handleDrop}
        onClick={(e) => (imageUrl ? e.preventDefault() : null)}
        type="file"
      />
      <label ref={drop} htmlFor="image" className={styles.label} onClick={null}>
        {!!imageUrl && <div className={styles.backdrop}></div>}
        {!!imageUrl && (
          <div onClick={closeAndRemoveImg} className={styles.close}>
            <Trash />
          </div>
        )}
        <div className={styles.field}>
          {!imageUrl && <UploadImg />}
          {!imageUrl && `сlick here or drag 'n' drop strategy PFP`}
        </div>
        {!!imageUrl && (
          <img src={imageUrl} alt="avatar" className={styles.img} />
        )}
      </label>
    </div>
  );
};

export default InputUpload;
