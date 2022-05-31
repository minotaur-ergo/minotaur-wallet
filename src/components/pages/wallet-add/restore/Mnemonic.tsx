import React, { useState } from "react";
import { Container, Grid, Button, FormControl, TextField, FormHelperText, Autocomplete } from "@mui/material";
import MnemonicView from "../elements/MnemonicView";
import { wordlists, getDefaultWordlist, mnemonicToEntropy } from "bip39";
import MnemonicPassword from "../elements/MnemonicPassword";
import InAdvancedMode from "../../../display-view/InAdvancedMode";

interface PropsType {
    mnemonic?: string;
    goBack: () => any;
    mnemonic_passphrase: string;
    goForward: (mnemonic: string, mnemonic_passphrase: string) => any;
}

const words = wordlists[getDefaultWordlist()];

const Mnemonic = (props: PropsType) => {
    const [mnemonic, setMnemonic] = useState(props.mnemonic ? props.mnemonic : "");
    const [mnemonicValid, setMnemonicValid] = useState(true);
    const [selected, setSelected] = useState("");
    const [mnemonic_passphrase, set_mnemonic_passphrase] = useState<{ password: string, valid: boolean }>({
        password: props.mnemonic_passphrase,
        valid: true
    });
    const selectElement = (element: string) => {
        if (words.indexOf(element) !== -1) {
            setMnemonic(mnemonic ? mnemonic + " " + element : element);
            setSelected("");
        }
    };
    const handleRemoveElement = (index: number) => {
        let mnemonicParts = mnemonic.split(" ");
        mnemonicParts.splice(index, 1);
        setMnemonic(mnemonicParts.join(" "));
    };
    const wordCount = mnemonic === "" ? 0 : mnemonic.split(" ").length;
    if (wordCount >= 12 && wordCount % 3 === 0) {
        try {
            mnemonicToEntropy(mnemonic, words);
            // mnemonicToSeedSync(mnemonic, '');
            if (!mnemonicValid) {
                setMnemonicValid(true);
            }
        } catch (exp) {
            if (mnemonicValid) {
                setMnemonicValid(false);
            }
        }
    }
    const filteredWords = words.filter(item => item.indexOf(selected) === 0);
    const requiredWordCount = Math.max(4, Math.ceil(wordCount / 3)) * 3
    return (
        <Container>
            <Grid container spacing={2}>
                {/*<Grid item xs={12}>*/}
                {/*    <WalletNetworkSelect network={network} setNetworkType={(newNetwork) => setNetwork(newNetwork)} />*/}
                {/*</Grid>*/}
                <Grid item xs={12}>
                    <h2>Restore Wallet</h2>
                    <div>
                        Enter your mnemonic words below. mnemonic must contain 12, 15, 18, 21 or 24 words
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <MnemonicView mnemonic={mnemonic} handleClick={handleRemoveElement}/>
                </Grid>
                {wordCount < 24 ? (
                    <Grid item xs={12}>
                        {/*You can use the `isOptionEqualToValue` prop to customize the equality test.*/}
                        <Autocomplete
                            // size='small'
                            autoHighlight={true}
                            autoSelect={true}
                            value={selected === "" ? null : {title: selected}}
                            inputValue={selected}
                            options={filteredWords.map(item => ({title: item}))}
                            getOptionLabel={(option) => option.title}
                            onChange={(event, value, reason) => {
                                if (value) {
                                    selectElement(value.title);
                                }
                            }}
                            limitTags={10}
                            renderInput={(params) => (
                                <>
                                    <FormControl fullWidth variant="outlined">
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Type mnemonic word"
                                            placeholder="Favorites"
                                            value={selected}
                                            onChange={({target}) => {
                                                setSelected(target.value);
                                            }}
                                            onKeyUp={(event) => {
                                                if (event.key === "Enter") {
                                                    selectElement(selected);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    {requiredWordCount > wordCount ? (
                                        <FormHelperText error id="accountId-error">
                                            {requiredWordCount - wordCount} words remaining
                                        </FormHelperText>
                                    ) : null}
                                </>
                            )}
                        />
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    {(!mnemonicValid && (wordCount >= 12 && wordCount % 3 === 0)) ? (
                        <FormHelperText error id="accountId-error">
                            Entered mnemonic is invalid. please check it again
                        </FormHelperText>
                    ) : null}
                </Grid>
                <InAdvancedMode>
                    <Grid item xs={12}>
                        <MnemonicPassword
                            valid={mnemonic_passphrase.valid}
                            password={mnemonic_passphrase.password}
                            confirm={true}
                            setPassword={(password, valid) => set_mnemonic_passphrase({password, valid})}/>
                    </Grid>
                </InAdvancedMode>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!mnemonicValid || wordCount < 12 || wordCount % 3 !== 0 || !mnemonic_passphrase.valid}
                        onClick={() => props.goForward(mnemonic, mnemonic_passphrase.password)}>
                        OK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Mnemonic;
