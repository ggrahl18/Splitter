import React, { Component } from "react";
import Splitter from "./contracts/Splitter.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = { 
      web3: null,
      address: null,
      accounts: null,
      contract: null,
      amount: 0,
      bob: null,
      carol: null,
      contractBal: 0, 
      withdrawAmount: 0
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Splitter.networks[networkId];
      const instance = new web3.eth.Contract(
        Splitter.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, address: deployedNetwork.address }, () => {
        this.handleContractBalance();
      });
     
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

handleContractBalance = async () => {
  let { web3, address } = this.state;
  let balance = await web3.eth.getBalance(address);
  let contractBalance = web3.utils.fromWei(balance, 'ether');
  this.setState({ contractBal: contractBalance});
}

handleInput = (event) => {
  this.setState({ [event.target.name]: event.target.value });
};

handleSplit = async () => {
  let { accounts, contract, bob, carol, amount, web3 } = this.state;
  const ethAmount = web3.utils.toWei(amount);
  try {
    await contract.methods.split(bob, carol).send({
      from: accounts[0],
      value: ethAmount,
    })
  } catch(err) {
    console.log(err)
  }
}

handleWithdraw = async () => {
  let { accounts, contract } = this.state;
  // let { accounts, contract, web3, withdrawAmount } = this.state;
  // let amount = web3.utils.toWei(withdrawAmount, 'ether');
  // console.log(amount)
  await contract.methods.withdraw().send({
    from: accounts[0]
  }).then(console.log);
  // });
}

render() {
  if (!this.state.web3) {
    return <div className="Wait">Wait for it... Wait for it... WAIT!</div>;
  }
    return (
      <div className="App">
        <h1>SPLITTER</h1>
        <h2>Contract Balance: <span className="badge badge-secondary">{this.state.contractBal}</span> ETH </h2>
        <form className="split-form">
        <h2>Split Form</h2>
        <hr></hr>
        <div className="form-contents">
          <label htmlFor="bob">Recipient 1: </label>
          <input
            autoComplete="off"
            name="bob"
            className="form-control"
            id="bob"
            onChange={this.handleInput}
          />
          <label htmlFor="carol">Recipient 2: </label>
          <input
            autoComplete="off"
            name="carol"
            className="form-control"
            id="carol"
            onChange={this.handleInput}
          />
          <label htmlFor="amount">Split Amount (Ξ): </label>
          <input
            autoComplete="off"
            name="amount"
            className="form-control"
            id="amount"
            onChange={this.handleInput}
          />
        </div>
        </form>

        <div className="buttons-container">
          <button 
          className="btn btn-primary"
          onClick={this.handleSplit}>
          SPLIT <span role="img" aria-label="sheep">✂️</span>
          </button>

          <button 
          htmlFor="withdrawAmount"
          className="btn btn-success"
          onClick={this.handleWithdraw}>
            WITHDRAW <span role="img" aria-label="sheep">💰</span>
          </button>
        </div>
        <div className="split-form">
          <p>
            The contract Splitter is used to split funds 
            from the sender in two equal parts and then 
            distribute them to Recipient 1 and Recipient 2. 
            If the amount sent to be split is not 
            devisible by 2, then the remainder will 
            be refunded back to the senders address.
            A push, pull method has been used to deny 
            re-entry attacks.
          </p>
        </div>
    </div>
    );
  }
}

export default App;