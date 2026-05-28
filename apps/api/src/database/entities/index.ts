import { Auth } from './auth';
import { Box } from './box';
import { Hint, HintType } from './hint';
import { Tx } from './tx';
import { User } from './user';
import { UserWallet } from './user-wallet';
import { Wallet } from './wallet';

const entities = [Auth, Box, User, UserWallet, Wallet, Hint, Tx];

export { entities, HintType };
