import React, {useState, useEffect} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/contractABI.json'

const contractAddress = "0xC003E805F17daA13eCA559Fc150458a005ae77f8";
const contractABI = abi.abi;

export default function App() {
  const [currAccount, setCurrAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [allHellos, setAllHellos] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return;
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        setCurrAccount(accounts[0]);
        getAllHellos();
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
  
  const wave = async message => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const helloContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let count = await helloContract.getTotalHellos();
        console.log("Retrieved total wave count...", count.toNumber());

        const helloTxn = await helloContract.sayHello(message);
        console.log("Mining...", helloTxn.hash);

        await helloTxn.wait();
        console.log("Mined -- ", helloTxn.hash);

        count = await helloContract.getTotalHellos();
        console.log("Retrieved total greeting count...", count.toNumber());

        setMessage("");

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formatHellos = hellos => {
    const formattedHellos = [];

    hellos.forEach(hello => {
      formattedHellos.push({
        address: hello.waver,
        timestamp: new Date(hello.timestamp * 1000),
        message: hello.message
      })
    })
    return formattedHellos;
  }

  const getAllHellos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const helloContract = new ethers.Contract(contractAddress, contractABI, signer); 

        const hellos = await helloContract.getAllHellos();
        setAllHellos(formatHellos(hellos));

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.log(err)
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
        <form className="greetingForm" onSubmit={e => e.preventDefault()}>
          <input 
            type='text'
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button className="waveButton" onClick={() => wave(message)}>
            Say Hello!
          </button>
        </form>
        :
        <button className="waveButton" onClick={connectWallet}>
          Connect Your Wallet!
        </button>
        }

        <div className="newestHelloContainer">
          <h1>Most recent hello</h1>
          {
            allHellos.length ?
            <div>
              <div>Address: {allHellos[allHellos.length - 1].address}</div>
              <div>Time: {allHellos[allHellos.length - 1].timestamp.toString()}</div>
              <div>Message: {allHellos[allHellos.length - 1].message}</div>
            </div>
            :
            <p>No hello's yet :(</p>
          }
        </div>
        {allHellos.map((hello, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {hello.address}</div>
              <div>Time: {hello.timestamp.toString()}</div>
              <div>Message: {hello.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
