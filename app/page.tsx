"use client"

import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi'
import { createBrowserClient } from '@supabase/ssr';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from './Navbar';
// import Approve from './approve';

const Pay = () => {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { address } = useAccount();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [sum, setSum] = useState();
  const [deadline, setDeadline] = useState('');
  const [v, setV] = useState('');
  const [r, setR] = useState('');
  const [s, setS] = useState('');



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

  return (
    <div>
      <Navbar />
      <p>Pay</p>
      <div>Amount:</div> 
      <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <div>To:</div>
      <Input placeholder="Destination Wallet Address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
      
      {/* <Approve props={ sum, amount, deadline, v, r, s } /> */}
    </div>
  );
};

export default Pay;
