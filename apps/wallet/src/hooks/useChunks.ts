import { ChunkResponse, ChunkedData, QrCodeTypeEnum } from '@/types/qrcode';
import { createEmptyArray } from '@/utils/functions';
import { useEffect, useState } from 'react';

const useChunks = (scanned: string, type?: QrCodeTypeEnum): ChunkResponse => {
  const [chunks, setChunks] = useState<Array<string>>([]);
  const [loaded, setLoaded] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const updateChunks = (newChunks: Array<string>) => {
      setChunks(newChunks);
      setError('');
      setLoaded(scanned);
      setLoading(false);
    };
    const initialize = (length: number, index: number, content: string) => {
      if (!initialized) {
        const newChunks = createEmptyArray(length, '');
        newChunks[index] = content;
        setInitialized(true);
        updateChunks(newChunks);
      } else {
        setError('Invalid QrCode Scanned');
        setLoaded(scanned);
        setLoading(false);
      }
    };
    if (type) {
      if (loaded !== scanned && !loading) {
        try {
          setLoading(true);
          const newRaw = JSON.parse(scanned) as ChunkedData;
          const chunk = newRaw[type];
          const index = newRaw.p ?? 1;
          const total = newRaw.n ?? 1;
          if (chunks.length === 0) {
            initialize(total, index - 1, chunk);
          } else if (total !== chunks.length) {
            setError('Invalid QrCode Scanned. Page size are mismatched');
          } else {
            const newChunks = [...chunks];
            newChunks[index - 1] = chunk;
            updateChunks(newChunks);
          }
        } catch (exp) {
          console.warn(exp);
          if (chunks.length === 0) {
            initialize(1, 0, scanned);
          } else {
            setError('Invalid Json Scanned');
            setLoaded(scanned);
            setLoading(false);
          }
        }
      }
    } else {
      if (chunks.length > 0) {
        setLoading(true);
        setChunks([]);
        setLoaded('');
        setError('');
        setInitialized(false);
        setLoading(false);
      }
    }
  }, [chunks, loaded, loading, scanned, type, initialized]);
  const validChunks = chunks.filter((item) => item !== '').length;
  return {
    displayChunks: validChunks !== chunks.length,
    error: error,
    completedChunks: validChunks,
    totalPages: chunks.length,
    loading: loading,
    data: chunks.join(''),
    last: loaded,
  };
};

export default useChunks;
