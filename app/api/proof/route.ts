import Web3 from 'web3';
import { NextRequest, NextResponse } from 'next/server';

// load contract ABI from file
import TOKEN_ABI_JSON from '@/noir/out/GhoPay.sol/GhoPay.json';
const ABI = TOKEN_ABI_JSON.abi;

const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
const ORIGIN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_KEY = process.env.PRIVATE_KEY!;

const transferTokens = async (provider:any, contract:any, amount:any, address:any) => {
    try {
      console.log(`Transfering ${amount} tokens to ${address}  💸💸💸💸💸`);
  
      // 1 create smart contract transaction
      // custom funciton
      const trx = contract.methods.transfer(address, amount);

      // 2 calculate gas fee
    const gas = await trx.estimateGas({ from: WALLET_ADDRESS });
    //   console.log('gas :>> ', gas);
      // 3 calculate gas price
      const gasPrice = await provider.eth.getGasPrice();
      console.log('gasPrice :>> ', gasPrice);
      // 4 encode transaction data
      const data = trx.encodeABI();
      console.log('data :>> ', data);
      // 5 get transaction number for wallet
      const nonce = await provider.eth.getTransactionCount(WALLET_ADDRESS);
      console.log('nonce :>> ', nonce);
      // 6 build transaction object with all the data
      const trxData = {
        // trx is sent from the wallet
        from: WALLET_ADDRESS,
        // trx destination is the ERC20 token contract
        to: ORIGIN_CONTRACT_ADDRESS,
        /** data contains the amount an recepient address params for transfer contract method */
        data,
        gas,
        gasPrice,
        nonce,
      };
  
      console.log('Transaction ready to be sent');
      /** 7 send transaction, it'll be automatically signed
      because the provider has already the wallet **/
      const receipt = await provider.eth.sendTransaction(trxData);
      console.log(`Transaction sent, hash is ${receipt.transactionHash}`);
  
      return true;
    } catch (error) {
      console.error('Error in transferTokens >', error);
      return false;
    }
  };

export async function POST(request: NextRequest) {

  const body = await request.json();

  const data = body;

  const {userAddress, amount, recipientAddress, proof} = body;
  console.log('body',amount, recipientAddress, proof);


  // let response = NextResponse.next({
      // request: {
        // headers: request.headers,
      // },
  // });

  const web3Provider = new Web3(RPC_ENDPOINT);

  // import wallet in the provider
  console.log('WALLET_KEY', WALLET_KEY)
  web3Provider.eth.accounts.wallet.add(WALLET_KEY);

  const tokenContract = new web3Provider.eth.Contract(ABI, ORIGIN_CONTRACT_ADDRESS);



  // method to do the transfer
      // transferTokens(provider, contract, amount, address)

  const result = await transferTokens(web3Provider, tokenContract, amount, recipientAddress);

  if(result) {
    return NextResponse.json({ result: result });
  } else {
    return NextResponse.json({ result: null });
  }
}