

export const addAddress = async (wallet, address, path, readonly=false) => {
  const addresses = JSON.parse(localStorage.getItem("address")) || {seq:0, addresses: []}
  const address_obj = {
    id: addresses.seq,
    wallet: wallet.id,
    readonly: readonly,
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
