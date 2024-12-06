import { createEmptyArray } from '@/utils/functions';
import { useEffect, useState } from 'react';

const useChunks = (scanned: string) => {
  const [chunks, setChunks] = useState<Array<string>>([]);
  const [completed, setCompleted] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [loaded, setLoaded] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!loading && loaded !== scanned) {
      setLoading(true);
      try {
        const scannedJSON = JSON.parse(scanned);
        if (type !== '') {
          if (
            !Object.prototype.hasOwnProperty.call(scannedJSON, type) ||
            scannedJSON.n !== chunks.length
          ) {
            setError(
              'It seems qrcode changed. Please close qrcode scanner and try again',
            );
          } else if (scannedJSON.p > scannedJSON.n) {
            setError('Invalid QrCode Scanned');
          } else {
            setChunks((chunks) => {
              const newChunks = [...chunks];
              newChunks[scannedJSON.p - 1] = scannedJSON[type];
              return newChunks;
            });
          }
        } else {
          const newType = Object.keys(scannedJSON).filter(
            (item) => !['p', 'n'].includes(item),
          )[0];
          setType(newType);
          if (!scannedJSON.n || scannedJSON.n === 1) {
            setCompleted(JSON.stringify({ [newType]: scannedJSON[newType] }));
          } else {
            const newChunks = createEmptyArray(scannedJSON.n, '');
            newChunks[scannedJSON.p - 1] = scannedJSON[newType];
            setChunks(newChunks);
          }
        }
        setLoaded(scanned);
        setLoading(false);
      } catch (e) {
        if (chunks.length === 0) {
          setCompleted(scanned);
        } else {
          setError('Invalid Data Scanned');
        }
      }
    }
  }, [scanned, loaded, loading, chunks, type]);
  useEffect(() => {
    if (
      chunks.length > 0 &&
      chunks.filter((item) => item === '').length === 0
    ) {
      setCompleted(JSON.stringify({ [type]: chunks.join('') }));
    }
  }, [type, chunks]);
  return {
    chunks,
    error,
    loading,
    completed,
  };
};

export default useChunks;
