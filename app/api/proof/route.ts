import Web3 from 'web3';
import { NextRequest, NextResponse } from 'next/server';

// Load contract ABI from file
import TOKEN_ABI_JSON from '@/noir/out/GhoPay.sol/GhoPay.json';
const ABI = TOKEN_ABI_JSON.abi;

const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
const ORIGIN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GHO_PAY_CONTRACT_ADDRESS;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const WALLET_KEY = process.env.PRIVATE_KEY as string;

interface TransferBody {
  proof:string;
  provider : Web3;
  userAddress: string;
  contractAddress : string;
  amount: number;
  sendAddress : string;
  sum: number;
}




const toBytes32 = (num:number) => {
  const hex = num.toString(16).padStart(64, '0');
  return '0x' + hex;
};


const transferTokens = async ({proof,provider,userAddress, contractAddress, amount, sendAddress,sum}:TransferBody) => {
  try {
      // Initialize the contract
      const contract = new provider.eth.Contract(ABI, contractAddress);

      // Add wallet to web3
      provider.eth.accounts.wallet.add(WALLET_KEY);

      const weiAmount = provider.utils.toWei(amount.toString(), 'ether');
      const bytes32Sum = toBytes32(sum);
      const y = [bytes32Sum];

      //Register
      console.log(y[0],amount);
      // const trx = contract.methods.registerAndApprove(y[0],weiAmount );

      // Create transaction
      console.log("Creating Transaction");
      console.log(sendAddress, userAddress,weiAmount, y);
      const trx = contract.methods.transferGhoTokens(proof,sendAddress, userAddress,amount, y);
      // const bytes32Sum = toBytes32(sum);
  
      // const y = [bytes32Sum];
      // console.log(y);
      // const trx = contract.methods.verifyEqual(convertProofDataToHexString(proof), y);

      // Estimate gas and set up transaction data
      const gas = await trx.estimateGas({ from: WALLET_ADDRESS });
      const gasPrice = await provider.eth.getGasPrice();
      const nonce = await provider.eth.getTransactionCount(WALLET_ADDRESS!);
      const trxData = {
          from: WALLET_ADDRESS,
          to: ORIGIN_CONTRACT_ADDRESS,
          data: trx.encodeABI(),
          gas,
          gasPrice,
          nonce,
      };
      
      console.log(trxData);
      // Send transaction
      const receipt = await provider.eth.sendTransaction(trxData);
      console.log(receipt);
      return receipt.transactionHash;
  } catch (error) {
      console.error('Error in transferTokens:', error);
      throw error;
  }
};


// POST request handler
export async function POST(request: NextRequest) {

  const body = await request.json();
  
  const web3 = new Web3(RPC_ENDPOINT!);
  console.log("Transaction Initiated");
  console.log(body);
  const sendAddress = body.receiverAddress as string;
  try {
    console.log(sendAddress);
      const transactionHash = await transferTokens({
        proof:body.proof,
        provider: web3,
        userAddress: body.userAddress,
        contractAddress: ORIGIN_CONTRACT_ADDRESS!,
        amount: body.amount,
        sendAddress,
        sum: body.sum,
      });
    console.log("Transaction Completed", transactionHash);

        return NextResponse.json({ success: true});
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
  
}
