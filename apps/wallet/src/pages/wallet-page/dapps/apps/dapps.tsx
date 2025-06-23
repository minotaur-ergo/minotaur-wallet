import AirDrop from '@/pages/wallet-page/dapps/apps/air-drop/AirDrop';
import { DAppType } from '@minotaur-ergo/types';
import SigmaUsdReadMe from './sigma-usd/SigmaUsdReadMe';
import * as wasm from 'ergo-lib-wasm-browser';
import IssueToken from './issue-token/IssueToken';
import BurnToken from './burn-token/BurnToken';
import SigmaUSD from './sigma-usd/SigmaUSD';
import TokenTwoToneIcon from '@mui/icons-material/TokenTwoTone';
import BalanceTwoToneIcon from '@mui/icons-material/BalanceTwoTone';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import BoxConsolidation from './box-consolidation/BoxConsolidation';
import { BuildCircleTwoTone, CardGiftcardTwoTone } from '@mui/icons-material';

export const apps: Array<DAppType> = [
  {
    name: 'Issue Token',
    description: 'Issue new token using EIP-004',
    id: 'issueToken',
    networks: [wasm.NetworkPrefix.Mainnet, wasm.NetworkPrefix.Testnet],
    component: IssueToken,
    color: 'primary.main',
    icon: <TokenTwoToneIcon fontSize="large" />,
  },
  {
    name: 'Burn Token',
    description: 'Burn some tokens available in your wallet',
    id: 'burnToken',
    networks: [wasm.NetworkPrefix.Mainnet, wasm.NetworkPrefix.Testnet],
    component: BurnToken,
    color: 'error.main',
    icon: <LocalFireDepartmentTwoToneIcon fontSize="large" />,
  },
  {
    name: 'SigmaUSD',
    description: 'Buy or sell SigmaUSD and SigmaRSV',
    readme: <SigmaUsdReadMe />,
    id: 'sigmaUsd',
    networks: [wasm.NetworkPrefix.Mainnet],
    component: SigmaUSD,
    color: 'secondary.main',
    icon: <BalanceTwoToneIcon fontSize="large" />,
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
