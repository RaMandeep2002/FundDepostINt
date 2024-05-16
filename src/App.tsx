import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import metamsklogo from "./SVG_MetaMask_Horizontal_White.svg";
const contractaddress = "0xC8ea1Dd186faAe1595E77DDCD2DB7838939d0815";

const ContractAbi = [
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_targetAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "DepostFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_newtragetaddress",
        "type": "address"
      }
    ],
    "name": "changeAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "targetAddress",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

function App() {
  const [provider, setProvider]: any = useState(null);
  const [contractdeposit, setContractdeposit]: any = useState(null);
  const [account, setAccount]: any = useState('');
  const [walletAddress, setWalletAddress]: any = useState('');
  const [depositamount, setDepositamount] = useState('0');
  const [targetAddress, setTargetAddress] = useState('0');
  useEffect(() => {
    async function init() {
      // Connect to the Ethereum sprovider (e.g., MetaMask)
      if (window.ethereum) {
        const ethereumProvider: any = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const signer = ethereumProvider.getSigner();

        // Create a contract instance
        const stakecontract = new ethers.Contract(
          contractaddress,
          ContractAbi,
          signer
        );

        setProvider(ethereumProvider);
        setContractdeposit(stakecontract);
        // Get the connected account
        const accounts = await ethereumProvider.listAccounts();
        setAccount(accounts[0]);
      } else {
        console.log('Please install MetaMask!');
      }
    }

    init();
  }, []);
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);
  // IN this following fiunction connected the metamask to our Dapp
  const connectWallet = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        // console.log(accounts[0]);
      } catch (error: any) {
        console.error(error.message);
      }
    } else {
      alert('Please Install Metamask!');
    }
  };

  // const disconnectWallet = () => {
  //   setWalletAddress(null); // Clear the wallet address state
  //   alert('Wallet disconnected');
  // };

  // IN this funciton we have  a function that will get current wallet connect
  const getCurrentWalletConnected = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // console.log(accounsts[0]);
        } else {
          alert('Connect to MetaMask using the Connect button');
        }
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      alert('Please install MetaMask');
    }
  };

  const addWalletListener = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      window.ethereum.on('accountsChanged', (accounts: any) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress('');
      alert('Please install MetaMask');
    }
  };

  const depostFunds = async () => {
    try {
      console.log("Enter the deposit")
      const tx: any = await contractdeposit.DepostFunds({
        value: ethers.utils.parseEther(depositamount.toString())
      });
      await tx.wait();
    }
    catch (err: any) {
      console.log(err.message);
    }
  };
  const handleChangeAddress = async () => {
    try {
      const tx = await contractdeposit.changeAddress(targetAddress);
      await tx.wait();
      console.log('Address changed successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className="min-h-screen flex items-center justify-center bg-[#3c3c3c]">
        <div className="bg-[#212121] h-screen p-8  shadow-md w-[500px]">
          <div className="text-center mb-8">
            <div className='p-4'>
              {/* <img src={metamsklogo} alt="MetaMask Logo" className="h-[60px] mx-auto mb-4" /> */}
              <h1 className='text-3xl tracking-widest text-white'> Wallet</h1>
            </div>

            <button
              onClick={connectWallet}
              type="button"
              className="w-full mt-3 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {walletAddress && walletAddress.length > 0
                ? `Connected Account: ${walletAddress.substring(0, 6)}xxx${walletAddress.substring(38)}`
                : 'Connect Wallet'}
            </button>

            {/* <button
              onClick={disconnectWallet}
              type="button"
              className="w-full mt-3 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Disconnect wallet
            </button> */}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl text-white font-bold mb-4">Deposit</h2>
            <form action="">
              <div className="mt-4">

                <label htmlFor="amount" className="block text-white mb-2 text-[20px]">Amount:</label>
                <input
                  type="text"
                  id="amount"
                  className="w-full h-[60px] px-3 py-2 border border-gray-300 bg-[#212121] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter the Amount"
                  onChange={(e) => setDepositamount(e.target.value)}
                />
              </div>
              <div className="mt-8 flex justify-center">
                <input
                  type='reset'
                  value="Cancel"
                  className="w-[200px] text-white py-2 px-4 ml-4 rounded-full outline-none ring-2 ring-white hover:bg-gray-600"
                />
                <button
                  type='button'
                  onClick={depostFunds}
                  className="w-[200px] bg-indigo-500 text-white py-2 px-4 ml-4 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Deposit
                </button>
              </div>
            </form>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl text-white font-bold mb-4">Change Target Address</h2>
            <form action="">
              <div className="mt-4">

                <label htmlFor="amount" className="block text-white mb-2 text-[20px]">Address:</label>
                <input
                  type="text"
                  id="address"
                  className="w-full h-[60px] px-3 py-2 border border-gray-300 bg-[#212121] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0x0000"
                  onChange={(e) => setTargetAddress(e.target.value)}
                />
              </div>
              <div className="mt-8 flex justify-center">
                <input
                  type='reset'
                  value="Cancel"
                  className="w-[200px] text-white py-2 px-4 ml-4 rounded-full outline-none ring-2 ring-white hover:bg-gray-600"
                />
                <button
                  type='button'
                  onClick={handleChangeAddress}
                  className="w-[200px] bg-indigo-500 text-white py-2 px-4 ml-4 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Change Address
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
