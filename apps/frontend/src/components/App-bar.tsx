import { apiFetch } from '@/lib/api';
import { Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

function Appbar() {
  const [credits, setCredits] = useState(0);

  useEffect(() =>{
    apiFetch("/credits")
    .then((data) => {
      setCredits(data.balance);
    })
  }, [credits])
  return (
    <div className="sticky flex justify-end p-1 w-full mr-9">
      <div className="flex rounded-sm gap-1 border-2 shadow-md justify-center items-center mr-20 bg-neutral-50 px-2">
        <Zap size={16} className="text-yellow-300" />
        <span className="flex justify-end text-md">{credits} Credits</span>
      </div>
    </div>
  );
}

export default Appbar;