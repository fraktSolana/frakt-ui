import { FC } from 'react';

import { UploadImg } from '@frakt/icons';
import styles from './InputUpload.module.scss';
import { FormValues } from '@frakt/utils/strategies/types';

interface InputUploadProps {
  imageUrl: string;
  setFormValues: (
    value: FormValues | ((prevVar: FormValues) => FormValues),
  ) => void;
}

const InputUpload: FC<InputUploadProps> = ({ imageUrl, setFormValues }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target?.files?.length) {
      setFormValues((prev) => ({
        ...prev,
        image: {
          file: e.target.files[0],
          imageUrl: URL.createObjectURL(e.target.files[0]),
        },
      }));
    }

    if (e.dataTransfer?.files?.length) {
      const { files } = e.dataTransfer;
      setFormValues((prev) => ({
        ...prev,
        image: {
          file: files[0],
          imageUrl: URL.createObjectURL(files[0]),
        },
      }));
    }
  };

  // const closeAndRemoveImg = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   URL.revokeObjectURL(imageUrl);
  //   setImageUrl((prev) => ({
  //     ...prev,
  //     image: {
  //       file: null,
  //       imageUrl: '',
  //     },
  //   }));
  // };

  return (
    <div className={styles.inputUpload}>
      <div className={styles.title}>strategy pfp</div>

      <input
        accept=".png, .jpg, .jpeg"
        name="image"
        id="image"
        className={styles.input}
        onChange={handleDrop}
        type="file"
      />
      <label htmlFor="image" className={styles.label}>
        {!!imageUrl && <div className={styles.backdrop}></div>}

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
