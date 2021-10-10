

export const addAddress = async (wallet, address, path, readonly=false) => {
  const addresses = JSON.parse(localStorage.getItem("address")) || {seq:0, addresses: []}
  const address_obj = {
    id: addresses.seq,
    wallet: wallet.id,
    readonly: readonly,
    address: address,
    erg: 0,
    nano_erg: 0,
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
