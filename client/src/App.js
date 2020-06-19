  import 'bootstrap/dist/css/bootstrap.min.css';
  import React, { Component } from "react";
  import Splitter from "./contracts/Splitter.json";
  import getWeb3 from "./getWeb3";
  import Container from 'react-bootstrap/Container';
  import Button from 'react-bootstrap/Button';
  import ButtonToolbar from "react-bootstrap/ButtonToolbar";
  import Card from 'react-bootstrap/Card';
  import MetaMaskLogo from './download-metamask.png'

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
        userBal: 0,
        contractBal: 0, 
        withdrawAmount: 0
      }
    }

    componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts()
        
        // Get the contract instance.
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = Splitter.networks[networkId];
        const instance = new web3.eth.Contract(
          Splitter.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance, address: deployedNetwork.address }, () => {
          this.handleContractBalance()
          this.handleRecipientBalance()
        });

      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error)
      }
    };

  handleContractBalance = async () => {
    const { web3, address } = this.state
    const balance = await web3.eth.getBalance(address)
    const contractBalance = web3.utils.fromWei(balance, 'ether')
    this.setState({ contractBal: contractBalance })
  }

  handleRecipientBalance = async () => {
    const { accounts, web3 } = this.state;
    const userAccount = await web3.eth.getBalance(accounts[0])
    const userBalance = web3.utils.fromWei(userAccount, 'ether')
    // let bobBalance = await web3.eth.getBalance(bob);
    // bobBalance = web3.utils.fromWei(bobBalance, 'ether');
    // let carolBalance = await web3.eth.getBalance(carol);
    // carolBalance = web3.utils.fromWei(carolBalance, 'ether');
    this.setState({ userBal: userBalance })
  }

  handleUpdateBalance = async () => {
    this.handleRecipientBalance()
    this.handleContractBalance()
  }

  handleInput = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  };

  handleSplit = async () => {
    const { accounts, contract, bob, carol, amount, web3 } = this.state
    const ethAmount = web3.utils.toWei(amount)
    try {
      const splitSuccess = await contract.methods
        .split(bob, carol)
        .call({from: accounts[0],value: ethAmount})

      if (splitSuccess) {
        await contract.methods
          .split(bob, carol)
          .send({from: accounts[0], value: ethAmount})
          .then(console.log)
          // Need to check these further .on()
          .on('transactionHash on its way', txHash => this.setState({ txHash: txHash }))
          .on('receipt', receipt => this.setState({ txReceipt: receipt}))

        this.handleUpdateBalance()
      }
    } catch(err) {
      alert('Split failed!')
      console.log(err)
    }
  }

  handleWithdraw = async () => {
    const { accounts, contract } = this.state
    await contract.methods.withdraw().send({from: accounts[0]}).then(console.log)
    this.handleUpdateBalance()
  }
  
  render() {
    if (!this.state.web3) {
      return <div className="Wait">Wait... Now don't get hastey!</div>;
    }
      return (
        <Container className="text-center">
          <h1>SPLITTER</h1>
          <Container>
            <Card>
              <Card.Header className="text-center">
                <h3>Contract Balance: <span className="badge badge-secondary">{this.state.contractBal}</span> ETH </h3>
                <hr style={{ width:"95%" }}/>
                <h3>Account: <span className="badge badge-secondary">{this.state.accounts[0]}</span></h3>
                <hr style={{ width:"95%" }}/>
                <h3>User Balance: <span className="badge badge-secondary">{this.state.userBal}</span> ETH </h3>
              </Card.Header>

              {/* Recipient 1 Input */}
              <div style={{ padding: "2%" }}>
              <Card.Title className="text-center"><label htmlFor="bob">Recipient 1: </label></Card.Title>
                <input
                  autoComplete="off"
                  name="bob"
                  className="form-control text-center"
                  id="bob"
                  onChange={this.handleInput}
                  style={{width: "95%", margin: "auto"}}
                  placeholder="Example Ethereum Address: 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
                />
              </div>
              {/* Recipient 2 Input */}
              <div style={{ padding: "2%" }}>
                <Card.Title className="text-center"><label htmlFor="carol">Recipient 2: </label></Card.Title>
                <input
                  autoComplete="off"
                  name="carol"
                  className="form-control text-center"
                  id="carol"
                  onChange={this.handleInput}
                  style={{width: "95%", margin: "auto"}}
                  placeholder="Example Ethereum Address: 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
                />
              </div>
              {/* Split Amount Input */}
              <div style={{ padding: "2%" }}>
                <Card.Title className="text-center"><label htmlFor="amount">Split Amount (Ξ): </label></Card.Title>
                <input
                  className="form-control text-center"
                  id="amount"
                  onChange={this.handleInput}
                  style={{width: "95%", margin: "auto" }}
                  autoComplete="off"
                  name="amount"
                  placeholder="Amount to split in ETH"
                />
              </div>
            </Card>
          </Container>

          <Container>
            {/* Split Button */}
            <ButtonToolbar>
              <Button variant="warning" size="lg" block
                onClick={ this.handleSplit }>SPLIT <span role="img" aria-label="sheep">✂️</span>
              </Button>
            </ButtonToolbar>

            {/* Withdraw Button */}
            <ButtonToolbar>
              <Button size="lg" block
                htmlFor="withdrawAmount" 
                variant="danger"
                onClick={this.handleWithdraw}>WITHDRAW <span role="img" aria-label="sheep">💰</span>
              </Button>
            </ButtonToolbar>
          </Container>

          <Container>
            <Card>
              {/* Instructions */}
              <Card.Body>
                The contract Splitter is used to split funds 
                from the sender in two equal parts and then 
                distribute them to Recipient 1 and Recipient 2. 
                If the amount sent to be split is not 
                devisible by 2, then the remainder will 
                be refunded back to the senders address.
                A push, pull method has been used to deny 
                re-entry attacks. Currently, this contract is only usable in the Ethereum world.
              </Card.Body>
            </Card>
          </Container>

          <Container>
            <br />
            <a href='https://metamask.io/'>
              <img src={MetaMaskLogo} alt='MetaMask Download' />
            </a>
          </Container>
        </Container>
      )
    }
  }

  export default App;
