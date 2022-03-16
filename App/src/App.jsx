import React,{useEffect,useState} from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';


// Constants
const TWITTER_HANDLE = 'lazybum191';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const contract_address = '0x27E169b7e7ff9F7BbC2FAb1d2C6F3A15f636f11f';
  const [currentAccount,setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log("Make Sure U have MetaMask");
    }else{
      console.log("Eth object:",ethereum);
    }

    const accounts = await ethereum.request({method: 'eth_accounts'});

    if(accounts.length !==0){
      const account = accounts[0];
      console.log("Found an Account:",account);
      setCurrentAccount(account);

      setupEventListener();
    }else{
      console.log("No authorized account");
    }
    
  }

  const connectWallet = async () => {
    try{
      const{ethereum} = window;

      if(!ethereum){
        alert("Get MetaMask");
        return;
      }
      const accounts = await ethereum.request({method:"eth_requestAccounts"});
      console.log('Connected',accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();
      
    }catch(error){
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contract_address, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNftMinted",(from,tokenId) => {
          console.log(from,tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${contract_address}/${tokenId.toNumber()}`)
        });

        console.log("Setup Event Listener");
  }else{
        console.log("Ethereum object doesn't exist!");
  }
    }catch(error){
            console.log(error);
    }
  }


  const askContractToMintNft = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contract_address,myEpicNft.abi,signer);

        console.log("Going to pop wallet for gas");

        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...Please Wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      }else{
          console.log("Ethereum object doesn't exist!");

      }
    }catch(error){
       console.log(error);
    }
  }
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  useEffect( () => {
    checkIfWalletIsConnected();
  },[] )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (renderNotConnectedContainer()):(
            <div className ="btn">
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                Mint NFT
              </button>
              <button className="cta-button opensea-btn" onClick = { () => window.location.assign('https://testnets.opensea.io/collection/baka') }>
                View collection on Opensea
              </button>
            </div>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;