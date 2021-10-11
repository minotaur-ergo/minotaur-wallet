import axios from "axios"
import JSONBigIntgInt from "json-bigint"
// import * as wasm from 'ergo-lib-wasm-browser'

export const JSONBigInt = JSONBigIntgInt({useNativeBigInt: true})

export class Explorer {
    backend;

    constructor(uri) {
        this.backend = axios.create({
            baseURL: uri,
            timeout: 5000,
            headers: {"Content-Type": "application/json"}
        })
    }
    //
    // getTx = async id => {
    //     return this.backend.request({
    //         url: `/api/v1/transactions/${id}`,
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => res.data)
    // }
    //
    // getOutput = async id => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/${id}`,
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBox.from_json(res.data))
    // }

    getTxsByAddress = async (address, offset, limit) => {
      console.log(`start for address ${address}`)
        return this.backend.request({
            url: `/api/v1/addresses/${address}/transactions`,
            params: {offset: offset, limit: limit},
            transformResponse: data => JSONBigInt.parse(data)
        }).then(res => {
          console.log("getting data contains ", JSON.stringify(res.data));
          return res.data.items
        })
    }
    //
    // getUTxsByAddress = async (address, offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/mempool/transactions/byAddress/${address}`,
    //         params: {offset: offset, limit: limit},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => res.data)
    // }
    //
    // getUnspentByErgoTree = async (tree, offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/unspent/byErgoTree/${tree}`,
    //         params: {offset: offset, limit: limit},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data.items))
    // }
    //
    // getUnspentByAddress = async (address, offset, limit) => {
    //     return await this.getUnspentByErgoTree(wasm.Address.from_base58(address).to_ergo_tree().to_base16_bytes(), offset, limit)
    // }
    //
    // getUnspentByErgoTreeTemplate = async (templateHash, offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/unspent/byErgoTreeTemplateHash/${templateHash}`,
    //         params: {offset: offset, limit: limit},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data))
    // }
    //
    // getUnspentByTokenId = async (tokenId, offset, limit, sort = null) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/unspent/byTokenId/${tokenId}`,
    //         params: {offset: offset, limit: limit, sortDirection: sort || "asc"},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data))
    // }
    //
    // getByTokenId = async (tokenId, offset, limit, sort = null) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/byTokenId/${tokenId}`,
    //         params: {offset: offset, limit: limit, sortDirection: sort || "asc"},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data))
    // }
    //
    // getUnspentByErgoTreeTemplateHash = async (hash, offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/unspent/byErgoTreeTemplateHash/${hash}`,
    //         params: {offset: offset, limit: limit},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data))
    // }
    //
    // searchUnspentBoxes = async (ergoTreeTemplateHash, assets, offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/unspent/search`,
    //         params: {offset: offset, limit: limit},
    //         method: "POST",
    //         data: {ergoTreeTemplateHash: ergoTreeTemplateHash, assets: assets},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data))
    // }
    //
    // searchUnspentBoxesByTokensUnion = async (ergoTreeTemplateHash, assets, offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/boxes/unspent/search/union`,
    //         params: {offset: offset, limit: limit},
    //         method: "POST",
    //         data: {ergoTreeTemplateHash: ergoTreeTemplateHash, assets: assets},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => wasm.ErgoBoxes.from_boxes_json(res.data))
    // }
    //
    getFullTokenInfo = async (tokenId) => {
        return this.backend.request({
            url: `/api/v1/tokens/${tokenId}`,
            transformResponse: data => JSONBigInt.parse(data)
        }).then(res => (res.status !== 404 ? res.data : undefined))
    }
    //
    // getTokens = async (offset, limit) => {
    //     return this.backend.request({
    //         url: `/api/v1/tokens`,
    //         params: {offset: offset, limit: limit},
    //         transformResponse: data => JSONBigInt.parse(data)
    //     }).then(res => res.data)
    // }
    //
    // getNetworkContext = async () => {
    //     return this.backend.request({
    //         url: `/api/v1/epochs/params`
    //     }).then(res => res.data)
    // }
}

export default Explorer
