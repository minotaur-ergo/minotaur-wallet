
class RpcHandler {
    private port!: chrome.runtime.Port;

    constructor() {
        // this.port = chrome.runtime.connect();
    }

    start = () => {
        // if(!chrome.runtime){
        //     return
        // }
        // this.port = chrome.runtime.connect({name: "extension"})
        // this.port.onMessage.addListener((msg: string) => {
        //     alert(msg)
        // })
    }

}

const rpcHandler = new RpcHandler();
export default rpcHandler;