import { useState } from "react";
import "./App.css";

function App() {
  const [isConnected, setisConnected] = useState(true);

  const onConnectHandler = () => {
    setisConnected(true);
  };

  const onDisconnectHandler = () => {
    setisConnected(false);
  };

  return (
    <div className="App flex items-center justify-center">
      {!isConnected ? (
        <div className="flex items-center justify-center">
          <button
            onClick={onConnectHandler}
            className="font-semibold bg-lime-600 border-2 border-lime-900 rounded-lg p-1 w-[200px] hover:bg-lime-700 hover:text-white duration-200"
          >
            Connect
          </button>
        </div>
      ) : (
        <div className="App flex flex-col-reverse items-center justify-center gap-10">
          <div>
            <button
              className="underline font-semibold"
              onClick={onDisconnectHandler}
            >
              Disconnect
            </button>
          </div>
          <div className="font-bold flex items-center justify-center px-2">
            <div className="w-[600px] h-[200px] border-2 border-lime-900 rounded-lg shadow-md shadow-black p-2">
              <div className="text-slate-800 text-lg text-center">
                <b>Token Balance:</b> 9829892 KTM
              </div>
              <div className="p-2 text-lg flex items-center">
                Address:
                <input
                  type="text"
                  placeholder="to address"
                  className="bg-transparent text-slate-800 ml-2 border border-slate-800 focus:outline-none rounded-md px-1 text-md w-[80%] placeholder:text-slate-700"
                />
              </div>
              <div className="p-2 text-lg flex items-center">
                Amount:
                <input
                  type="number"
                  placeholder="amount"
                  className="bg-transparent text-slate-800 ml-2 border border-slate-800 focus:outline-none rounded-md px-1 text-md w-[80%] placeholder:text-slate-700"
                />
              </div>
              <div className="p-2 flex items-center justify-center text-lg">
                <button className="bg-tranparent border-2 border-lime-900 rounded-lg p-1 w-1/2 hover:bg-lime-600 hover:text-white duration-200">
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
