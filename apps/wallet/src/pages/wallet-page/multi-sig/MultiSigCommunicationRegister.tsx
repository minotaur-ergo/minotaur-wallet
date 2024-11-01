import { deriveAddressFromXPub } from '@/action/address';
import { ServerDbAction } from '@/action/db';
import {
  getTeams,
  register,
  registerTeam,
  unregister,
} from '@/action/multi-sig-server';
import { getProver, validatePassword } from '@/action/wallet';
import ActionWithConfirm from '@/components/action-with-confirm/ActionWithConfirm';
import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import LoadingPage from '@/components/loading-page/LoadingPage';
import PasswordField from '@/components/password-field/PasswordField';
import { WalletType } from '@/db/entities/Wallet';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import useCommunicationSecret from '@/hooks/signing-server/useCommunicationSecret';
import useRegisteredTeam from '@/hooks/signing-server/useRegisteredTeam';
import AppFrame from '@/layouts/AppFrame';
import AddressActionList from '@/pages/wallet-page/multi-sig/components/AddressActionList';
import { StateWallet } from '@/store/reducer/wallet';
import { readClipBoard } from '@/utils/clipboard';
import getChain from '@/utils/networks';
import {
  ContentPasteOutlined,
  DeleteOutlineOutlined,
} from '@mui/icons-material';
import { Alert, AlertTitle, Button, IconButton, Stack } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import * as wasm from 'ergo-lib-wasm-browser';
import { useNavigate } from 'react-router-dom';

interface MultiSigCommunicationRegisterPropsType {
  wallet: StateWallet;
}

export const MultiSigCommunicationRegister = (
  props: MultiSigCommunicationRegisterPropsType,
) => {
  const navigate = useNavigate();
  const signer = useSignerWallet(props.wallet);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [url, setUrl] = useState<string>('http://127.0.0.1:3100');
  const [password, setPassword] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(true);
  const secretLoading = useCommunicationSecret(props.wallet.id, lastUpdate);
  const { team, loading } = useRegisteredTeam(
    secretLoading.server,
    props.wallet,
    signer,
  );
  useEffect(() => {
    setHasError((signer && validatePassword(signer.seed, password)) ?? false);
  }, [password, signer]);
  const paste = () => {
    readClipBoard().then((data) => {
      setUrl(data);
    });
  };
  const registerOnServer = () => {
    if (signer && !team && !loading && !secretLoading.loading) {
      const signFn = async (data: Buffer) => {
        const prover = await getProver(signer, password);
        return Buffer.from(
          prover.sign_message_using_p2pk(
            wasm.Address.from_base58(signer.addresses[0].address),
            data,
          ),
        );
      };
      register(url, props.wallet, signer.xPub, signFn).then(async () => {
        const server = await ServerDbAction.getInstance().getWalletServer(
          props.wallet.id,
        );
        if (server) {
          const team = await getTeams(server, props.wallet, signer.xPub);
          if (!team) {
            await registerTeam(server, props.wallet, signer.xPub);
          }
        }
        setLastUpdate(Date.now());
      });
    }
  };
  const handleUnregister = () => {
    if (!secretLoading.loading && !loading && secretLoading.server && signer)
      unregister(secretLoading.server, props.wallet, signer.xPub)
        .then(() => setLastUpdate(Date.now()))
        .then(() => {
          navigate(-1);
        });
  };
  const registered = team?.xpubs.filter((item) => item.registered).length ?? 0;
  const chain = getChain(props.wallet.networkType);
  const registeredAddresses =
    team?.xpubs.map((item) => ({
      address: deriveAddressFromXPub(item.xpub, chain.prefix, 0).address,
      completed: item.registered,
    })) ?? [];
  return (
    <AppFrame
      title="Multi-sig Registration"
      navigation={<BackButtonRouter />}
      toolbar={
        team === null ? (
          <Button disabled={!hasError} onClick={registerOnServer}>
            Register
          </Button>
        ) : undefined
      }
    >
      {secretLoading.loading || loading ? (
        <LoadingPage />
      ) : team ? (
        <React.Fragment>
          <Alert
            severity={registered < team.m ? 'warning' : 'success'}
            icon={false}
          >
            <AlertTitle>
              {registered < team.m
                ? `${team.m - registered} more registers!`
                : 'Registered!'}
            </AlertTitle>
            {registered} of {team.m} required signers are registered.
          </Alert>
          <AddressActionList addresses={registeredAddresses} />
          <ActionWithConfirm
            label="Unregister"
            helperText="Some description about this option goes here."
            icon={<DeleteOutlineOutlined />}
            confirmButtonText="Unregister"
            confirmTitle="Unregister?!"
            confirmDescription="Are you sure you want to unregister?"
            onClick={handleUnregister}
            color="error"
          />
        </React.Fragment>
      ) : (
        <Stack spacing={2}>
          {signer ? (
            <React.Fragment>
              <TextField
                label="URL"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                helperText="Enter the multi-sig communication URL to register on it"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={paste}>
                        <ContentPasteOutlined />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {signer.type === WalletType.Normal ? (
                <PasswordField
                  password={password}
                  setPassword={setPassword}
                  label="Wallet Password"
                  helperText="Enter your wallet sign proof for server"
                />
              ) : undefined}
            </React.Fragment>
          ) : (
            <LoadingPage />
          )}
        </Stack>
      )}
    </AppFrame>
  );
};
