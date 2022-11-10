# Multi-Signature Wallet

- Author: lazypinkpatrick
- Status: Completed
- Created: 29-May-2022
- License: MIT

## Introduction

Minotaur wallet is a multi-platform wallet developed by minotaur-ergo using typescript.
In this project, the wallet is extended in order to support multiple signature.
A multi-signature wallet, **_multi-sig_**, uses more than one private key to authorize transactions.
It can be managed by a single user with multiple private keys,
multiple users with a single key each, or any combination of the two cases.
In a multi-sig wallet with _M_ private keys, depending on its configurations,
any transaction requires _N_ signatures, where _1<=N<=M_.

The goals of this project are as follows:

- The end user(s)
  - can easily create a multi-signature wallet,
  - can see their wallet balance,
  - can sign their transactions in the wallet.
    +\* The software will provide an automatic transfer method that
    +safely processes all signatures and communications between private-key holders.

## Explanation

In Ergo blockchain, a transaction is prepared in two steps before being submitted to the
transaction pool:

- required commitments are generated
- the transaction is signed using the commitments

These steps are performed automatically and transparently (hidden from the user) in any wallet.
However, signing a multi-sig transaction involves more sophisticated steps,
as mentioned in [EIP 11](https://github.com/ergoplatform/eips/pull/8).
In other words, the above-mentioned steps cannot be performed transparently, since the commitments and
signatures must be shared between all signers.

The procedure can be explained more clearly using the following example:
Consider a 3-out-of-4 wallet. Let us name the 4 private-key holders as Alice, Bob, Carol, and Dani.
The wallet has been configured so that a transaction must be signed by at least 3 signer.
Suppose that Alice, Bob, and Carol agree to sign a transaction.
In order to do so, Alice creates an unsigned transaction and generates her own commitments.
Then, and sends the transaction and the public part of her commitments to Bob.
Bob generates his commitments and appends the public parts to Alice's commitments.
Then, He sends the transaction and the two-part commitments to Carol.
Carol generates her commitments. At this step, 3 required commitments are available.
Therefore, Carol adds her signature to the transaction and sends it back to Bob.
Similarly, Bob also adds his signature to the transaction and sends it back to Alice.
Finally, Alice completes the transaction signing by adding her signature to it.
Now she can submit the signed transaction to the transaction pool.
Our multi-sig wallet facilitates the whole process in a user-friendly manner.

## Design Details

### Wallet Creation

Implementation of this project introduces a new type of wallet, so-called multi-sig, to the Minotaur-wallet.
In order to create a new functional multi-sig wallet,
each of signers must configure a copy of it on their own device, by applying the following 4 steps:

- A proper name is entered for the personal copy of the multi-sig wallet.
  This name is arbitrary for each user.
- The total number of signers, _M_, and also the number of required signs, _N_, are entered.
  _M_ can be maximally 20. All signers must enter same values for these numbers.
- Each signer must enter their own private key,
  and also the public key of all other signers in the multi-sig wallet.
  For convenience, it is supposed that each signer has already a normal wallet in Minotaur,
  so that their public/private key can be retrieved through it.
  For all other signers, either of the following solutions may be applied:
  - Their extended public keys are entered.
    +In this case, the derivation of the address of the multi-sig wallet is possible for signers.
  - Their addresses are entered.
    +In this case, the derivation of the address of the multi-sig wallet is **not** possible for signers.
    +\* The address of the multi-sig wallet is displayed to the signer.
    +The signer's copy of the multi-sig wallet is created as soon as they approve the address.

### Wallet Display Parts.

Since the implementation is based on a standard wallet,
the following parts of the multi-sig wallet are already functioning:

- Extracting fund information from the Ergo blockchain
- Displaying transaction history
- Creating unsigned transaction
- Displaying addresses
- Displaying assets
- Connecting to dApps

However, two principal parts must be implemented: address derivation and "sign transaction" modal.

#### Address Derivation

When deriving new addresses, two important facts must be taken into account.
First, in order to guarantee a unique address for the multi-sig wallet to be derived on
all signer copies, a unique address-derivation algorithm must be applied everywhere.
The applied algorithm is as follows:
For a specified path, using each signer's extended public key, an address is derived for that signer.
The list of derived addresses for all signers is used to compile a multi-sig contract like:

```
atLeast(
  N,
  Coll(
    PK(Address1),
    PK(Address2),
    .
    .
    .
    PK(AddressM)
  )
)
```

The above-mentioned contract results in distinguishable (different)
addresses when two signer addresses swap.
In order to prevent this problem, the list of signers'
addresses is always sorted before being used in the contract.

Second, the Sigma-rust library cannot compile contracts.
One solution to this problem is to use Node, which disables cold signing.
Our solution to this problem is to manually create the required ergiTree array as follows:

- The first byte in the array has value 10.
- The number of constant values in the contract encoded into the variable-length quantity (VLQ).
  This number equals _M+1_.
- The number of required signs, _N_.
  This number starts by a byte with value 04 that denotes the integer type,
  and followed by the value of _N_ encoded into VLQ.
- For each public key 35 bytes are used: 2 bytes with value 08cd, followed by 33 bytes representing the public key
- A byte with value 98, indicating "atLeast"
- Two bytes, with values 73 and 00, respectively.
  The value 00 indicates the VLQ-encoded index of value _N_ in the list of constants.
- A constant byte with value 83, the VLQ-encoded value of _M_, and constant byte with value 08
- For each public key (_M_ times), a byte with vale 73,
  followed by the VLQ-encoded value of the index of the public key in the list of constants

#### Sign transaction modal

After an unsigned transaction is generated, Minotaur wallet
displays a modal so that the user can confirm their password and sign the transaction.
Similarly, the same modal is displayed for a multi-sig wallet too.
When user enters their password into the modal, a commitment is generated,
whose private part is stored locally and then the following information is displayed in a QRCode.

```
MCR-{
  tx:<reduced transaction bytes>,
  boxes:[encoded boxes],
  commitment: commitments encoded
}
```

This code can be split into multiple chunks and displayed in multiple pages
similar to the encoding used in Cold Signing [EIP19](https://github.com/ergoplatform/eips/blob/master/eip-0019.md).
When any other signer scans the QRCode, their wallet can display transaction information.
The signer generates their own commitment by entering their password and approving the transaction.
The newly created commitment is merged to the received commitment and a new QRCode is displayed.
The new QRCode can be scanned by the next signer.
The process repeats until the last required signer generates their own commitment,
signs the transaction, and create a QRCode containing the following information:

```
{
  txId: txId,
  commitments: commitments encoded,
  propositionBytes: tx proposition bytes
}
```

Similar to the process of commitment generation,
every other signer must scan a QRCode in their own wallet, sign the transaction, and generate a new QRCode.
The last signer can submit the transaction to the blockchain.
