import { Box, Typography } from '@mui/material';

interface AssetItemDescriptionPropsType {
  description?: string;
}

const AssetItemDescription = (props: AssetItemDescriptionPropsType) => {
  const getParsedJson = (str: string) => {
    try {
      const obj = JSON.parse(str);
      return obj && typeof obj === 'object' ? obj : null;
    } catch {
      return null;
    }
  };

  const parsedData = getParsedJson(props.description || '');

  const renderJson = (data: unknown, level: number = 0) => {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <Box
          key={index}
          sx={{
            pl: 2,
            borderLeft: '1px solid #ea0e0e0',
          }}
        >
          {typeof item === 'object' && item !== null ? (
            renderJson(item, level + 1)
          ) : (
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#444',
              }}
            >
              {String(item)}
            </Typography>
          )}
        </Box>
      ));
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data as Record<string, unknown>).map(
        ([key, value]) => {
          const isObject = value !== null && typeof value === 'object';
          return (
            <Box key={key} sx={{ pl: level > 0 ? 2 : 0, mt: 0.5 }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#111',
                  fontWeight: 700,
                }}
              >
                {key}:
              </Typography>
              {isObject ? (
                <Box sx={{ borderLeft: '1px solid #eee', ml: 0.5 }}>
                  {renderJson(value, level + 1)}
                </Box>
              ) : (
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#666',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    display: 'inline',
                  }}
                >
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

  return (
    <Box sx={{ mt: 1 }}>
      {parsedData ? (
        <Box
          sx={{
            p: 2,
            bgcolor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee',
            overflow: 'hidden',
          }}
        >
          {renderJson(parsedData)}
        </Box>
      ) : (
        <Typography>{props.description}</Typography>
      )}
    </Box>
  );
};
export default AssetItemDescription;
