import * as wasm from '@minotaur-ergo/ergo-lib';
import { DAppType } from '@minotaur-ergo/types';
import {
  BalanceTwoTone,
  BuildCircleTwoTone,
  CardGiftcardTwoTone,
  LocalFireDepartmentTwoTone,
  TokenTwoTone,
} from '@mui/icons-material';

import AirDrop from '@/pages/wallet-page/dapps/apps/air-drop/AirDrop';

import BoxConsolidation from './box-consolidation/BoxConsolidation';
import BurnToken from './burn-token/BurnToken';
import IssueToken from './issue-token/IssueToken';
import SigmaUSD from './sigma-usd/SigmaUSD';
import SigmaUsdReadMe from './sigma-usd/SigmaUsdReadMe';

export const apps: Array<DAppType> = [
  {
    name: 'Issue Token',
    description: 'Issue new token using EIP-004',
    id: 'issueToken',
    networks: [wasm.NetworkPrefix.Mainnet, wasm.NetworkPrefix.Testnet],
    component: IssueToken,
    color: 'primary.main',
    icon: <TokenTwoTone fontSize="large" />,
  },
  {
    name: 'Burn Token',
    description: 'Burn some tokens available in your wallet',
    id: 'burnToken',
    networks: [wasm.NetworkPrefix.Mainnet, wasm.NetworkPrefix.Testnet],
    component: BurnToken,
    color: 'error.main',
    icon: <LocalFireDepartmentTwoTone fontSize="large" />,
  },
  {
    name: 'SigmaUSD',
    description: 'Buy or sell SigmaUSD and SigmaRSV',
    readme: <SigmaUsdReadMe />,
    id: 'sigmaUsd',
    networks: [wasm.NetworkPrefix.Mainnet],
    component: SigmaUSD,
    color: 'secondary.main',
    icon: <BalanceTwoTone fontSize="large" />,
  },
  {
    name: 'Box Consolidation',
    description: 'Renew unspent boxes',
    id: 'boxconsolidation',
    networks: [wasm.NetworkPrefix.Mainnet, wasm.NetworkPrefix.Testnet],
    component: BoxConsolidation,
    color: 'success.main',
    icon: <BuildCircleTwoTone fontSize="large" />,
  },
  {
    name: 'Air Drop',
    description: 'AirDrop Erg or tokens to list of addresses',
    id: 'airdrop',
    networks: [wasm.NetworkPrefix.Mainnet, wasm.NetworkPrefix.Testnet],
    component: AirDrop,
    color: 'secondary.dark',
    icon: <CardGiftcardTwoTone fontSize="large" />,
  },
];
