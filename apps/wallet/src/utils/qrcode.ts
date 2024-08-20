import { DetectParam } from '@/types/qrcode';

const getCameraBoxBoundary = () => {
  const height = window.innerHeight - 72;
  const width = window.innerWidth;
  const min = Math.min(height, width);
  const size = min * 0.8;
  const left = ((width - size) / 2) * window.devicePixelRatio;
  const top = ((height - size) / 2) * window.devicePixelRatio;
  const right = left + size * window.devicePixelRatio;
  const bottom = top + size * window.devicePixelRatio;
  return { left, top, right, bottom };
};

const detectPageFromJson = (
  value: string,
  prefix: string,
): DetectParam | null => {
  try {
    const valueJson = JSON.parse(value);
    if (Object.prototype.hasOwnProperty.call(valueJson, prefix)) {
      const payload = valueJson[prefix];
      const total = Object.prototype.hasOwnProperty.call(valueJson, 'n')
        ? valueJson['n']
        : 1;
      const page = Object.prototype.hasOwnProperty.call(valueJson, 'p')
        ? valueJson['p']
        : 1;
      return { payload, page, total };
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

export { getCameraBoxBoundary, detectPageFromJson };
