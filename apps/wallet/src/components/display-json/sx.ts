const mono = { fontFamily: 'monospace', fontSize: '0.8rem' } as const;

const sx = {
  arrayItem: { pl: 2, borderLeft: '1px solid #e0e0e0' },
  objectChild: { borderLeft: '1px solid #eee', ml: 0.5 },
  row: (level: number) => ({ pl: level > 0 ? 2 : 0, mt: 0.5 }),
  key: { ...mono, color: '#111', fontWeight: 700 },
  arrayValue: { ...mono, color: '#444' },
  value: {
    ...mono,
    ml: 1,
    color: '#666',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    display: 'inline',
  },
} as const;

export default sx;
