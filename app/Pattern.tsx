import { useState } from "react";
import PatternLock from "react-pattern-lock";

const Pattern = () => {
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

  const onFinish = () => {
    setIsLoading(true);
    console.log(path);    
    // an imaginary api call
    console.log(path.join(", "));
    

    setTimeout(() => {
      if (path.join("-") === "0-1-2") {
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
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
          <p className="text-white">Enter Pattern:</p>
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
          <div className="text-center text-white">
            Select the top 3 points starting from the left
          </div>
          <div className="text-center text-white">
            Output : {path.join(", ")}
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
