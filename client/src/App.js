import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/contractABI.json'

export default function App() {

  const contractAddress = "0xC003E805F17daA13eCA559Fc150458a005ae77f8";
  const contractABI = abi.abi;
  
  const [currAccount, setCurrAccount] = useState(null);
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        setCurrAccount(accounts[0])
      } else {
        console.log("No authorized account found")
      }
    } catch(err) {
      console.log(err);
    }
    
  }
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrAccount(accounts[0]); 
  
    } catch (err) {
      console.log(err)
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected()
  })
  
  const wave = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let count = await wavePortalContract.getTotalHellos();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 What's up Metaverse?
        </div>

        <div className="bio">
        I'm Zoheb, a full-stack developer who is passionate about finding solutions to problems! You got a problem? I'm here to solve it!
        </div>

        {currAccount ? 
        <button className="waveButton" onClick={wave}>
          Say Hello!
        </button>
        :
        <button className="waveButton" onClick={connectWallet}>
          Connect Your Wallet!
        </button>
        }

        <div className="newestHelloContainer">
          <h1>Most recent hello</h1>
          <p>No hello's yet :(</p>
        </div>
      </div>
    </div>
  );
}
