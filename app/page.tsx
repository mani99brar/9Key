"use client";
import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { createBrowserClient } from '@supabase/ssr';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from './Navbar';
import Pattern from '../components/ui/Pattern';

const Pay = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const {address} = useAccount();
  const [userAddress,setUserAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [proof, setProof] = useState(new Uint8Array());
  const [sum, setSum] = useState(0);
  useEffect(() => {
    async function fetchWalletAddress() {
      try {
        const { data, error } = await supabase
        .from('email_to_address')
        .select();
        console.log('data', data);
        console.log('error', error);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchWalletAddress();

    
    if(address){
      setUserAddress(address);
    }
  }, [])

  function convertProofDataToHexString(proofData:Uint8Array) {
    // Convert the proofData object into a Uint8Array
    const byteArray = new Uint8Array(Object.values(proofData));
  
    // Convert the byteArray into a hexadecimal string
    const hexString = '0x' + Array.from(byteArray, byte => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  
    return hexString;
  }

  useEffect(() => {
    async function sendProofToApi() {
      if (proof && receiverAddress && amount) {
        try {
          console.log("Sending Proof on-chain");
          const response = await fetch('/api/proof', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              receiverAddress,
              userAddress: userAddress, // Replace with actual user address
              amount: amount, // Convert amount to Ether
              proof:convertProofDataToHexString(proof),
              sum
            })
          });

          const data = await response.json();
          console.log('API response:', data);
        } catch (error) {
          console.error('Error sending proof to API:', error);
        }
      }
    }
    sendProofToApi();
  }, [proof]);

  return (
    <div className='radialBg h-[100vh] text-white'>
      <Navbar />
      <div className='w-[100%] flex flex-col items-center justify-center'>
        <div className='w-[80%] flex flex-col justify-center items-center p-8 gap-6'>
          <p className='text-6xl'>zPay</p>
          <Input className='' type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
          <Input placeholder="Destination Wallet Address" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
          <Pattern setProof={setProof} setSum={setSum} />
        </div>
      </div>
    </div>
  );
};

export default Pay;
