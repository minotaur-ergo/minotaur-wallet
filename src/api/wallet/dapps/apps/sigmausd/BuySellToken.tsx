import React, { useEffect, useState } from "react";
import { Button, FormControl, FormHelperText, TextField } from "@material-ui/core";
import Bank from "./Bank";
import Oracle from "./Oracle";
import { format_usd } from "./utils";

interface PropsType {
    bank: Bank;
    oracle: Oracle;
    buy: (amount: bigint) => any;
    token_type: "USD" | "RSV";
    operation: "BUY" | "SELL";
    max: bigint;
}

const BuySellToken = (props: PropsType) => {
    const [blurred, setBlurred] = useState(false);
    const [amount, setAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState<bigint>(BigInt(0));
    useEffect(() => {
        let max_amount = BigInt(0);
        if (props.operation === "BUY") {
            if (props.token_type === "USD") {
                max_amount = props.bank.num_able_to_mint_stable_coin();
            } else {
                max_amount = props.bank.num_able_to_mint_reserve_coin();
            }
        } else {
            if (props.token_type === "RSV") {
                max_amount = props.bank.num_able_to_redeem_reserve_coin();
            } else {
                max_amount = props.bank.num_circulating_stable_coins();
            }
        }
        setMaxAmount(max_amount);
    }, [props.bank, props.operation, props.token_type]);
    // error is invalid number or amount > max_usd_to_buy
    let error = "";
    if (isNaN(Number(amount))) {
        error = "Invalid Number Entered";
    }
    const amount_parts = amount.split(".");
    const decimal_part = amount_parts.length <= 1 ? "00" : amount_parts[1].padStart(2, "0");
    const amount_bigint = BigInt(amount_parts[0]) * BigInt(100) + BigInt(decimal_part);
    if (decimal_part.length > 2) {
        error = "SigmaUSD have 2 decimal point";
    } else if (amount_bigint > maxAmount) {
        error = `Unable to mint more than ${format_usd(maxAmount)} Sigma${props.token_type} based on the current reserve status`;
    } else if (amount_bigint > props.max && props.operation === "SELL") {
        error = `There are only ${props.max} Sigma${props.token_type} available in your wallet`;
    }
    const maxRedeem = props.operation === "BUY" ? maxAmount : maxAmount > props.max ? props.max : maxAmount;
    return (
        <React.Fragment>
            <FormControl fullWidth variant="outlined">
                <TextField
                    variant="outlined"
                    size="small"
                    label="Amount"
                    error={error !== "" && blurred}
                    onBlur={() => setBlurred(true)}
                    type={"text"}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    autoComplete="off"
                />
            </FormControl>
            <FormHelperText>Maximum
                Available: {props.token_type === "USD" ? format_usd(maxRedeem) : maxRedeem.toString()}</FormHelperText>
            {
                blurred ? (
                    <FormHelperText error id="accountId-error">
                        {error}
                    </FormHelperText>
                ) : null
            }
            <Button
                fullWidth
                disabled={error !== "" || amount_bigint === BigInt(0)}
                variant="contained"
                color="primary"
                onClick={() => props.buy(BigInt(amount_bigint))}>
                {props.operation}
            </Button>
        </React.Fragment>
    );
};


export default BuySellToken;
