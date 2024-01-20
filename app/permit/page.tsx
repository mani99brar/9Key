"use client"

import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Approve from './approve';
import Register from './register';
import Navbar from '../Navbar';

const Permit = () => {

  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [sum, setSum] = useState();
  const [deadline, setDeadline] = useState('');
  const [v, setV] = useState('');
  const [r, setR] = useState('');
  const [s, setS] = useState('');

  useEffect(() => {
    address && setWalletAddress(address);
  }, [address])

  return (
    <>
      <Navbar/>
      <div>
        <Register walletAddress={walletAddress} />
        <p>Permit</p>
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Approve props={ sum, amount, deadline, v, r, s } />
      </div>
    </>
  );
};

export default Permit;
