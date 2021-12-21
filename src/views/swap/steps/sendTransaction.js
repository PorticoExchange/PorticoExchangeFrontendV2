import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import View from '../../../components/view';
// import Link from '../../../components/link';
import QrCode from '../../../components/qrcode';
// import { toWholeCoins } from '../../../utils';
import { stacksNetworkType } from '../../../constants';
// , copyToClipBoard, lockFunds, getExplorerTransactionUrl, setExplorerTransactionUrl
// import { triggerLockStx } from '../../../utils/dotx'
// import lockStx from '../../../components/swaptab/swaptabwrapper';

import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
// StacksMainnet,
import { openContractCall, UserSession } from '@stacks/connect';
// import { useConnect, doContractCall } from '@stacks/connect-react';

import { Button as SButton, Box } from '@stacks/ui';
import { MdAccountBalanceWallet } from 'react-icons/md';

import lightningPayReq from 'bolt11';

// import { claimSwap } from '../../../actions/swapActions';

// import { useHandleClaimHey } from '../../utils/dotx'

import {
  // uintCV,
  // intCV,
  bufferCV,
  // stringAsciiCV,
  // stringUtf8CV,
  standardPrincipalCV,
  // trueCV,
  // makeStandardSTXPostCondition,
  FungibleConditionCode,
  PostConditionMode,
  // createSTXPostCondition,
  parsePrincipalString,
  StacksMessageType,
  PostConditionType,
  makeContractSTXPostCondition,
  // createContractPrincipal,
  makeStandardFungiblePostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
  contractPrincipalCV,
} from '@stacks/transactions';

import bigInt from 'big-integer';
import { BN } from 'bn.js';

let mocknet = new StacksMocknet({ url: process.env.REACT_APP_STACKS_API });
// mocknet.coreApiUrl = 'http://localhost:3999';
const testnet = new StacksTestnet();
const mainnet = new StacksMainnet();
let activeNetwork = mocknet;

if (stacksNetworkType === 'mocknet') {
  activeNetwork = mocknet;
} else if (stacksNetworkType === 'testnet') {
  activeNetwork = testnet;
} else if (stacksNetworkType === 'mainnet') {
  activeNetwork = mainnet;
}

// const appConfig = new AppConfig(['store_write', 'publish_data']);
// { appConfig }
const userSession = new UserSession();

// let explorerTransactionUrl = '';

// let stxcontractaddres = "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3"; //mocknet
// stxcontractaddres = "ST15RGYVK9ACFQWMFFA2TVASDVZH38B4VAV4WF6BJ" //testnet

// let stxcontractname = "stxswap_v3"

const SendTransactionStyles = () => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sbuttoncl: {
    margin: 'auto',
    width: 'fit-content',
    padding: '15px',
    marginBottom: '4px',
  },
  qrcode: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '300px',
    height: '300px',
  },
  info: {
    flexDirection: 'column',
    flex: 1,
  },
  text: {
    fontSize: '20px',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  address: {
    fontSize: '18px',
    color: 'grey',
    wordBreak: 'break-word',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  action: {
    color: 'blue',
    fontWeight: '600',
    fontSize: '20px',
    marginLeft: '80%',
    '&:hover': {
      cursor: 'pointer',
    },
    '@media (max-width: 425px)': {
      fontSize: '16px',
      marginLeft: '80%',
    },
  },
  tool: {
    fontSize: '12px',
  },
  hidden: {
    display: 'none',
    margin: 'auto',
  },
});

// atomic swap
const claimStx = async (swapInfo, swapResponse) => {
  console.log('claimStx begin ', swapInfo, swapResponse);

  let contractAddress = swapResponse.contractAddress
    .split('.')[0]
    .toUpperCase();
  let contractName = swapResponse.contractAddress.split('.')[1];
  console.log('claimStx ', contractAddress, contractName);

  let preimage = swapInfo.preimage;
  // let amount = swapResponse.onchainAmount;
  let amount = Math.floor(swapInfo.quoteAmount * 1000000);

  // let timeLock = swapResponse.timeoutBlockHeight;
  let timeLock = swapResponse.asTimeoutBlockHeight;

  // ${getHexString(preimage)}
  console.log(
    `Claiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock}`
  );

  // this is wrong
  // let decimalamount = parseInt(amount.toString(),16)
  console.log('amount: ', amount);
  // let smallamount = decimalamount
  // .div(etherDecimals)
  // let smallamount = amount.toNumber();

  // no idea why this was needed but it looks wrong anyway
  // let smallamount = parseInt(amount / 100) + 1;
  // console.log('smallamount: ' + smallamount);

  // also change postcondition to amount
  let swapamount = amount.toString(16).split('.')[0] + '';
  // Math.ceil(parseInt(swapResponse.onchainAmount) / 100)
  let postConditionAmount = new BN(amount);

  console.log(`postConditionAmount: ${postConditionAmount}`);
  // *1000

  // // Add an optional post condition
  // // See below for details on constructing post conditions
  const postConditionAddress = contractAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  // // new BigNum(1000000);
  // const postConditionAmount = new BN(100000);
  // const postConditions = [
  //   makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
  // ];

  // With a contract principal
  // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
  // const contractName = 'test-contract';

  // const postConditions = [
  //   createSTXPostCondition(
  //     // contractAddress,
  //     // contractName,
  //     swapResponse.lockupAddress,
  //     postConditionCode,
  //     postConditionAmount
  //   )
  // ];

  const postConditions = [
    makeContractSTXPostCondition(
      postConditionAddress,
      contractName,
      postConditionCode,
      postConditionAmount
    ),
  ];

  console.log(
    'postConditions: ' + contractAddress,
    contractName,
    postConditionCode,
    postConditionAmount
  );

  let paddedamount = swapamount.padStart(32, '0');
  let paddedtimelock = timeLock.toString(16).padStart(32, '0');
  console.log(
    'amount, timelock ',
    // smallamount,
    amount,
    swapamount,
    paddedamount,
    paddedtimelock
  );

  // (claimStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)))
  const functionArgs = [
    // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
    bufferCV(Buffer.from(preimage, 'hex')),
    bufferCV(Buffer.from(paddedamount, 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from(paddedtimelock, 'hex')),
  ];
  // console.log("stacks cli claim.154 functionargs: " + JSON.stringify(functionArgs));

  // const functionArgs = [
  //   bufferCV(preimageHash),
  //   bufferCV(Buffer.from('00000000000000000000000000100000','hex')),
  //   bufferCV(Buffer.from('01','hex')),
  //   bufferCV(Buffer.from('01','hex')),
  //   bufferCV(Buffer.from('000000000000000000000000000012b3','hex')),
  // ];

  const txOptions = {
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'claimStx',
    functionArgs: functionArgs,
    // validateWithAbi: true,
    network: activeNetwork,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
    // anchorMode: AnchorMode.Any,
    onFinish: data => {
      console.log('Stacks claim onFinish: ', data);
      // JSON.stringify(data)
      // reverseSwapResponse(true, swapResponse);
      // ??? enable this? so swap is marked completed?
      // nextStage();
    },
    onCancel: data => {
      console.log('Stacks claim onCancel:', JSON.stringify(data));
      // reverseSwapResponse(false, swapResponse);
      // nextStage();
    },
  };

  // this.toObject(txOptions)
  // console.log("stackscli claim.170 txOptions: " + JSON.stringify(txOptions));
  await openContractCall(txOptions);

  // const transaction = await makeContractCall(txOptions);
  // return broadcastTransaction(transaction, network);

  // this is from connect
  // return await openContractCall(txOptions);

  // return this.etherSwap.lock(preimageHash, claimAddress, timeLock, {
  //   value: amount,
  //   gasPrice: await getGasPrice(this.etherSwap.provider),
  // });
};

const claimToken = async (swapInfo, swapResponse) => {
  // console.log('claimToken:: ', swapInfo, swapResponse);
  let contractAddress = swapResponse.contractAddress
    .split('.')[0]
    .toUpperCase();
  let contractName = swapResponse.contractAddress.split('.')[1];
  // console.log('claimToken ', contractAddress, contractName);

  let preimage = swapInfo.preimage;

  // let amount = swapResponse.onchainAmount;
  // let timeLock = swapResponse.timeoutBlockHeight;

  // new way
  let amount = Math.floor(swapInfo.quoteAmount * 1000000);
  let timeLock = swapResponse.asTimeoutBlockHeight;

  // ${getHexString(preimage)}
  console.log(
    `Claiming ${amount} Sip10 with preimage ${preimage} and timelock ${timeLock}`
  );

  // this is wrong
  // let decimalamount = parseInt(amount.toString(),16)
  // console.log('amount: ', amount);
  // let smallamount = decimalamount
  // .div(etherDecimals)
  // let smallamount = amount.toNumber();



  let smallamount = parseInt(amount);
  //  + 1; -> REMOVED!
  // / 100 -> also removed!

  // console.log('smallamount: ' + smallamount);

  let swapamount = smallamount.toString(16).split('.')[0] + '';
  let postConditionAmount = new BN(Math.ceil(swapResponse.onchainAmount));
  // parseInt(swapResponse.onchainAmount) / 100)
  // console.log(`postConditionAmount: ${postConditionAmount}`);
  // *1000

  // // Add an optional post condition
  // // See below for details on constructing post conditions
  const postConditionAddress = contractAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  // // new BigNum(1000000);
  // const postConditionAmount = new BN(100000);
  // const postConditions = [
  //   makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
  // ];

  // With a contract principal
  // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
  // const contractName = 'test-contract';

  // const postConditions = [
  //   createSTXPostCondition(
  //     // contractAddress,
  //     // contractName,
  //     swapResponse.lockupAddress,
  //     postConditionCode,
  //     postConditionAmount
  //   )
  // ];

  // const postConditions = [
  //   makeContractSTXPostCondition(
  //     postConditionAddress,
  //     contractName,
  //     postConditionCode,
  //     postConditionAmount
  //   )
  // ];

  // With a standard principal
  // const postConditionAddress = postConditionAddress;
  // const postConditionCode = FungibleConditionCode.LessEqual;
  // const postConditionAmount = new BN(postconditionamount);

  // const tokenAddress = Buffer.from(swapResponse.redeemScript, 'hex').toString(
  //   'utf8'
  // );
  const tokenAddress = swapResponse.tokenAddress;
  // console.log('tokenAddress: ', tokenAddress);

  const assetAddress = tokenAddress.split('.')[0];
  const assetContractName = tokenAddress.split('.')[1];
  const assetName = assetContractName.split('-')[0];
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName
  );

  const standardFungiblePostCondition = makeContractFungiblePostCondition(
    postConditionAddress,
    contractName,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo
  );
  const postConditions = [
    // createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    standardFungiblePostCondition,
  ];

  // console.log(
  //   'postConditions: ' + contractAddress,
  //   contractName,
  //   postConditionCode,
  //   postConditionAmount
  // );

  let paddedamount = swapamount.padStart(32, '0');
  let paddedtimelock = timeLock.toString(16).padStart(32, '0');
  // console.log(
  //   'amount, timelock ',
  //   smallamount,
  //   swapamount,
  //   paddedamount,
  //   paddedtimelock
  // );

  // (claimToken (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)) (tokenPrincipal <ft-trait>))
  const functionArgs = [
    // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
    bufferCV(Buffer.from(preimage, 'hex')),
    bufferCV(Buffer.from(paddedamount, 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from(paddedtimelock, 'hex')),
    contractPrincipalCV(assetAddress, assetContractName),
  ];
  // console.log("stacks cli claim.154 functionargs: " + JSON.stringify(functionArgs));

  // const functionArgs = [
  //   bufferCV(preimageHash),
  //   bufferCV(Buffer.from('00000000000000000000000000100000','hex')),
  //   bufferCV(Buffer.from('01','hex')),
  //   bufferCV(Buffer.from('01','hex')),
  //   bufferCV(Buffer.from('000000000000000000000000000012b3','hex')),
  // ];

  const txOptions = {
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: 'claimToken',
    functionArgs: functionArgs,
    // validateWithAbi: true,
    network: activeNetwork,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
    // anchorMode: AnchorMode.Any,
    onFinish: data => {
      console.log('Stacks sip10 claim onFinish:', data);
      // reverseSwapResponse(true, swapResponse);
      // ??? enable this? so swap is marked completed?
      // nextStage();
    },
    onCancel: data => {
      console.log('Stacks claim onCancel:', data);
      // reverseSwapResponse(false, swapResponse);
      // nextStage();
    },
  };
  await openContractCall(txOptions);
};

async function lockStx(swapInfo, swapResponse) {
  console.log('lockStx: swapInfo, swapResponse', swapInfo, swapResponse);

  // swapInfo
  //   base: "STX"
  // baseAmount: 1.99828666
  // invoice: "lnbcrt57760n1ps3mxa7pp52w8t5tx5n0s0hz5jdu9zc2gzh6ah8r2jlzp73u5d2wjzurtqsstsdqqcqzpgsp52grylkg3pgz8dgpzfj9hfww0lehcdgdudywjp3yvdetnpunaktes9qyyssqcqtrggugladxfrezkr2llzk032wz74p87xumgc7qgu06mu3zagx4axtzcue572zr9rsa7qglzq7mr429xguvnk4hwddvqjt6y2nvtrcpvdnw4q"
  // keys:
  // privateKey: "aa5299e729fb680f6353e0686ea2900b5b3c5ae75efcc109db4c2e350b18407b"
  // publicKey: "025e90268bcf4fc7f6cd16885b186f5a0b2e01e71eaee68888b84fc09d32055640"
  // __proto__: Object
  // pair:
  // id: "BTC/STX"
  // orderSide: "buy"
  // __proto__: Object
  // quote: "BTC"
  // quoteAmount: "0.00005776"
  // __proto__: Object

  // {id: "IbXT9g", address: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3", claimAddress: "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK", acceptZeroConf: false, expectedAmount: 199828666, …}
  // acceptZeroConf: false
  // address: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3"
  // claimAddress: "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK"
  // expectedAmount: 199828666
  // id: "IbXT9g"
  // timeoutBlockHeight: 5666

  //   swapresponse
  //   acceptZeroConf: false
  // address: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3"
  // claimAddress: "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK"
  // expectedAmount: 199506950
  // id: "nf68IS"
  // timeoutBlockHeight: 5578

  let stxcontractaddress = swapResponse.address.split('.')[0];
  let stxcontractname = swapResponse.address.split('.')[1];

  let paymenthash;
  if (swapInfo.invoice.toLowerCase().slice(0, 2) === 'ln') {
    var decoded = lightningPayReq.decode(swapInfo.invoice);
    // console.log("decoded: ", decoded);

    var obj = decoded.tags;
    for (let index = 0; index < obj.length; index++) {
      const tag = obj[index];
      // console.log("tag: ", tag);
      if (tag.tagName === 'payment_hash') {
        // console.log("yay: ", tag.data);
        paymenthash = tag.data;
      }
    }
  } else {
    paymenthash = swapInfo.preimageHash;
  }

  console.log('paymenthash: ', paymenthash);

  let swapamount, postconditionamount;
  if (swapResponse.expectedAmount === 0) {
    // atomic swap
    console.log(
      'expectedAmount is 0, this is an atomic swap ',
      swapResponse.expectedAmount,
      swapResponse.baseAmount
    );
    let amountToLock = swapResponse.baseAmount;
    swapamount = (amountToLock * 1000000).toString(16).split('.')[0] + '';
    postconditionamount = Math.ceil(amountToLock * 1000000);
  } else {
    console.log(
      'expectedAmount is NOT 0, regular swap ',
      swapResponse.expectedAmount
    );
    swapamount =
      (parseInt(swapResponse.expectedAmount) / 100).toString(16).split('.')[0] +
      '';
    postconditionamount = Math.ceil(
      parseInt(swapResponse.expectedAmount) / 100
    );
    // *1000
    // 199610455 -> 199 STX
  }
  console.log(
    'swapamount, postconditionamount: ',
    swapamount,
    postconditionamount
  );

  console.log(
    'calc: ',
    swapResponse.expectedAmount,
    parseInt(swapResponse.expectedAmount) / 100,
    swapResponse.baseAmount
  );

  let paddedamount = swapamount.padStart(32, '0');

  let paddedtimelock = Number(swapResponse.timeoutBlockHeight)
    .toString(16)
    .padStart(32, '0');
  console.log('paddedamount, paddedtimelock: ', paddedamount, paddedtimelock);

  let userData = userSession.loadUserData();

  let postConditionAddress = stxcontractaddress;
  if (activeNetwork === mainnet) {
    postConditionAddress = userData.profile.stxAddress.mainnet;
  } else {
    postConditionAddress = userData.profile.stxAddress.testnet;
  }

  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = new BN(postconditionamount);
  // const postConditionAmount = new BigNumber(2000000)
  // const postConditionAmount = Buffer.from('00000000000000000000000000100000','hex');
  // const postConditions = [
  //   makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
  // ];

  // it was working before - not anymore
  const postConditions = [
    createSTXPostCondition(
      postConditionAddress,
      postConditionCode,
      postConditionAmount
    ),
  ];

  // const postConditions = [
  //   makeContractSTXPostCondition(
  //     postConditionAddress,
  //     stxcontractname,
  //     postConditionCode,
  //     postConditionAmount
  //   )
  // ];

  // typeof(postConditions[0].amount), postConditions[0].amount.toArrayLike
  console.log('postConditions: ', postConditionAddress, postConditions);

  // (lockStx (preimageHash (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16))
  const functionArgs = [
    // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
    // paymenthash:          a518e5782da3d6d58d9d3494448fc3a5f42d4704942e4e3154c7b36fc163a0e9
    bufferCV(Buffer.from(paymenthash, 'hex')),
    bufferCV(Buffer.from(paddedamount, 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from(paddedtimelock, 'hex')),
    standardPrincipalCV(swapResponse.claimAddress),
  ];
  // console.log("functionArgs: ", JSON.stringify(functionArgs));
  // return false;
  const options = {
    network: activeNetwork,
    contractAddress: stxcontractaddress,
    contractName: stxcontractname,
    functionName: 'lockStx',
    functionArgs,
    appDetails: {
      name: 'LNSwap',
      icon: window.location.origin + './favicon.ico',
    },
    // authOrigin: "localhost:3888",
    postConditions,
    // postConditionMode: PostConditionMode.Allow,
    onFinish: data => {
      console.log('Stacks Transaction:', data.stacksTransaction);
      console.log('Transaction ID:', data.txId);
      console.log('Raw transaction:', data.txRaw);
      let explorerTransactionUrl =
        'https://explorer.stacks.co/txid/' + data.txId;
      if (activeNetwork === testnet) {
        explorerTransactionUrl = explorerTransactionUrl + '?chain=testnet';
      }
      console.log('View transaction in explorer:', explorerTransactionUrl);
      document.querySelector('a').href = explorerTransactionUrl;
      document.querySelector('a').style.display = 'block';
      // this.explorerTransactionUrl = explorerTransactionUrl;
    },
  };
  console.log('options: ', options);
  await openContractCall(options);
}

async function lockToken(swapInfo, swapResponse) {
  console.log('lockToken: ', swapInfo, swapResponse);

  // swapInfo
  //   base: "STX"
  // baseAmount: 1.99828666
  // invoice: "lnbcrt57760n1ps3mxa7pp52w8t5tx5n0s0hz5jdu9zc2gzh6ah8r2jlzp73u5d2wjzurtqsstsdqqcqzpgsp52grylkg3pgz8dgpzfj9hfww0lehcdgdudywjp3yvdetnpunaktes9qyyssqcqtrggugladxfrezkr2llzk032wz74p87xumgc7qgu06mu3zagx4axtzcue572zr9rsa7qglzq7mr429xguvnk4hwddvqjt6y2nvtrcpvdnw4q"
  // keys:
  // privateKey: "aa5299e729fb680f6353e0686ea2900b5b3c5ae75efcc109db4c2e350b18407b"
  // publicKey: "025e90268bcf4fc7f6cd16885b186f5a0b2e01e71eaee68888b84fc09d32055640"
  // __proto__: Object
  // pair:
  // id: "BTC/STX"
  // orderSide: "buy"
  // __proto__: Object
  // quote: "BTC"
  // quoteAmount: "0.00005776"
  // __proto__: Object

  // {id: "IbXT9g", address: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3", claimAddress: "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK", acceptZeroConf: false, expectedAmount: 199828666, …}
  // acceptZeroConf: false
  // address: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3"
  // claimAddress: "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK"
  // expectedAmount: 199828666
  // id: "IbXT9g"
  // timeoutBlockHeight: 5666

  //   swapresponse
  //   acceptZeroConf: false
  // address: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3"
  // claimAddress: "ST30VXWG00R13WK8RDXBSTHXNWGNKCAQTRYEMA9FK"
  // expectedAmount: 199506950
  // id: "nf68IS"
  // timeoutBlockHeight: 5578

  let stxcontractaddress = swapResponse.address.split('.')[0];
  let stxcontractname = swapResponse.address.split('.')[1];

  let paymenthash;
  if (swapInfo.invoice.toLowerCase().slice(0, 2) === 'ln') {
    var decoded = lightningPayReq.decode(swapInfo.invoice);
    // console.log("decoded: ", decoded);

    var obj = decoded.tags;
    for (let index = 0; index < obj.length; index++) {
      const tag = obj[index];
      // console.log("tag: ", tag);
      if (tag.tagName === 'payment_hash') {
        // console.log("yay: ", tag.data);
        paymenthash = tag.data;
      }
    }
  } else {
    paymenthash = swapInfo.preimageHash;
  }
  console.log('paymenthash: ', paymenthash);

  let swapamount, postconditionamount;
  if (swapResponse.expectedAmount === 0) {
    // atomic swap
    console.log(
      'expectedAmount is 0, this is an atomic swap ',
      swapResponse.expectedAmount,
      swapResponse.baseAmount
    );
    let amountToLock = swapResponse.baseAmount;
    swapamount = (amountToLock * 1000000).toString(16).split('.')[0] + '';
    postconditionamount = Math.ceil(amountToLock * 1000000);
  } else {
    console.log(
      'expectedAmount is NOT 0, regular swap ',
      swapResponse.expectedAmount
    );
    // need to confirm token decimals!!!
    // * 1000000
    console.log(
      'calc: ',
      swapResponse.expectedAmount,
      parseInt(swapResponse.expectedAmount) / 100
    );
    swapamount =
      (parseInt(swapResponse.expectedAmount) / 100).toString(16).split('.')[0] +
      '';
    // postcondition amount should be in stx not mstx - WRONG!
    postconditionamount = Math.ceil(
      parseInt(swapResponse.expectedAmount) / 100
    );
  }
  // let postconditionamount =
  //   parseInt(swapResponse.expectedAmount) / (100 * 1000000);
  // *1000
  // 199610455 -> 199 STX
  console.log(
    'swapamount, postconditionamount: ',
    swapamount,
    postconditionamount
  );
  let paddedamount = swapamount.padStart(32, '0');

  let paddedtimelock = Number(swapResponse.timeoutBlockHeight)
    .toString(16)
    .padStart(32, '0');
  console.log('paddedamount, paddedtimelock: ', paddedamount, paddedtimelock);

  let userData = userSession.loadUserData();

  let postConditionAddress = stxcontractaddress;
  if (activeNetwork === mainnet) {
    postConditionAddress = userData.profile.stxAddress.mainnet;
  } else {
    postConditionAddress = userData.profile.stxAddress.testnet;
  }

  // With a standard principal
  // const postConditionAddress = postConditionAddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = new BN(postconditionamount);

  // const tokenAddress = Buffer.from(swapResponse.redeemScript, 'hex').toString(
  //   'utf8'
  // );
  const tokenAddress = swapResponse.tokenAddress;
  console.log('tokenAddress: ', tokenAddress);

  const assetAddress = tokenAddress.split('.')[0];
  const assetContractName = tokenAddress.split('.')[1];
  const assetName = assetContractName.split('-')[0];
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName
  );

  const standardFungiblePostCondition = makeStandardFungiblePostCondition(
    postConditionAddress,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo
  );

  // const postConditionCode = FungibleConditionCode.LessEqual;
  // const postConditionAmount = new BN(postconditionamount);

  // it was working before - not anymore
  const postConditions = [
    // createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    standardFungiblePostCondition,
  ];

  // const postConditions = [
  //   makeContractSTXPostCondition(
  //     postConditionAddress,
  //     stxcontractname,
  //     postConditionCode,
  //     postConditionAmount
  //   )
  // ];

  // typeof(postConditions[0].amount), postConditions[0].amount.toArrayLike
  console.log('postConditions: ', postConditionAddress, postConditions);

  // (lockStx (preimageHash (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16))
  const functionArgs = [
    // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
    // paymenthash:          a518e5782da3d6d58d9d3494448fc3a5f42d4704942e4e3154c7b36fc163a0e9
    bufferCV(Buffer.from(paymenthash, 'hex')),
    bufferCV(Buffer.from(paddedamount, 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from('01', 'hex')),
    bufferCV(Buffer.from(paddedtimelock, 'hex')),
    standardPrincipalCV(swapResponse.claimAddress),
    contractPrincipalCV(assetAddress, assetContractName), // token address + contractname
  ];
  // console.log("functionArgs: ", JSON.stringify(functionArgs));
  // return false;
  const options = {
    network: activeNetwork,
    contractAddress: stxcontractaddress,
    contractName: stxcontractname,
    functionName: 'lockToken',
    functionArgs,
    appDetails: {
      name: 'LNSwap',
      icon: window.location.origin + './favicon.ico',
    },
    // authOrigin: "localhost:3888",
    postConditions,
    // postConditionMode: PostConditionMode.Allow,
    onFinish: data => {
      console.log('Stacks Transaction:', data.stacksTransaction);
      console.log('Transaction ID:', data.txId);
      console.log('Raw transaction:', data.txRaw);
      let explorerTransactionUrl =
        'https://explorer.stacks.co/txid/' + data.txId;
      if (activeNetwork === testnet) {
        explorerTransactionUrl = explorerTransactionUrl + '?chain=testnet';
      }
      console.log('View transaction in explorer:', explorerTransactionUrl);
      document.querySelector('a').href = explorerTransactionUrl;
      document.querySelector('a').style.display = 'block';
      // this.explorerTransactionUrl = explorerTransactionUrl;
    },
  };
  console.log('options: ', options);
  await openContractCall(options);
}

// function makeContractSTXPostCondition(
//   address,
//   contractName,
//   conditionCode,
//   amount
// ) {
//   return createSTXPostCondition(
//     createContractPrincipal(address, contractName),
//     conditionCode,
//     amount
//   );
// }

function createSTXPostCondition(principal, conditionCode, amount) {
  if (typeof principal === 'string') {
    principal = parsePrincipalString(principal);
  }
  return {
    type: StacksMessageType.PostCondition,
    conditionType: PostConditionType.STX,
    principal,
    conditionCode,
    amount: intToBN(amount, false),
  };
}
// function intToBytes(value, signed, byteLength) {
//   return intToBN(value, signed).toArrayLike(Buffer, 'be', byteLength);
// }
function intToBN(value, signed) {
  const bigInt = intToBigInt(value, signed);
  return new BN(bigInt.toString());
}
function intToBigInt(value, signed) {
  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      throw new RangeError(
        `Invalid value. Values of type 'number' must be an integer.`
      );
    }
    // console.log("156")
    // return 157;
    return bigInt(value);
  }
  if (typeof value === 'string') {
    if (value.toLowerCase().startsWith('0x')) {
      let hex = value.slice(2);
      hex = hex.padStart(hex.length + (hex.length % 2), '0');
      value = Buffer.from(hex, 'hex');
    } else {
      try {
        // return 168;
        return bigInt(value);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new RangeError(
            `Invalid value. String integer '${value}' is not finite.`
          );
        }
      }
    }
  }
  if (typeof value === 'bigint') {
    return value;
  }
  if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
    if (signed) {
      const bn = new BN(value, 'be').fromTwos(value.byteLength * 8);
      // return 184;
      return bigInt(bn.toString());
    } else {
      // return 188;
      return bigInt(new BN(value, 'be').toString());
    }
  }
  if (value instanceof BN || BN.isBN(value)) {
    // return 193;
    return bigInt(value.toString());
  }
  throw new TypeError(
    `Invalid value type. Must be a number, bigint, integer-string, hex-string, BN.js instance, or Buffer.`
  );
}

// class StyledSendTransaction extends React.Component {
//   state = {
//     txurl: '',
//   };

//   onChange = input => {
//     console.log("onchange ", input);
//     this.setState({ txurl: input });
//   };

//   render() {
//     const { txurl } = this.state;
//     const { classes, swapInfo, swapResponse } = this.props;

//     return (  <View className={classes.wrapper}>
//       {/* {swapInfo.base !== 'SOV' ? (
//       <View className={classes.qrcode}>
//         <QrCode size={250} link={swapResponse.bip21} />
//       </View>
//       ): null} */}
//       <View className={classes.info}>
//         <p className={classes.text}>
//         {swapInfo.base === 'STX' ? ( 'You need to lock' ): 'Send' }
//           <b>
//             {' '}
//             {toWholeCoins(swapResponse.expectedAmount)} {swapInfo.base}{' '}
//           </b>{' '}
//           to this contract:
//         </p>
//         <p className={classes.address} id="copy">
//           {swapResponse.address}
//         </p>
//         {/* <span className={classes.action} onClick={() => copyToClipBoard()}>
//           Copy
//         </span> */}
//         {swapInfo.base === 'LTC' ? (
//           <p className={classes.tool}>
//             If the address does not work with your wallet:{' '}
//             <a
//               target={'_blank'}
//               href="https://litecoin-project.github.io/p2sh-convert/"
//             >
//               use this tool
//             </a>
//           </p>
//         ) : null}
//         {swapInfo.base === 'STX' ? (

//           <SButton
//             size="large"
//             pl="base-tight"
//             pr={'base'}
//             py="tight"
//             fontSize={2}
//             mode="primary"
//             position="relative"
//             className={classes.sbuttoncl}
//             // ref={ref}
//             onClick={() => lockStx(swapInfo, swapResponse)}
//             borderRadius="10px"
//             // {...rest}
//             >
//             <Box
//               as={MdAccountBalanceWallet}
//               // transform={isSend ? 'unset' : 'scaleY(-1)'}
//               size={'16px'}
//               mr={'2px'}
//             />
//             <Box as="span" ml="2px" fontSize="large">
//               Lock STX
//             </Box>
//           </SButton>

//           // <p className={classes.text}>
//           //   Tap here to trigger Lock Contract Call:{' '}
//           //   <button
//           //     onClick={() => lockStx(swapInfo, swapResponse)}
//           //     // target={'_blank'}
//           //     // href="https://litecoin-project.github.io/p2sh-convert/"
//           //   >
//           //     Lock
//           //   </button>
//           // </p>

//         ) : null}

//         <a
//           href={txurl}
//           className={txurl=='' ? classes.hidden : undefined}
//           target="_blank">View Lock Transaction on Explorer{txurl}
//         </a>

//         <Link to={txurl} text={'Click here'} /> to see the lockup transaction.

//       </View>
//     </View>
//     );
//   }

// }

// const StyledSendTransaction = ({
//   classes,
//   swapInfo,
//   swapResponse,
//   swapStatus,
// }) => (

class SendTransaction extends React.Component {
  constructor() {
    super();

    this.state = {
      checked: false,
    };
  }

  render() {
    // setAllowZeroConf
    const {
      classes,
      swapInfo,
      swapResponse,
      swapStatus,
      claimSwap,
    } = this.props;

    console.log(
      'sendtransaction.682 , ',
      swapInfo,
      swapResponse,
      swapStatus,
      claimSwap
    );
    // const link = swapResponse
    //   ? `${getExplorer(swapInfo.quote)}/txid/0x${swapResponse.transactionId}`
    //   : '#0';

    // let amountToLock = toWholeCoins(swapResponse.expectedAmount);
    let amountToLock = swapResponse.expectedAmount;
    if (
      swapResponse.expectedAmount == 0 ||
      swapResponse.expectedAmount == '0'
    ) {
      console.log('setting amountToLock ', swapResponse.baseAmount);
      amountToLock = swapResponse.baseAmount;
    }
    console.log('amountToLock ', amountToLock);
    return (
      <View className={classes.wrapper}>
        {/* {swapInfo.base !== 'SOV' ? (
    <View className={classes.qrcode}>
      <QrCode size={250} link={swapResponse.bip21} />
    </View>
    ): null} */}
        <View className={classes.info}>
          <p className={classes.text}>
            {swapInfo.base === 'STX' || swapInfo.base === 'USDA'
              ? 'You need to lock'
              : 'Send'}
            <b>
              {' '}
              {amountToLock} {swapInfo.base}{' '}
            </b>{' '}
            to this contract:
          </p>
          <p className={classes.address} id="copy">
            {swapResponse.address}
          </p>
          {/* <span className={classes.action} onClick={() => copyToClipBoard()}>
        Copy
      </span> */}
          {swapResponse.bip21 ? (
            <View className={classes.qrcode}>
              <QrCode size={250} link={swapResponse.bip21} />
            </View>
          ) : null}
          {swapInfo.base === 'LTC' ? (
            <p className={classes.tool}>
              If the address does not work with your wallet:{' '}
              <a
                target={'_blank'}
                rel="noopener noreferrer"
                href="https://litecoin-project.github.io/p2sh-convert/"
              >
                use this tool
              </a>
            </p>
          ) : null}
          {swapInfo.base === 'STX' || swapInfo.base === 'USDA' ? (
            <SButton
              size="large"
              pl="base-tight"
              pr={'base'}
              py="tight"
              fontSize={2}
              mode="primary"
              position="relative"
              className={classes.sbuttoncl}
              // ref={ref}
              onClick={() =>
                swapInfo.base === 'STX'
                  ? lockStx(swapInfo, swapResponse)
                  : lockToken(swapInfo, swapResponse)
              }
              borderRadius="10px"
              // {...rest}
            >
              <Box
                as={MdAccountBalanceWallet}
                // transform={isSend ? 'unset' : 'scaleY(-1)'}
                size={'16px'}
                mr={'2px'}
              />
              <Box as="span" ml="2px" fontSize="large">
                Lock {swapInfo.base}
              </Box>
            </SButton>
          ) : // <p className={classes.text}>
          //   Tap here to trigger Lock Contract Call:{' '}
          //   <button
          //     onClick={() => lockStx(swapInfo, swapResponse)}
          //     // target={'_blank'}
          //     // href="https://litecoin-project.github.io/p2sh-convert/"
          //   >
          //     Lock
          //   </button>
          // </p>

          null}

          {swapResponse.bip21 &&
          swapStatus &&
          swapStatus.message === 'Atomic Swap is ready' ? (
            <SButton
              size="large"
              pl="base-tight"
              pr={'base'}
              py="tight"
              fontSize={2}
              mode="primary"
              position="relative"
              className={classes.sbuttoncl}
              // ref={ref}
              onClick={() =>
                swapInfo.quote === 'STX'
                  ? claimStx(swapInfo, swapResponse)
                  : claimToken(swapInfo, swapResponse)
              }
              borderRadius="10px"
              // {...rest}
            >
              <Box
                as={MdAccountBalanceWallet}
                // transform={isSend ? 'unset' : 'scaleY(-1)'}
                size={'16px'}
                mr={'2px'}
              />
              <Box as="span" ml="2px" fontSize="large">
                Claim {swapInfo.quote}
              </Box>
            </SButton>
          ) : // <p className={classes.text}>
          //   Tap here to trigger Lock Contract Call:{' '}
          //   <button
          //     onClick={() => lockStx(swapInfo, swapResponse)}
          //     // target={'_blank'}
          //     // href="https://litecoin-project.github.io/p2sh-convert/"
          //   >
          //     Lock
          //   </button>
          // </p>

          // <p>
          //   {swapResponse.bip21} and{' '}
          //   {(swapStatus && swapStatus.message) || 'nothing here'}
          // </p>
          null}

          <a href="." className={classes.hidden} target="_blank">
            View Lock Transaction on Explorer
          </a>

          {swapResponse.redeemScript &&
          swapStatus.transaction &&
          swapStatus.transaction.hex &&
          swapStatus &&
          swapStatus.message === 'Atomic Swap is ready' ? (
            <SButton
              size="large"
              pl="base-tight"
              pr={'base'}
              py="tight"
              fontSize={2}
              mode="primary"
              position="relative"
              className={classes.sbuttoncl}
              // ref={ref}
              onClick={() => claimSwap(swapInfo, swapResponse, swapStatus)}
              borderRadius="10px"
              // {...rest}
            >
              <Box
                as={MdAccountBalanceWallet}
                // transform={isSend ? 'unset' : 'scaleY(-1)'}
                size={'16px'}
                mr={'2px'}
              />
              <Box as="span" ml="2px" fontSize="large">
                Claim {swapInfo.quote}
              </Box>
            </SButton>
          ) : // <p className={classes.text}>
          //   Tap here to trigger Lock Contract Call:{' '}
          //   <button
          //     onClick={() => lockStx(swapInfo, swapResponse)}
          //     // target={'_blank'}
          //     // href="https://litecoin-project.github.io/p2sh-convert/"
          //   >
          //     Lock
          //   </button>
          // </p>

          // <p>
          //   {swapResponse.bip21} and{' '}
          //   {(swapStatus && swapStatus.message) || 'nothing here'}
          // </p>
          null}
        </View>
      </View>
    );
  }
}
SendTransaction.propTypes = {
  // StyledSendTransaction.propTypes = {
  classes: PropTypes.object.isRequired,
  swapInfo: PropTypes.object.isRequired,
  swapResponse: PropTypes.object.isRequired,
  swapStatus: PropTypes.object,
  claimSwap: PropTypes.func,
  // onChange: PropTypes.func.isRequired,
};

// const SendTransaction = injectSheet(SendTransactionStyles)(
//   StyledSendTransaction
// );

export default injectSheet(SendTransactionStyles)(SendTransaction);

// export default SendTransaction;
