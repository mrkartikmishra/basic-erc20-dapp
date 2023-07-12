import { useEffect, useRef, useState } from "react";
import { Contract, ethers } from "ethers";
import Web3Modal from "web3modal";
import { Toaster, toast } from "react-hot-toast";

import { CONTRACT_ADDRESS, ABI, SEPOLIA_CHAIN_ID } from "./constant.js";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAcount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const web3ModalRef = useRef();

  useEffect(() => {
    if (!isConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [isConnected]);

  const getProviderOrSigner = async (needSigner) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== SEPOLIA_CHAIN_ID) {
      alert("Please select Sepolia Network to continue!!");
      throw new Error("Change to Sepolia network!!");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const onConnectHandler = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const currentWalletAddress = await signer.getAddress();
      setCurrentAcount(currentWalletAddress);
      setIsConnected(true);
      getAccountBalance(currentWalletAddress);
    } catch (err) {
      console.log("Error connecting Wallet::", err);
    }
  };

  const getAccountBalance = async (accountAddress) => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
      const accountBalance = await contract.balanceOf(
        accountAddress.toString()
      );
      setAccountBalance(ethers.utils.formatEther(accountBalance.toString()));
    } catch (err) {
      console.log("Error fetching account balance:", err);
    }
  };

  const onDisconnectHandler = () => {
    setIsConnected(false);
  };

  const onChangeToAdresshandler = (e) => {
    setToAddress(e.target.value);
  };

  const onChangeTokenAmountHandler = (e) => {
    setTokenAmount(e.target.value);
  };

  const onSendTokenhandler = async () => {
    if (toAddress === "") {
      toast.error("Address is empty");
      return;
    }

    if (parseInt(tokenAmount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const parsedAmount = ethers.utils.parseEther(tokenAmount.toString());

    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      const result = await contract.transfer(toAddress, parsedAmount);
      setLoading(true);
      await result.wait();
      setLoading(false);
      toast.success(
        (res) => (
          <p>
            Transaction mined Successfully!! Check status
            <a
              rel="noreferer"
              target="_blank"
              className="ml-2 text-blue-800"
              href={`https://sepolia.etherscan.io/tx/${result.hash}`}
            >
              here
            </a>
          </p>
        ),
        { duration: 5000 }
      );

      getAccountBalance(currentAccount);
      setToAddress("");
      setTokenAmount(0);
    } catch (err) {
      console.log("Error transfering Token:", err);
    }
  };

  return (
    <div className="App flex items-center justify-center">
      <Toaster />
      {!isConnected ? (
        <div className="flex items-center justify-center">
          <button
            onClick={onConnectHandler}
            className="flex items-center justify-center gap-3 font-semibold bg-lime-600 border-2 border-lime-900 rounded-lg p-1 w-[200px] hover:bg-lime-700 hover:text-white duration-200"
          >
            <img
              width={25}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png?20220831120339"
            />
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
          <div className="font-bold flex items-center justify-center px-2 w-full">
            <div className="w-[600px] h-[200px] border-2 border-lime-900 rounded-lg shadow-md shadow-black p-2">
              <div className="text-slate-800 text-lg text-center">
                <b>Balance:</b> {accountBalance} CTK
              </div>
              <div className="p-2 text-lg flex items-center">
                Address:
                <input
                  type="text"
                  placeholder="to address"
                  className="bg-transparent text-slate-800 ml-2 border border-slate-800 focus:outline-none rounded-md px-1 text-md w-[80%] placeholder:text-slate-700"
                  value={toAddress}
                  onChange={onChangeToAdresshandler}
                />
              </div>
              <div className="p-2 text-lg flex items-center">
                Amount:
                <input
                  type="number"
                  placeholder="amount"
                  className="bg-transparent text-slate-800 ml-2 border border-slate-800 focus:outline-none rounded-md px-1 text-md w-[80%] placeholder:text-slate-700"
                  value={tokenAmount}
                  onChange={onChangeTokenAmountHandler}
                />
              </div>
              <div className="p-2 flex items-center justify-center text-lg">
                <button
                  onClick={onSendTokenhandler}
                  className="bg-tranparent border-2 border-lime-900 rounded-lg p-1 w-1/2 hover:bg-lime-600 hover:text-white duration-200"
                >
                  {loading ? "Transferring..." : "Send Token"}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-lime-800">
              "Cryptokenium(CTK)"
            </h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
