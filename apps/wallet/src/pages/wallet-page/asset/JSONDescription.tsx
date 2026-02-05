import { Box, Typography } from '@mui/material';

import { AssetItemDescriptionPropsType } from './AssetItemDescription';

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

const JSONDescription = ({ description }: AssetItemDescriptionPropsType) => {
  const renderJSONArray = (data: unknown[], level: number) =>
    data.map((item, index) => (
      <Box key={index} sx={sx.arrayItem}>
        {item !== null && typeof item === 'object' ? (
          renderJson(item, level + 1)
        ) : (
          <Typography sx={sx.arrayValue}>{String(item)}</Typography>
        )}
      </Box>
    ));

  const renderJson = (data: unknown, level = 0) => {
    if (Array.isArray(data)) return renderJSONArray(data, level);

    if (data !== null && typeof data === 'object') {
      return Object.entries(data as Record<string, unknown>).map(
        ([key, value]) => {
          const isObject = value !== null && typeof value === 'object';

          return (
            <Box key={key} sx={sx.row(level)}>
              <Typography component="span" sx={sx.key}>
                {key}:
              </Typography>

              {isObject ? (
                <Box sx={sx.objectChild}>{renderJson(value, level + 1)}</Box>
              ) : (
                <Typography component="span" sx={sx.value}>
                  {typeof value === 'string' ? `"${value}"` : String(value)}
                </Typography>
              )}
            </Box>
          );
        },
      );
    }

    return null;
  };

  return <>{renderJson(description)}</>;
};

export default JSONDescription;
