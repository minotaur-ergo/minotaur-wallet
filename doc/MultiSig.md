
# Multi-Signature Wallet

* Author: lazypinkpatrick
* Status: Completed
* Created: 29-May-2022
* License: MIT

## Introduction

Minotaur wallet is a multi-platform wallet developed by *minotaur-ergo* using TypeScript.
In this project, the wallet is extended in order to support multiple signature.
A multi-signature wallet, the so-called *multi-sig* wallet, uses more than one private key to authorize transactions.
Such a wallet can be managed by a single user holding multiple private keys,
multiple users holding a single key each, or any combination of the two scenarios.
In a multi-sig wallet with *M* private keys, depending on its configurations,
any transaction may require *N* signatures, where *1<=N<=M*.

The project accomplishments are as follows:

* The end user(s):
  - can easily create a multi-signature wallet,
  - can see their wallet balance,
  - can sign their transactions in the wallet.
* The software provides an automatic transfer method that
  safely processes all signatures and communications between private-key holders.

## Explanation

In Ergo blockchain, a transaction is prepared in two steps before being submitted to the
transaction pool:

* required commitments are generated
* the transaction is signed using the commitments

These steps are performed automatically and transparently (hidden from the user) in any wallet.
However, signing a multi-sig transaction involves more sophisticated steps,
as explained in [EIP 11](https://github.com/ergoplatform/eips/pull/8).
In other words, the above-mentioned steps cannot be performed transparently, since the commitments and
signatures must be shared between all signers.

The procedure can be explained more clearly using the following example:
Consider a 3-out-of-4 wallet. Let us name the 4 private-key holders as Alice, Bob, Carol, and Dani.
The wallet has been configured so that a transaction must be signed by at least 3 signers.
Suppose that Alice, Bob, and Carol agree to sign a transaction.
In order to do so, Alice creates an unsigned transaction and generates her own commitment.
Then, she sends the transaction and the public part of her commitment to Bob.
Bob generates his commitment and appends its public parts to Alice's commitment.
Then, He forwards the transaction and the two-part commitment to Carol.
Carol generates her commitment. At this step, all 3 required commitments are available.
Therefore, Carol adds her signature to the transaction and sends it back to Bob.
Similarly, Bob also adds his signature to the transaction and forwards it to Alice.
Finally, Alice completes the transaction signing by adding her signature to it.
Now she can submit the signed transaction to the transaction pool.
Our multi-sig wallet facilitates the whole process in a user-friendly manner.

## Design Details
### Wallet Creation
Implementation of this project introduces a new type of wallet, the so-called multi-sig wallet, to the Minotaur wallet.
In order to create a new functional multi-sig wallet,
each signer must configure a copy of it on his/her own device, by applying the following 4 steps:

* A proper name is entered for the personal copy of the multi-sig wallet.
  Names entered by different signers do not have to be the same.
* The total number of signers, *M*, and also the number of required signs, *N*, are entered.
  *M* can be maximally 20. All signers must enter same values for these two numbers.
* Each signer must enter his/her own private key,
  and also the public key of all other signers in the multi-sig wallet.
  For convenience, it is supposed that each signer has already a normal wallet in Minotaur,
  so that his/her own public/private key can be retrieved through it.
  For all other signers, either of the following solutions may be applied:
  - Their extended public keys are entered.
    In this case, it is possible for signers to derive the address of the multi-sig wallet.
  - Their addresses are entered.
    In this case, it is **not** possible for signers to derive the address of the multi-sig wallet.
* The address of the multi-sig wallet is displayed to each signer.
  The signer's copy of the multi-sig wallet is created as soon as he/she approves the address.

### Wallet Display Parts.
Since the implementation is based on a standard wallet,
the following functionalities of the underlying standard wallet already work in the multi-sig wallet too:

* Extracting fund information from the Ergo blockchain
* Displaying transaction history
* Creating unsigned transaction
* Displaying addresses
* Displaying assets
* Connecting to dApps

However, two principal parts must be implemented: the address derivation and the "sign transaction" modal.
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
In order to prevent this, the list of signers'
addresses is always sorted before being used in the contract.

Second, the Sigma-rust library cannot compile any contract.
One might think of Node as a solution, but it does not fulfill the project criteria, since it disables cold signing.
Our solution to this problem is to manually create the required ergiTree array as follows:

* The first byte in the array has value 10.
* The number of constant values in the contract.
  This number equals *M+1*, and is encoded as a variable-length quantity (VLQ).
* The number of required signs, *N*.
  This number starts by a byte with value 04 that denotes the integer type,
  and followed by the value of *N* encoded as a VLQ.
* For each public key (*M* times), 35 bytes are used: 2 bytes with value 08cd, followed by 33 bytes representing the public key
* A byte with value 98, indicating "atLeast"
* Two bytes, with values 73 and 00, respectively.
  The value 00 indicates the VLQ representation of the index of value *N* in the list of constants.
* A constant byte with value 83, followed by the VLQ representation of *M*, and a constant byte with value 08
* For each public key (*M* times), a byte with vale 73,
  followed by the VLQ representation of the index of the public key in the list of constants

#### "Sign transaction" modal
After an unsigned transaction is created, Minotaur wallet
displays a modal so that the user can confirm his/her password and sign the transaction.
Similarly, the same modal is displayed for a multi-sig wallet too.
When a user enters his/her password into the modal, a commitment is generated,
whose private part is stored locally, and then the following information is displayed in the form of a JSON string:
```
MCR-{
  "tx": <reduced transaction bytes>,
  "boxes": [<encoded boxes>],
  "commitments": <commitments encoded>
} 
```
A user must share this string to other wallets through any kind of communication.
For convenience, a *copy to clipboard* button has been provided in the modal.
As soon as any other signer enters the JSON string into his/her wallet, the wallet displays information regarding the transaction.
The signer generates personal commitment by entering his/her password and approving the transaction.
The newly created commitment is merged to the received one and a new JSON string is presented.
This new sting must be passed to the next signer.
The process repeats until the last required signer generates his/her own commitment.
At this moment, the last signer signs the transaction and creates a JSON string containing the following information:
```
{
  "tx": <reduced transaction bytes>,
  "boxes": [<encoded boxes>],
  "commitments": <commitments encoded>,
  "simulated": [<list of simulated public keys for all inputs>]
  "signed": [<list of all signed public keys for all inputs + my own public keys for all inputs>]
  "partialTx": <partially signed tx proposition bytes>
}
```
Similar to the process of commitment generation,
every other signer must enter the received JSON string in his/her own wallet, sign the transaction, generate a new JSON string, and pass it to the next signer.
The last signer, after signing the transaction, can submit it to the blockchain.

## CoSigning Server
A server was designed and implemented in order to simplify communications between wallets.
The server can store data for any specific address.
Moreover, for any address, associated data stored on the server can be requested.
The server keeps data for 10 minutes only.

This server has two APIs:

* /put: Stores data on the server for any specific address:
  - We assume that each wallet uses the address derived from the path `m/44'/429'/0'/0/0`.
  - The JSON string passed to this API is something like the example below, where the `"type": <value>` pair is used to specify the data category:
```
{
    "sender": "me",
    "message": "",
    "type": "create",
    "receiver": ["user1", "user2"]
}
```
* /get: Gets a list of requested data for a specified address:
  - For a given triplet of (*ID*, *address*, *value*), this API gets, from the server, all messages with an ID greater than the given one, and returns data associated with the given *address* that would have a type of *value*.

In this implementation, we assume that a new transaction is highlighted with the `"type": "create"` pair,
while all sub messages are linked to their parent transaction using the transaction ID as their type value, i.e., `"type": <txId>`

Our implemented scenario for signing a transaction using this server is as follows:

* The first signer creates an unsigned transaction.
* If the user selects the "sign via cosigning server" option, he/she sends the following JSON string to all other signers in the multi-sig wallet:
```
{
  "type": "create",
  "tx": <reduced tx>
  "boxes": [<encoded boxes>]
}
```
* Other signers receive this JSON string and generate a party for it.
* The first signer also creates his/her commitment and sends the following JSON to all other party members:
```
{
  "type": "commitment",
  "commitments": [<my encoded commitment for all inputs>]
}
```
* Every other signer generates a commitment by entering his/her password.
  At the same time, entering the password by signer indicates to the wallet that he/she accepts the transaction and is willing to sign it.
* When the number of commitments reaches the required count,
  every wallet signs the transaction and sends it to all other signers in the following format:
```
{
  "type": "sign"
  "simulated": [<list of simulated public keys; this list was generated by the first signer and no one has changed it yet.>]
  "signed": [<list of signatures in this transaction; every one must append his/her public key to this list.>]
  "partial": <partially signed tx in the base64 format>.
}
```
* Every wallet, when receives a new partially-signed transaction, checks the number of signatures on it:
  - If the transaction has not already been signed by the wallet, it is signed and published
  - If the number of signatures on the received transaction is greater than that on the local copy, the local copy is replaced with the received one
  - If all commitment generators have already signed the transaction, the wallet submits it to the blockchain and the process is completed.



