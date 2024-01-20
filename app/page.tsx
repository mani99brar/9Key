"use client"

import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi'
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

  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [proof,setProof]=useState(new Uint8Array());  


  useEffect(() => {

    async function fetchWalletAdderss() {
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
    fetchWalletAdderss();
    
  } , [])

  useEffect(() => {
    console.log('proof', proof);
  }, [proof]);


 

  return (
    <div className='radialBg h-[100vh] text-white'>
      <Navbar />
      <div className='w-[100%] flex flex-col items-center justify-center'>
        <div className='w-[80%] flex flex-col justify-center items-center p-8 gap-6'>
          <p className='text-6xl'>zPay</p>
          <Input className='' type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      
        <Input placeholder="Destination Wallet Address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
        <Pattern setProof={setProof} />
        </div>
      
      </div>
      
    </div>
  );
};

export default Pay;

