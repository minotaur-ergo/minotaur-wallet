import React from 'react';
import { Divider, Grid, List, ListItem, ListItemText } from '@mui/material';
import BottomSheet from '../bottom-sheet/BottomSheet';
import { TokenData } from '../../action/Types';
import Erg from '../value/Erg';

interface BurningTokenDisplayPropsType {
  show: boolean;
  burningBalance: Array<TokenData>;
  close: () => unknown;
  network_type: string;
}

const BurningTokenDisplay = (props: BurningTokenDisplayPropsType) => {
  return (
    <BottomSheet show={props.show} close={props.close}>
      <Grid container>
        <Grid item xs={12}>
          <List>
            <ListItem>
              <ListItemText
                primary="Burning Tokens"
                secondary="These assets will be lost"
                style={{ color: 'red' }}
              />
            </ListItem>
            <Divider />
            {props.burningBalance.map((token) => (
              <ListItem>
                <ListItemText
                  primary={token.tokenId}
                  secondary={
                    <React.Fragment>
                      <span style={{ display: 'block' }}>
                        <Erg
                          network_type={props.network_type}
                          erg={token.total}
                          showUnit={true}
                        />
                      </span>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </BottomSheet>
  );
};

export default BurningTokenDisplay;
