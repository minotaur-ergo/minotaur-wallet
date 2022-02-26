import React from "react";
import { DAppPropsType } from "../../../../../utils/interface";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import * as wasm from "ergo-lib-wasm-browser";
import Bank from "./Bank";
import * as parameters from "./parameters";
import { show_notification } from "../../../../../utils/utils";
import Oracle from "./Oracle";
import { ErgoBoxAssetsDataList } from "ergo-lib-wasm-browser";
import Boxes from "./Boxes";
import * as utils from "./utils";
import BuySellToken from "./BuySellToken";
import { Accordion, AccordionDetails, AccordionSummary } from "./CustomAccordion";


interface StateType {
    bank?: Bank;
    oracle?: Oracle;
    loading: boolean;
    page: string;
    last_update_height: number;
    total_reserve_tokens: bigint;
    total_stable_tokens: bigint;
}

class SigmaUSD extends React.Component<DAppPropsType, StateType> {
    state: StateType = {
        loading: false,
        page: "usd",
        last_update_height: 0,
        total_stable_tokens: BigInt(0),
        total_reserve_tokens: BigInt(0),
    };

    getCoveringBox = async (amount: bigint, bank: Bank, token?: string, token_amount?: bigint) => {
        const tokens = (token && token_amount) ? [{ id: token, amount: token_amount }] : [];
        const boxes = await this.props.getCoveringForErgAndToken(amount, tokens);
        if (!boxes.covered) {
            show_notification("Not enough erg or tokens to process");
            return undefined;
        }
        let total_input_ergs: bigint = BigInt(0);
        let recipient_tokens: { [id: string]: bigint } = {};
        const inputs = new wasm.ErgoBoxes(bank.get_box());
        Array(boxes.boxes.len()).fill("").forEach((item, index) => {
            const box = boxes.boxes.get(index);
            inputs.add(box);
            total_input_ergs += BigInt(box.value().as_i64().to_str());
            Array(box.tokens().len()).fill("").forEach((token_item, token_index) => {
                const token = box.tokens().get(token_index);
                const token_id = token.id().to_str();
                if (!recipient_tokens.hasOwnProperty(token_id)) {
                    recipient_tokens[token_id] = BigInt(0);
                }
                recipient_tokens[token_id] += BigInt(token.amount().as_i64().to_str());
            });
        });
        return {
            boxes: inputs,
            erg_in_box: total_input_ergs,
            tokens: recipient_tokens
        };
    };

    update_boxes = async () => {
        const explorer = this.props.network_type.getExplorer();
        const bankBoxes = await explorer.getUnspentBoxByTokenId(Bank.NFT_TOKEN_ID);
        const oracleBoxes = await explorer.getUnspentBoxByTokenId(Oracle.TOKEN_ID);
        const oracle = new Oracle(await explorer.trackMemPool(oracleBoxes.items[0]));
        const bank = new Bank(await explorer.trackMemPool(bankBoxes.items[0]), oracle);
        this.setState({
            bank: bank,
            oracle: oracle,
            loading: false
        });
    };

    update_test_boxes = () => {
        const oracle = new Oracle(wasm.ErgoBox.from_json(parameters.oracle_json));
        const bank = new Bank(wasm.ErgoBox.from_json(parameters.bank_json), oracle);
        this.setState({
            bank: bank,
            oracle: oracle,
            loading: false
        });
    };

    get_params = async () => {
        const addresses = await this.props.getAddresses();
        return {
            user_address: wasm.Address.from_base58(addresses[0]),
            bank: this.state.bank!,
            oracle: this.state.oracle!,
            height: await this.props.network_type.getNode().getHeight()
        };
    };

    create_tx = async (
        implementor_fee: bigint,
        height: number,
        recipient: wasm.ErgoBoxCandidate,
        bank_out: wasm.ErgoBoxCandidate,
        boxes: wasm.ErgoBoxes,
        user_address: wasm.Address,
        oracle: wasm.ErgoBox
    ) => {
        const implementor = Boxes.implementor_box(implementor_fee, height);
        const outputs = new wasm.ErgoBoxCandidates(bank_out);
        outputs.add(recipient);
        outputs.add(implementor);
        const tx_builder = wasm.TxBuilder.new(
            new wasm.BoxSelection(boxes, new ErgoBoxAssetsDataList()),
            outputs,
            height,
            wasm.BoxValue.from_i64(wasm.I64.from_str(parameters.MINT_TX_FEE.toString())),
            user_address,
            wasm.BoxValue.SAFE_USER_MIN()
        );
        const data_inputs = new wasm.DataInputs();
        data_inputs.add(new wasm.DataInput(oracle.box_id()));
        tx_builder.set_data_inputs(data_inputs);
        this.props.signAndSendTx({
            tx: tx_builder.build(),
            boxes: boxes,
            data_inputs: new wasm.ErgoBoxes(oracle)
        }).then(() => null);

    };

    sell_token_tx = async (token_type: "stable" | "reserve", amount: bigint) => {
        if (!this.state.bank || !this.state.oracle) {
            show_notification("please wait to sync with blockchain");
        }
        const { user_address, height, bank, oracle } = await this.get_params();
        const base_getting_erg = token_type === "stable" ? bank.base_amount_from_redeeming_stable_coin(amount) : bank.base_amount_from_redeeming_reserve_coin(amount);
        const implementor_fee = parameters.IMPLEMENTOR_FEE(base_getting_erg);
        const total_income_erg = base_getting_erg - implementor_fee - parameters.MINT_TX_FEE;
        const sell_token = bank.get_box().tokens().get(token_type === "stable" ? 0 : 1).id().to_str();
        const covering = await this.getCoveringBox(parameters.MIN_BOX_VALUE, bank, sell_token, amount);
        if (covering) {
            const bank_out = bank.create_candidate(
                height,
                token_type === "stable" ? -amount : BigInt(0),
                token_type === "stable" ? BigInt(0) : -amount
            );
            const tokens = covering.tokens;
            tokens[sell_token] = tokens[sell_token] - amount;
            const recipient = await Boxes.recipient_box(
                covering.erg_in_box + total_income_erg,
                -amount,
                -base_getting_erg,
                user_address,
                height,
                tokens
            );
            this.create_tx(
                implementor_fee,
                height,
                recipient,
                bank_out,
                covering.boxes,
                user_address,
                oracle.get_box()
            ).then(() => null);
        }
    };

    buy_token_tx = async (token_type: "stable" | "reserve", amount: bigint) => {
        if (!this.state.bank || !this.state.oracle) {
            show_notification("please wait to sync with blockchain");
        }
        const { user_address, height, bank, oracle } = await this.get_params();
        const base_required_erg = token_type === "stable" ? bank.base_cost_to_mint_stable_coin(amount) : bank.base_cost_to_mint_reserve_coin(amount);
        const implementor_fee = parameters.IMPLEMENTOR_FEE(base_required_erg);
        const total_process_ergs = implementor_fee + base_required_erg + parameters.MINT_TX_FEE;
        const covering = await this.getCoveringBox(
            total_process_ergs + parameters.MIN_BOX_VALUE,
            bank
        );
        if (covering) {
            const bank_out = bank.create_candidate(
                height,
                token_type === "stable" ? amount : BigInt(0),
                token_type === "stable" ? BigInt(0) : amount
            );
            const tokens = covering.tokens;
            const buy_token = bank.get_box().tokens().get(token_type === "stable" ? 0 : 1).id().to_str();
            tokens[buy_token] = amount + (tokens.hasOwnProperty(buy_token) ? tokens[buy_token] : BigInt(0));
            const recipient = await Boxes.recipient_box(
                covering.erg_in_box - total_process_ergs,
                amount,
                base_required_erg,
                user_address,
                height,
                tokens
            );
            this.create_tx(
                implementor_fee,
                height,
                recipient,
                bank_out,
                covering.boxes,
                user_address,
                oracle.get_box()
            ).then(() => null);
        }
    };

    buy_stable = (amount: bigint) => {
        this.buy_token_tx("stable", amount).then(() => null).catch(err => show_notification(err));
    };

    sell_stable = (amount: bigint) => {
        this.sell_token_tx("stable", amount).then(() => null).catch(err => show_notification(err));
    };

    buy_reserve = (amount: bigint) => {
        this.buy_token_tx("reserve", amount).then(() => null).catch(err => show_notification(err));
    };

    sell_reserve = (amount: bigint) => {
        this.sell_token_tx("reserve", amount).then(() => null).catch(err => show_notification(err));
    };

    schedule_to_refresh = (time: "long" | "short") => {
        const timeout = time === "long" ? 2 * 60 * 1000 : 30 * 1000;
        setTimeout(() => this.setState({ loading: false }), timeout);
    };

    load_data = async () => {
        if (!this.state.loading) {
            this.setState({ loading: true });
            const height = await this.props.network_type.getNode().getHeight();
            if (height > this.state.last_update_height) {
                this.update_boxes().then(res => {
                    this.setState({
                        last_update_height: height
                    });
                    this.schedule_to_refresh("long");
                }).catch(err => {
                    this.schedule_to_refresh("short");
                });
            } else {
                this.schedule_to_refresh("long");
            }
        }
    };

    loadBoxes = (force: boolean = false) => {
        this.load_data().then(() => null);
        // if (!(this.state.bank && this.state.oracle && !force)) {
        //     this.update_test_boxes();
        // this.updateBoxes().then(() => null);
        // }
    };

    componentDidMount = () => {
        this.loadBoxes();
        this.props.getTokenAmount(Bank.STABLE_COIN_TOKEN_ID).then(stable_count => {
            this.props.getTokenAmount(Bank.RESERVE_COIN_TOKEN_ID).then(reserve_count => {
                this.setState({
                    total_stable_tokens: stable_count,
                    total_reserve_tokens: reserve_count
                })
            })
        })
    };

    componentDidUpdate = () => {
        this.loadBoxes();
    };

    loaded = () => this.state.bank?.get_box() && this.state.oracle?.get_box();

    get_price_usd = () => {
        if (this.state.bank?.get_box() && this.state.oracle?.get_box()) {
            const price = this.state.bank.stable_coin_nominal_price();
            const erg_price = BigInt(1e9) / price;
            return (erg_price / BigInt(100)).toString() + "." + (erg_price % BigInt(100)).toString().padStart(2, "");
        }
        return "?";
    };

    get_price_rsv = () => {
        if (this.state.bank?.get_box() && this.state.oracle?.get_box()) {
            const price = this.state.bank.reserve_coin_nominal_price();
            return (BigInt(1e9) / price).toString();
        }
        return "?";
    };

    open_accordion = (page: string) => {
        this.setState({ page: this.state.page === page ? "" : page });
    };

    loading = (center: boolean = false) => {
        if (center) {
            return (
                <div style={{ textAlign: "center", width: "100%" }}>
                    <CircularProgress size={60} />
                </div>
            );
        }
        return <CircularProgress size={30} style={{ marginBottom: "-10px" }} />;
    };

    render = () => {
        return (
            <div>
                <Accordion
                    square
                    expanded={this.state.page === "usd"}
                >
                    <AccordionSummary
                        aria-controls="panel1d-content"
                        onClick={() => this.open_accordion("usd")}
                        id="panel1d-header">
                        <div>1 ERG
                            ≈ {this.loaded() ? utils.format_usd(this.state.bank?.get_erg_usd()!) : this.loading()} SigmaUSD</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        {this.loaded() ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    Circulating
                                    Supply: {utils.format_usd(this.state.bank?.num_circulating_stable_coins()!)}
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.bank && this.state.oracle ? (
                                        <React.Fragment>
                                            <Typography style={{ marginTop: "10px", marginBottom: "10px" }}>Buy
                                                SigmaUSD</Typography>
                                            <BuySellToken bank={this.state.bank}
                                                          oracle={this.state.oracle}
                                                          buy={this.buy_stable}
                                                          token_type="USD"
                                                          max={BigInt(0)}
                                                          operation="BUY" />
                                            <Typography style={{ marginTop: "20px", marginBottom: "10px" }}>Sell
                                                SigmaUSD</Typography>
                                            <BuySellToken bank={this.state.bank}
                                                          oracle={this.state.oracle}
                                                          buy={this.sell_stable}
                                                          max={this.state.total_stable_tokens}
                                                          token_type="USD"
                                                          operation="SELL" />
                                        </React.Fragment>
                                    ) : null}
                                </Grid>
                            </Grid>
                        ) : this.loading(true)}
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    square
                    expanded={this.state.page === "rsv"}
                >
                    <AccordionSummary
                        aria-controls="panel1d-content"
                        id="panel1d-header"
                        onClick={() => this.open_accordion("rsv")}>
                        <div>1 ERG
                            ≈ {this.loaded() ? this.state.bank?.get_erg_rsv().toString() : this.loading()} SigmaRSV</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        {this.loaded() ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    Circulating
                                    Supply: {this.state.bank?.num_circulating_reserve_coins().toString()}
                                </Grid>
                                <Grid item xs={12}>
                                    {this.state.bank && this.state.oracle ? (
                                        <React.Fragment>
                                            <Typography style={{ marginTop: "10px", marginBottom: "10px" }}>Buy
                                                SigmaRSV</Typography>
                                            <BuySellToken bank={this.state.bank}
                                                          oracle={this.state.oracle}
                                                          max={BigInt(0)}
                                                          buy={this.buy_reserve}
                                                          token_type="RSV"
                                                          operation="BUY" />
                                            <Typography style={{ marginTop: "20px", marginBottom: "10px" }}>Sell
                                                SigmaRSV</Typography>
                                            <BuySellToken bank={this.state.bank}
                                                          oracle={this.state.oracle}
                                                          buy={this.sell_reserve}
                                                          max={this.state.total_reserve_tokens}
                                                          token_type="RSV"
                                                          operation="SELL" />
                                        </React.Fragment>
                                    ) : null}
                                </Grid>
                            </Grid>
                        ) : this.loading(true)}
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    };
}

export default SigmaUSD;
