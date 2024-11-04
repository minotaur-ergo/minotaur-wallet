import { MultiSigDbAction, ServerDbAction } from '@/action/db';
import Server from '@/db/entities/Server';
import { StateWallet } from '@/store/reducer/wallet';
import { blake2b } from 'blakejs';
import { Buffer } from 'buffer';
import {
  ReducedTx,
  ReducedTxList,
  RegisteredTeam, TxCommitmentResponse
} from '@/types/multi-sig-server';
import axios from 'axios';
import * as secp from '@noble/secp256k1';
import * as wasm from 'ergo-lib-wasm-browser';

const signPayload = async (payload: string, secret: string) => {
  const msg = blake2b(Uint8Array.from(Buffer.from(payload)), undefined, 32);
  const signature = await secp.signAsync(
    msg,
    Uint8Array.from(Buffer.from(secret, 'hex')),
  );
  return Buffer.from(signature.toCompactRawBytes()).toString('base64');
};

const addTeam = async (server: Server, wallet: StateWallet, xpub: string) => {
  try {
    const keys = await MultiSigDbAction.getInstance().getWalletKeys(wallet.id);
    const xpubs = keys.map((item) => item.extended_key);
    const data = {
      name: wallet.name,
      xpubs,
      m: wallet.requiredSign,
      xpub: xpub,
      pub: Buffer.from(server.public, 'hex').toString('base64'),
    };
    const signature = await signPayload(JSON.stringify(data), server.secret);
    const res = await axios.post(
      'addTeam',
      { ...data, signature },
      {
        baseURL: server.address,
      },
    );
    await ServerDbAction.getInstance().setTeamId(wallet.id, res.data.teamId);
    return res.data.teamId;
  } catch (err) {
    console.error(err);
  }
};

const getTeams = async (server: Server, wallet: StateWallet, xpub: string) => {
  try {
    const data = {
      xpub: xpub,
      pub: Buffer.from(server.public, 'hex').toString('base64'),
    };
    const signature = await signPayload(JSON.stringify(data), server.secret);
    const response = await axios.post<Array<RegisteredTeam>>(
      'getTeams',
      {
        ...data,
        signature,
      },
      { baseURL: server.address },
    );
    const walletAddresses = wallet.addresses.map((item) => item.address);
    const filteredTeam = response.data.filter((item) =>
      walletAddresses.includes(item.address),
    );
    const team = filteredTeam.length > 0 ? filteredTeam[0] : null;
    if (team) {
      await ServerDbAction.getInstance().setTeamId(wallet.id, team.id);
    }
    return team;
  } catch (err) {
    console.error(err);
  }
  return undefined;
};

const register = async (
  address: string,
  wallet: StateWallet,
  xpub: string,
  signDataFn: (data: Buffer) => Promise<Buffer>,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    const sign = await signDataFn(Buffer.from(publicKey));
    const data = {
      xpub: xpub,
      pub: Buffer.from(publicKey).toString('base64'),
      signature: sign.toString('base64'),
    };
    const res = await axios.post('addPk', data, { baseURL: address });
    if (res.status >= 200 && res.status < 300) {
      await ServerDbAction.getInstance().addWalletServer(
        wallet.id,
        address,
        Buffer.from(privateKey).toString('hex'),
        Buffer.from(publicKey).toString('hex'),
      );
      return { success: true };
    }
    return {
      success: false,
      message: 'server response error ' + res.status + ' ' + res.statusText,
    };
  } catch (exp) {
    console.error(exp);
    return {
      success: false,
      message: 'Can not register ' + exp,
    };
  }
};

const unregister = async (
  server: Server,
  wallet: StateWallet,
  xpub: string,
) => {
  try {
    const data = {
      xpub: xpub,
      pub: Buffer.from(server.public, 'hex').toString('base64'),
    };
    const signature = await signPayload(JSON.stringify(data), server.secret);
    const res = await axios.post(
      'delPk',
      { ...data, signature },
      { baseURL: server.address },
    );
    if (res.status >= 200 && res.status < 300) {
      await ServerDbAction.getInstance().deleteWalletServer(wallet.id);
      return { success: true };
    }
    return {
      success: false,
      message: 'server response error ' + res.status + ' ' + res.statusText,
    };
  } catch (exp) {
    console.error(exp);
    return {
      success: false,
      message: 'Can not register ' + exp,
    };
  }
};

const registerTeam = async (
  server: Server,
  wallet: StateWallet,
  xpub: string,
) => {
  let team = await getTeams(server, wallet, xpub);
  if (!team) {
    await addTeam(server, wallet, xpub);
    team = await getTeams(server, wallet, xpub);
  }
  return team;
};

const addTx = async (
  server: Server,
  wallet: StateWallet,
  xpub: string,
  reduced: string,
  boxes: Array<string>,
  dataBoxes: Array<string> = [],
) => {
  try {
    const data = {
      reducedTx: reduced,
      xpub: xpub,
      pub: Buffer.from(server.public, 'hex').toString('base64'),
      teamId: server.team_id,
      inputBoxes: boxes,
      dataInputs: dataBoxes,
      maxDerived: wallet.addresses.length,
    };
    const signature = await signPayload(JSON.stringify(data), server.secret);
    const res = await axios.post(
      'addReducedTx',
      { ...data, signature },
      {
        baseURL: server.address,
      },
    );
    return res.data.reducedId;
  } catch (err) {
    console.error(err);
  }
};

const addCommitments = async (
  server: Server,
  xpub: string,
  txId: string,
  commitments: wasm.TransactionHintsBag
) => {
  try {
    const data = {
      xpub: xpub,
      pub: Buffer.from(server.public, 'hex').toString('base64'),
      commitment: commitments.to_json(),
      reducedId: txId
    }
    const signature = await signPayload(JSON.stringify(data), server.secret);
    const res = await axios.post(
      'addCommitment',
      { ...data, signature },
      {
        baseURL: server.address,
      },
    );
    return res.data.reducedId;
  } catch (err) {
    console.error(err);
  }
}

const addProof = async (
  server: Server,
  xpub: string,
  txId: string,
  proofs: wasm.TransactionHintsBag
) => {
  try {
    const data = {
      xpub: xpub,
      pub: Buffer.from(server.public, 'hex').toString('base64'),
      proof: proofs.to_json(),
      reducedId: txId
    }
    const signature = await signPayload(JSON.stringify(data), server.secret);
    const res = await axios.post(
      'addPartialProof',
      { ...data, signature },
      {
        baseURL: server.address,
      },
    );
    return res.data.reducedId;
  } catch (err) {
    console.error(err);
  }
}
const getTxs = async (
  server: Server,
  xpub: string,
): Promise<Array<ReducedTxList>> => {
  if (!server.team_id) return [];
  const data = {
    xpub: xpub,
    pub: Buffer.from(server.public, 'hex').toString('base64'),
    teamId: server.team_id,
  };
  const signature = await signPayload(JSON.stringify(data), server.secret);
  const res = await axios.post<Array<ReducedTxList>>(
    'getReducedTxs',
    { ...data, signature },
    {
      baseURL: server.address,
    },
  );
  return res.data;
};

const getTx = async (
  server: Server,
  xpub: string,
  txId: string,
): Promise<ReducedTx> => {
  const data = {
    xpub: xpub,
    pub: Buffer.from(server.public, 'hex').toString('base64'),
    reducedId: txId,
  };
  const signature = await signPayload(JSON.stringify(data), server.secret);
  const res = await axios.post<ReducedTx>(
    'getTx',
    { ...data, signature },
    {
      baseURL: server.address,
    },
  );
  return res.data;
};

const getTxStatus = async (server: Server, xpub: string, txId: string) => {
  const data = {
    xpub: xpub,
    pub: Buffer.from(server.public, 'hex').toString('base64'),
    reducedId: txId,
  };
  const signature = await signPayload(JSON.stringify(data), server.secret);
  const res = await axios.post(
    'getReducedStatus',
    { ...data, signature },
    {
      baseURL: server.address,
    },
  );
  return res.data;
};

const getCommitments = async (server: Server, xpub: string, txId: string) => {
  const data = {
    xpub: xpub,
    pub: Buffer.from(server.public, 'hex').toString('base64'),
    reducedId: txId,
  };
  const signature = await signPayload(JSON.stringify(data), server.secret);
  const res = await axios.post<TxCommitmentResponse>(
    'getCommitments',
    { ...data, signature },
    {
      baseURL: server.address,
    },
  );
  return res.data;
};

export {
  register,
  unregister,
  registerTeam,
  addTx,
  addCommitments,
  addProof,
  getTeams,
  getTxs,
  getTxStatus,
  getTx,
  getCommitments,
};
