import { Box } from '@mui/material';

import DisplayJson from '@/components/display-json/DisplayJson';

export interface AssetItemDescriptionPropsType {
  description: string;
}

const AssetItemDescription = (props: AssetItemDescriptionPropsType) => {
  return (
    <Box sx={{ mt: 1 }}>
      <DisplayJson data={props.description} />
    </Box>
  );
};
export default AssetItemDescription;
