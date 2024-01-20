"use client"

import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '../Navbar';
import { createBrowserClient } from '@supabase/ssr'

const Permit = () => {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [connectedWalletAddress, setConnectedWalletAddress] = useState('');
  const [registeredWalletAddress, setRegisteredWalletAddress] = useState('');
  

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

  const handlePermitClick = async () => {
    // Prepare the data to be sent
    const payload = {
      userAddress: connectedWalletAddress, 
      amount: amount, 
      recipientAddress: registeredWalletAddress,
    };

    try {
      // Send a POST request to your API endpoint
      const response = await fetch('/api/proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful response
        console.log('Success:', data);
      } else {
        // Handle errors
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  return (
    <>
      <Navbar/>
      <div>
        <p>Register your wallet address</p>
        <Input placeholder="Email" value={email} disabled />
        <Input placeholder="Connect to Wallet to Register Wallet Address" value={connectedWalletAddress} readOnly />
        <Button onClick={handleRegister}>Register</Button>
        <p>Permit</p>
        <Input placeholder="Registered Wallet Address" value={registeredWalletAddress} disabled />
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={handlePermitClick}>Permit</Button>  
      
      </div>
    </>
  );
};

export default Permit;
