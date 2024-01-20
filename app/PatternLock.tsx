import React, { useState } from 'react';

interface PatternLockProps {
  onPatternChange: (pattern: number[]) => void;
}

const PatternLock: React.FC<PatternLockProps> = ({ onPatternChange }) => {
  const [selectedDots, setSelectedDots] = useState<number[]>([]);

  const handleDotSelect = (dot: number) => {
    setSelectedDots((prevDots) => [...prevDots, dot]);
  };

  const handlePatternComplete = () => {
    onPatternChange(selectedDots);
    setSelectedDots([]);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: '10px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dot) => (
          <div
            key={dot}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: selectedDots.includes(dot) ? 'blue' : 'gray',
              cursor: 'pointer',
            }}
            onClick={() => handleDotSelect(dot)}
          >
            {dot}
          </div>
        ))}
      </div>
      <button onClick={handlePatternComplete}>Complete Pattern</button>
    </div>
  );
};

export default PatternLock;
