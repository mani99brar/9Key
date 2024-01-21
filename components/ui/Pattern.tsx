import { SetStateAction, useState } from "react";
import PatternLock from "react-pattern-lock";
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import with_foundry from '../../noir/circuits/target/with_foundry.json';
import React, { FC, Dispatch } from 'react';
interface PatternProps {
  setProof: Dispatch<SetStateAction<Uint8Array>>;
  setSum : Dispatch<SetStateAction<number>>;
}
const Pattern:FC<PatternProps> = ({setProof,setSum}) => {
  const [path, setPath] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  let errorTimeout = 0;

  const onReset = () => {
    setPath([]);
    setSuccess(false);
    setError(false);
    setDisabled(false);
  };

  const onChange = (newPath : any) => {
    setPath([...newPath]);
  };

  function repeatArrayElements(arr:Array<number>) {
    const repeatedArray = [];
  
    // Ensure the input array is not empty
    if (arr.length === 0) {
      console.log("Input array is empty.");
      return [];
    }
  
    // Repeat elements until the length is 9
    for (let i = 0; repeatedArray.length < 9; i++) {
      repeatedArray.push(arr[i % arr.length]+1);
    }
  
    return repeatedArray;
  }

  function countSum(arr:Array<number>) {
    let sum = 0;
  
    for (let i = 1; i <= 9; i++) {
      sum += arr[i-1]*i;
    }
  
    return sum;
  }

  const onFinish = async () => {
    setIsLoading(true);
    console.log(path);
    
    const inputArray = repeatArrayElements(path);   
    const sum = countSum(inputArray);
    console.log(inputArray);
    setSum(sum);
    console.log('sum', sum);
    // an imaginary api call

     // @ts-ignore
     const backend = new BarretenbergBackend(with_foundry);
    
     // @ts-ignore
     const noir = new Noir(with_foundry, backend);
     const input = { x: inputArray,y:sum };
     console.log('logs', 'Generating proof... ⌛');
      const proof = await noir.generateFinalProof(input);
      console.log('logs', 'Generating proof... ✅');
    setProof(proof.proof);
      console.log("Proof generated : ", proof.proof);
    

    setTimeout(() => {
      if (path.join("-") === "4-1-2") {
        setIsLoading(false);
        setSuccess(true);
        setDisabled(true);
      } else {
        setDisabled(true);
        setError(true);

        setTimeout(() => {       // errorTimeout = setTimeout(() => {
          setDisabled(false);
          setError(false);
          setIsLoading(false);
          setPath([]);
        }, 2000);
      }
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center mt-10 ">
        <div className="p-6  rounded-lg shadow-lg">
          
          <div className="mb-4">
            <PatternLock
              size={3}
              onChange={onChange}
              path={path}
              error={error}
              onFinish={onFinish}
              connectorThickness={5}
              disabled={disabled || isLoading}
              success={success}
            />
          </div>
          
          {success && (
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onReset}
            >
              Click here to reset
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// render(<Demo />, document.getElementById("root"));

export default Pattern;
