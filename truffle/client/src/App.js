import React, { Component } from "react";
import Box from "./contracts/Box.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: "", inputValue: "", web3: null, currentAccount: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0]

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Box.networks[networkId];
      const instance = new web3.eth.Contract(
        Box.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, currentAccount,　accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { currentAccount, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: currentAccount });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  runUpdateContract = async (text) => {
    const { accounts, contract } = this.state;

    try {
      let option = {
        from: this.state.currentAccount
      };
      await contract.methods.update(text).send(option);
    } catch (err) {
      console.log(err);
    }
  };

  runGetContract = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleSubmit = (event) => {
    alert('form submitted: ' + this.state.inputValue);

    const msgString = this.state.inputValue;

    if(!msgString){
      return window.alert("MESSAGE VALUE IS EMPTY");
    } 

    this.runUpdateContract(msgString);
    
    event.preventDefault();
  } 

  handleChange = (event) => {
    this.setState({inputValue: event.target.value});
  }

  onClick = () => {
    this.runGetContract();
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Smart Contract Example</h1>
        <p>You are {this.state.currentAccount}, right?</p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Submit"/>
        </form>        
        <div>The stored value is: {this.state.storageValue}</div>
        <button onClick={this.onClick}>Update</button>
      </div>
    );
  }
}

export default App;
