import axios from 'axios';
import { CO_SIGNING_SERVER_ADDRESS } from '../util/const';

type MessageBody = {
    id: number;
    message: string;
    sender: string;
}

export class CoSigningCommunication {
    lastId: number;
    address: string;

    constructor(address: string) {
        this.lastId = 0
        this.address = address
    }

    fetchMessage = (type: string): Promise<Array<MessageBody>> => {
        const url = `${CO_SIGNING_SERVER_ADDRESS}get?user=${this.address}&id=${this.lastId}&type=${type}`
        return axios.get<Array<MessageBody>>(url).then(res => {
            if(res.data.length) {
                this.lastId = Math.max(...res.data.map(item => item.id))
            }
            return res.data
        })
    }

    putMessage = (type: string, message: string, receivers: Array<string>) => {
        return axios.post(`${CO_SIGNING_SERVER_ADDRESS}put`, {
            sender: this.address,
            message: message,
            type: type,
            receiver: receivers
        })
    }
}

