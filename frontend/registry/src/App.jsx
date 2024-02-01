import { useState } from 'react'
import './App.css'

import { ethers, BrowserProvider } from "ethers";
import abi from "./abi.json";
import contractAddress from "./contract";

function App() {
  const [contract, setContract] = useState(undefined)
  const [address, setAddress] = useState("")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const contractAbi = abi;


  async function setupContract() {
    if (typeof window.ethereum !== "undefined") {
      const address = await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      setAddress(address);
      setContract(contract);
    }
  }

  async function entityDetails() {
    try {
      const tx = await contract.getEntityDetails();

      setName(tx[0])
      setAge(tx[1].toString())
    } catch (err) {
      alert(err)
    }
  }

  async function updateName() {
    const nameInput = document.getElementById("fName");

    try {
      if (nameInput.value !== "") {
        let tx = await contract.updateName(nameInput.value);
        tx.wait();
        nameInput.value = "";
      } else {
        throw Error("Enter name value")
      }
    } catch (err) {
      alert(err)
    }
  }

  async function updateAge() {
    const ageInput = document.getElementById("fAge");

    try {
      if (ageInput.value !== "") {
        let tx = await contract.updateAge(ageInput.value);
        tx.wait();
        ageInput.value = "";
      } else {
        throw Error("Enter age value")
      }
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      <div id="smartcontract">
        {address == "" ? <button onClick={setupContract}>Connect Wallet</button> : <p>Address: {address}</p>}
        <br />
      </div>

      {address != "" ? <div id="entity">
        <p>Name: {name}</p>
        <p>Age: {age}</p>
      </div> : null}

      {
        address != "" ?
          <div id="form">
            <input id="fName" placeholder='Enter name'></input> <input className="btn" type="button" value="Update name" onClick={updateName} /><br />
            <input id="fAge" placeholder='Enter age'></input> <input className="btn" type="button" value="Update age" onClick={updateAge} /><br />
          </div>
          : null
      }

      { address != "" ? <div><input className="btn" type="button" value="Get details" onClick={entityDetails}></input></div> : null }
    </>
  )
}

export default App
