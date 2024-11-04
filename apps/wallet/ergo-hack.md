# Signing Server for multi-sig communication


## Introduction

Minotaur is the first multi-signature wallet developed for ergo.
A multi-signature wallet, the so-called multi-sig wallet,
uses more than one private key to authorize transactions.
Such a wallet can be managed by a single user holding multiple private keys,
multiple users holding a single key each, or any combination of the two scenarios.
In a multi-sig wallet with M private keys, depending on its configurations,
any transaction may require N signatures, where 1<=N<=M.

Signing any multi-sig transaction on Ergo chain consists of two major steps that must be completed by any N signer(s) among the M key-holders:

* Generating required commitment(s) and sharing it/them with all other signers (N times)
* Signing the transaction using gathered commitments (N times)

In Minotaur, an N-sig transaction is performed as follows:

* The first signer, i.e., a key-holder who creates the transaction, generates his/her own commitment(s) and, including all other required data, sends it to a second signer.
* A second signer receives the transaction data, append his/her own commitment(s) to it, and sends it to a third signer.
* The process is repeated by all other signers, but the last one. 
* The last signer, receives commitments of all other signers. 
He/She generates his/her own commitment(s) and appends it to the transaction data, and finally signs the transaction. 
Then, the partially signed transaction is sent to another signer.
* Any middle signer signs the transaction and pass it to another one.
* The last one who adds the last signature to the transaction, publishes the fully-signed transaction.  

The process is error prune. In fact,
any human error in ***sending commitment(s)*** and ***using invalid commitment set*** 
results in an invalid, and thus incomplete, transaction. 
Such failures have been reported frequently.

In order to solve this problem, we introduce **The Minotaur Signing Server** 
which manages the signing process and ensures a valid and completed transaction.

## The Minotaur Signing Server

The Minotaur Signing Server (MSS) manages the steps of transaction signing.
The MMS provides a safe, reliable, secure, and error free channel
for data transition among signers. 
Therefor, it can guarantee that every signer receives and uses correct transaction data.


The workflow of the MMS is as follows:

* First, each of the wallet key-holders must generate an asymmetric key-pair for 
communication with the server. We refer these keys as the communication private and public keys.
The MSS expects every signer to sign his/her communication public key 
with his/her transaction-signing key in order to confirm the signer identity.
* The MSS needs the multi-sig wallet details, 
including the *extended public key* of each signer 
and also the number of required signatures. 
Any of the key-holders can provide the MSS with these data. 
It is only after the receiving of these data that 
the MSS allows for the processing of any transaction.

At this stage, the multi-sig wallet setup is completed and 
any number of transactions can be started.
A new transaction is started as follows:

* The person who creates the transaction sends it to the MSS.
From now on, each of the wallet holders will see the transaction 
on their multi-sig communication page of their connected Minotaur.
The representation of data in the page has not been altered by the introduction of MSS, 
and the user may not sense any UI change.

* Any of the signers can select the desired transaction
and generate their commitment(s) for it.
By doing so, the private part of the commitment(s) is stored in Minotaur,
and its public part is sent to the MSS.

* Anyone who receives the transaction,
also receives all previous public commitments. 
He/She can add his/her own commitment(s) as described above.

* As soon as the server receives all N commitments, 
the transaction is automatically sent for being signed.
In case any *simulated* signatures are required, they are 
created by the MSS.
Moreover, any commitments that arrives after this point, is rejected.  

* At this stage, anyone who committed the transaction can sign it and send
his/her signature to the MSS.

* As soon as all N signatures arrive at the MSS, 
it automatically completes the transaction and sends it on the blockchain.
