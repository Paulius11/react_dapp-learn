import React, { useState, useEffect } from "react";

import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for transaction...");

    // gonna take 10-15s to process
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  };

  const pickWinner = async () => {
    
    setMessage("Waiting for transaction...");
    
    const accounts = await web3.eth.getAccounts();  
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    setMessage("Winner has been picked!");

  }

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    }
    fetchData();
  }, []);

  return (
    <div>
      <span>
        web3 version: {web3.version} {web3.version.getNetwork}{" "} <br/>
        Works on Robsten network
      </span>
      <h2> Lottery contract</h2>
      <p>
        Manager public key: {manager}
        <br />
        There are currently {players.length} people competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />
      <form onSubmit={onSubmit}>
        <h4>Whant to try your luck?</h4>
        <div>
          <label>Amount of eher to enter</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <button> Enter</button>
      </form>
      
      <hr />
        <h4>Pick a winner</h4>
        <button onClick={pickWinner}>Pick a winner</button>
      <hr />


      <h1>{message}</h1>
    </div>
  );
}

export default App;
