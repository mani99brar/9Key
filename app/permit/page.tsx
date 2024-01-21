"use client"

import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '../Navbar';
import { createBrowserClient } from '@supabase/ssr';
import gho_pay from '@/noir/out/GhoPay.sol/GhoPay.json';
import Pattern from '@/components/ui/Pattern';

const contractAddr = `0x${process.env.NEXT_PUBLIC_GHO_PAY_CONTRACT_ADDRESS}`;

console.log('contractAddr', contractAddr);


const Permit = () => {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { address } = useAccount();
  const { chain } = useNetwork();
  
  const [email, setEmail] = useState('');
  const [sum, setSum] = useState(0);// bytesundefined bytes32
  const [amount, setAmount] = useState(0.001);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState('');
  const [registeredWalletAddress, setRegisteredWalletAddress] = useState('');
  const [proof,setProof]=useState(new Uint8Array());
  const [onComplete, setOnComplete] = useState(false);

  const [txnSuccess, setTxnSuccess] = useState<any>(null);
  // registerAndApprove(uint32 sum, uint256 value)

  const toBytes32 = (num:number) => {
    const hex = num.toString(16).padStart(64, '0');
    return '0x' + hex;
  };

  console.log("start");

  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: contractAddr,
    abi: gho_pay.abi,
    enabled: onComplete,
    functionName: 'registerAndApprove',
    chainId: chain?.id,
    account: address,
    args: [toBytes32(sum), amount]
  });
  
  if (isPrepareError) {
    console.warn(`error in usePrepareContractWrite`);
    console.error(prepareError);
  };
  
  console.log('config', config);

  const { data, isLoading, isError, error, write, isSuccess, status } = useContractWrite(config);
  console.log('data, isLoading, isError, error, write, isSuccess, status');
  console.log(data, isLoading, isError, error, write, isSuccess, status);

  if (isError) {
    console.warn("error in useContractWrite");
    console.error(error);
  };

  const {
    data: txnData,
    isLoading: isContractLoading,
    isSuccess: writeSuccess,
  } = useWaitForTransaction({
    hash: data?.hash,
  })
  
  // console.log(`data: ${txnData}, isLoading: ${isContractLoading}, isSuccess: ${writeSuccess}`);
  console.log(`Transaction: ${JSON.stringify(data)}`);
  console.log("end");

  useEffect(() => {
    if (writeSuccess) {
        console.log(`Returned Data on write success`, data)
        setTxnSuccess(`Success, Transaction submited successfully`);
        console.log({
            title: 'Success',
            description: 'Transaction submited successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
    }
    }, [writeSuccess, data]);
  
    // global functions
  
  const handleSubmit = async () => {
    try {
        console.log('Sending TX')
        console.log(write);
        if (!!write) {
            console.log("writing");
            await write?.()
            console.log("written");
        }
    } catch (error) {
        console.error(error);
        console.log({
            title: 'Error',
            description: 'There was an error while writing txn',
            status: 'error',
            isClosable: true,
        });
    }
  }

  const handlePermitClick = async () => {

    // using user wallet, call the regitser and approve function
    await handleSubmit();
  };


  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('/api/', {method: 'POST', headers: {
          'Content-Type': 'application/json'
        },});
        const data = await response.json();
        setEmail(data.userEmail);
        return data.userEmail;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchWalletAddress = async (userEmail: string) => {
      try {
          let { data, error } = await supabase
          .from('email_to_address')
          .select()
          .eq('email', userEmail);
          if(data) {
            setRegisteredWalletAddress(data[0].address);
          } else {
            console.log(data);
          }
      } catch (error) {
          console.error('Error:', error);
      }
    };

    fetchUserEmail()
    .then((userEmail) => fetchWalletAddress(userEmail));

  }, []);

  useEffect(() => {
    address && setConnectedWalletAddress(address);
  }, [address])

  const handleRegister = async () => {
    try {
        const { data, error } = await supabase
        .from('email_to_address')
        .upsert({ 'email': email, 'address': connectedWalletAddress }, { onConflict: 'email' })
        .select();
        
        if(data) console.log('data', data);
        if(error) console.log('supabase error', error);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='radialBg h-[100vh] w-[100%] flex flex-col items-center  text-white'>
      <Navbar/>
      <div className='w-[80%] flex justify-between mt-8'>
        <div className='w-[50%] flex flex-col items-start gap-4'>
        <p className='text-xl font-bold'>Register your wallet address</p>
        <Input placeholder="Email" value={email} disabled />
        <Input placeholder="Connect to Wallet to Register Wallet Address" value={connectedWalletAddress} readOnly />
        <Pattern setProof={setProof} setSum={setSum}/>
        <Button onClick={handleRegister}>Register</Button>
        </div>
        
        <div className='w-[50%] flex flex-col items-start gap-4'>
        <p className='text-xl font-bold'>Permit</p>
        <Input placeholder="Registered Wallet Address" value={registeredWalletAddress} disabled />
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

        
        <Button onClick={handlePermitClick}>Permit</Button>
        </div>
          
      
      </div>
    </div>
  );
};

export default Permit;
