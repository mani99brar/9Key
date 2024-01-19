"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from '@supabase/ssr';

const Register = ({ walletAddress }: { walletAddress: string } ) => {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {

        try {
            const response = await fetch('/api/', {method: 'POST', headers: {
                'Content-Type': 'application/json'
              },});
            const data = await response.json();
            console.log(data, 'data');
            setEmail(data.userEmail);
        } catch (error) {
            console.error('Error:', error);
        }

    };

    fetchUserData();
  }, []);

  const handleRegister = async () => {
    console.log(email, walletAddress);    
    try {
        const { data, error } = await supabase
        .from('email_to_address')
        .upsert({ 'email': email, 'address': walletAddress }, { onConflict: 'email' })
        .select();
        
        console.log('data', data);
        console.log('error', error);

        // TODO: proceed to /permit route
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <p>Register your wallet address</p>
      <Input placeholder="Email" value={email} disabled /*  onChange={(e) => setEmail(e.target.value)} */ />
      <Input placeholder="Connect to Wallet to Register Wallet Address" value={walletAddress} readOnly />
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;
