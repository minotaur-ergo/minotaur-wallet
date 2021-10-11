

export const addAddress = async (wallet, address, name, path, readonly=false) => {
  const addresses = JSON.parse(localStorage.getItem("address")) || {seq:0, addresses: []}
  const address_obj = {
    id: addresses.seq,
    name: name,
    wallet: wallet,
    readonly: readonly,
    address: address,
    path: path
  }
  addresses.seq += 1;
  addresses.addresses.push(address_obj)
  localStorage.setItem("address", JSON.stringify(addresses))
}

export const getAddress = async wallet => {
  const addresses = JSON.parse(localStorage.getItem("address")) || {seq:0, addresses: []}
  return addresses.addresses.filter(item => item.wallet === wallet.id)
}


export const filterAddress = async address_id => {
  const addresses = JSON.parse(localStorage.getItem("address")) || {seq:0, addresses: []}
  const address = addresses.addresses.filter(item => "" + item.id === "" + address_id)
  if(address.length > 0) return address[0];
  return {};
}

export const getLastAddress = async wallet_id => {
  const addresses = JSON.parse(localStorage.getItem("address")) || {seq:0, addresses: []}
  const address = addresses.addresses.filter(item => "" + item.wallet === "" + wallet_id)
  if(address.length > 0){
    return Math.max(...address.map(item => parseInt(item.path)))
  }
  return -1
}
