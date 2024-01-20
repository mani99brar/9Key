import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Button } from "@/components/ui/button";

interface ApproveProps {
  sum: number;
  amount: number;
  deadline: number;
  v: number;
  r: string;
  s: string;
}

function Approve({ sum, amount, deadline, v, r, s } : ApproveProps) {
  
  return (
    <div>
      <Button onClick={() => console.log("Register")}>registerAndApprove</Button>
      
    </div>
  )
}

export default Approve;