import algosdk from "algosdk";

const accountInformation = async function (addr) {
  try {
    console.log("Creando cliente de Algoskd ...");
    const algodToken =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const algodServer = "http://localhost";
    const algodPort = 4001;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    console.log("Obteniendo información de la cuenta ...");
    let accountInfo = await algodClient.accountInformation(addr).do();
    return accountInfo;
  } catch (err) {
    console.log("err", err);
  }
};

const createAccount = function () {
  try {
    console.log("Creando cuenta...");
    const myAccount = algosdk.generateAccount();
    console.log("Address: " + myAccount.addr);
    let accountMnemonic = algosdk.secretKeyToMnemonic(myAccount.sk);
    console.log("Mnemonic: " + accountMnemonic);
    console.log("Fondea la cuenta: ");
    console.log("https://dispenser.testnet.aws.algodev.network/ ");
    return {
      addr: myAccount.addr,
      sk: myAccount.sk,
      mnemonic: accountMnemonic,
    };
  } catch (err) {
    console.log("err", err);
  }
};

const firstTransaction = async (addr, sk) => {
  try {
    // Conectar cliente algoSDK
    const algodToken =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const algodServer = "http://localhost";
    const algodPort = 4001;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    // Checkear balance
    let accountInfo = await algodClient.accountInformation(addr).do();
    console.log("Balance actual", accountInfo.amount);

    // Construir el objeto transaction
    let params = await algodClient.getTransactionParams().do();

    // El 'receiver' será la address de algo donde devolveremos los algos que nos prestaron
    const receiver =
      "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
    const enc = new TextEncoder();
    const note = enc.encode("Hello World");
    let amount = 1000000;
    let sender = addr;
    let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: receiver,
      amount: amount,
      note: note,
      suggestedParams: params,
    });

    // Firmamos la transacción
    let signedTxn = txn.signTxn(sk);
    let txId = txn.txID().toString();
    console.log("txID: %s", txId);

    // Enviamos la transacción
    await algodClient.sendRawTransaction(signedTxn).do();

    // Esperamos la confirmación
    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
    //Get the completed Transaction
    console.log(
      "Transacción " +
        txId +
        " confirmada en el round " +
        confirmedTxn["confirmed-round"]
    );
    let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
    console.log("Nota: ", string);
    accountInfo = await algodClient.accountInformation(addr).do();
    console.log(
      "Monto de la transacción: %d microAlgos",
      confirmedTxn.txn.txn.amt
    );
    console.log("Fee: %d microAlgos", confirmedTxn.txn.txn.fee);

    console.log("Balance de la cuenta: %d microAlgos", accountInfo.amount);

    return;
  } catch (err) {
    console.log("err", err);
  }
};

const createNFT = (addr, nftUrl) => {
  try {
    const creator = addr;
    const defaultFrozen = false;
    const unitName = addr.slice(1, 3) + "NFT";
    const assetName = addr.slice(1, 3) + " Artwork@arc3";
    const url = nftUrl;
    const managerAddr = undefined;
    const reserveAddr = undefined;
    const freezeAddr = undefined;
    const clawbackAddr = undefined;
    const total = 1; // los tokens no fungibles suelen tener un total de 1
    const decimals = 0; // suelen tener un decimal de 0 si no se quiere fraccionar
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creator,
      total,
      decimals,
      assetName,
      unitName,
      assetURL: url,
      assetMetadataHash: metadata,
      defaultFrozen,
      freeze: freezeAddr,
      manager: managerAddr,
      clawback: clawbackAddr,
      reserve: reserveAddr,
      suggestedParams: params,
    });

    console.log("TXN: ", txn);
  } catch (err) {
    console.log("err", err);
  }
};

const createToken = (addr, tokenUrl) => {
  const creator = addr;
  const defaultFrozen = false;
  const unitName = "YOSHI";
  const assetName = "Yoshi's Coins@arc3";
  const url = tokenUrl;
  const managerAddr = undefined;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;
  const total = 10000; // Los tokens fungibles deben tener un total mayor a 1
  const decimals = 2; // Los tokens fungibles suelen tener un valor mayor a 0
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    creator,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: url,
    assetMetadataHash: metadata,
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });
  console.log("TXN: ", txn);
};

export {
  createAccount,
  firstTransaction,
  accountInformation,
  createNFT,
  createToken,
};
