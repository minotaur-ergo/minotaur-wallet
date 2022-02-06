import { getConnection, IsNull } from "typeorm";
import Box from "../entities/Box";
import { ErgoBox } from "../../network/models";
import Address from "../entities/Address";
import Tx from "../entities/Tx";
import { JsonBI } from "../../config/json";
import * as wasm from "ergo-lib-wasm-browser";
import { CoveringResult } from "../../utils/interface";

const getBoxRepository = () => getConnection().getRepository(Box);

const createOrUpdateBox = async (box: ErgoBox, address: Address, tx: Tx, index: number) => {
    const dbEntity = await getBoxByBoxId(box.boxId, address.network_type);
    const erg_total = BigInt(box.value);
    const entity = {
        address: address,
        tx: tx,
        box_id: box.boxId,
        erg: erg_total,
        create_index: index,
        network_type: address.network_type,
        json: JsonBI.stringify(box),
        create_height: tx.height
    };
    if (dbEntity) {
        await getBoxRepository().createQueryBuilder().update().set(entity).where("id=:id", { id: dbEntity.id }).execute();
    } else {
        await getBoxRepository().insert(entity);
    }
    return await getBoxByBoxId(box.boxId, address.network_type);
};

const spentBox = async (boxId: string, spendTx: Tx, index: number) => {
    const dbEntity = await getBoxByBoxId(boxId, spendTx.network_type);
    if (dbEntity) {
        dbEntity.spend_tx = spendTx;
        dbEntity.spend_index = index;
        dbEntity.spend_height = spendTx.height;
        return await getBoxRepository().createQueryBuilder().update().set(
            { spend_tx: spendTx, spend_index: index, spend_height: spendTx.height }
        ).where("id=:id", { id: dbEntity.id }).execute();
    }
    return null;
};

const getBoxByBoxId = async (boxId: string, network_type: string) => {
    return await getBoxRepository().findOne({ box_id: boxId, network_type: network_type });
};

const getWalletBoxes = async (walletId: number) => {
    return await getBoxRepository().createQueryBuilder()
        .innerJoin("address", "Address", "Address.id = addressId")
        .where("walletId = :walletId AND spendTxId IS NULL", { walletId: walletId })
        .getMany();
};

const getAddressBoxes = async (address: Address) => {
    return await getBoxRepository().find({ address: address, spend_tx: IsNull() });
};

const getCoveringBoxFor = async (amount: bigint, walletId: number, tokens: { [id: string]: bigint }, address?: Address | null): Promise<CoveringResult> => {
    const requiredTokens: { [id: string]: bigint } = { ...tokens };
    let requiredAmount: bigint = amount;
    let selectedBoxesJson: Array<string> = [];
    const checkIsRequired = (box: wasm.ErgoBox) => {
        if (requiredAmount > 0) return true;
        for (let index = 0; index < box.tokens().len(); index++) {
            const token = box.tokens().get(index);
            const requiredAmount = requiredTokens[token.id().to_str()];
            if (requiredAmount && requiredAmount > BigInt(0)) {
                return true;
            }
        }
        return false;
    };
    const addBox = (box: wasm.ErgoBox) => {
        selectedBoxesJson.push(box.to_json());
        requiredAmount -= BigInt(box.value().as_i64().to_str());
        for (let index = 0; index < box.tokens().len(); index++) {
            const token = box.tokens().get(index);
            if (requiredTokens.hasOwnProperty(token.id().to_str())) {
                requiredTokens[token.id().to_str()] -= BigInt(token.amount().as_i64().to_str());
            }
        }
    };
    const remaining = () => requiredAmount > BigInt(0) || (Object.keys(requiredTokens).filter(token => requiredTokens[token] > 0).length > 0);
    const boxes = await (address ? getAddressBoxes(address as Address) : getWalletBoxes(walletId));
    for (let boxObject of boxes) {
        const box = wasm.ErgoBox.from_json(boxObject.json);
        if (checkIsRequired(box)) {
            addBox(box);
        }
        if (!remaining()) {
            return {
                covered: true,
                boxes: wasm.ErgoBoxes.from_boxes_json(selectedBoxesJson)
            };
        }
    }
    return {
        covered: false,
        boxes: wasm.ErgoBoxes.from_boxes_json(selectedBoxesJson)
    };
};

const forkBoxes = async (height: number, network_type: string) => {
    await getBoxRepository()
        .createQueryBuilder()
        .update()
        .set({ spend_tx: null, spend_index: undefined, spend_height: undefined })
        .where("create_height >= :height", { height: height })
        .execute();
    // await forkBoxContents(address.id, height);
    await getBoxRepository()
        .createQueryBuilder()
        .where("create_height >= :height", { height: height })
        .andWhere("network_type = :network_type", { network_type: network_type })
        .delete()
        .execute();
};

export {
    createOrUpdateBox,
    getBoxByBoxId,
    spentBox,
    getWalletBoxes,
    getAddressBoxes,
    getCoveringBoxFor,
    forkBoxes,
    getBoxRepository
};
