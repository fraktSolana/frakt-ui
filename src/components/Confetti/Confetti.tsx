import { FC } from 'react';
import ReactConfetti from 'react-confetti';

import { useConfetti } from './hooks';

const Confetti: FC = () => {
  const { visible, setVisible } = useConfetti();

  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <>
      {visible && (
        <ReactConfetti
          numberOfPieces={500}
          recycle={false}
          run={true}
          width={width}
          height={height}
          confettiSource={{
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: window.innerHeight,
          }}
          onConfettiComplete={() => {
            setVisible(false);
          }}
        />
      )}
    </>
  );
};

export default Confetti;
