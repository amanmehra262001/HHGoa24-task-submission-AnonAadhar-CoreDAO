import { useGlobalContext } from "@/context/store";
import {
  DEMO_AADHAAR_VERIFIER_ADDRESS,
  PARENT_CONTRACT_ADDRESS,
} from "@/utils/constant";
import { PARENT_CONTRACT_ABI } from "@/utils/parent-contract-abi";
import { CHILD_CONTRACT_ABI } from "@/utils/child-vote-contract-abi";
import { CHILD_CONTRACT_BYTECODE } from "@/utils/child-vote-contract-bytecode";
import { ethers } from "ethers";
import React, { useState } from "react";

export const PostVote = () => {
  const { signer } = useGlobalContext();
  const [subject, setSubject] = useState("");
  const [votes, setVotes] = useState([""]);

  const handleSubjectChange = (e: any) => {
    setSubject(e.target.value);
  };

  const handleVoteChange = (index: any, event: any) => {
    const newVotes = [...votes];
    newVotes[index] = event.target.value;
    setVotes(newVotes);
  };

  const addVoteField = () => {
    setVotes([...votes, ""]);
  };

  const handleSubmit = async () => {
    const postData = {
      subject,
      votes,
    };
    console.log(postData);

    try {
      // call the function via signer
      const contract = new ethers.Contract(
        PARENT_CONTRACT_ADDRESS,
        PARENT_CONTRACT_ABI,
        signer
      );

      const tx = await contract.launchVote(subject, votes, {
        gasLimit: 5000000,
      });
      console.log("tx", tx);

      const receipt = await tx.wait();
      console.log("receipt", receipt);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <section className="flex flex-col w-full">
      <p className="text-xl font-bold">Post Vote</p>
      <div className="flex w-full justify-between gap-2">
        <input
          type="text"
          className="bg-transparent border border-gray-700 rounded-lg w-10/12 p-2"
          placeholder="Enter Subject"
          value={subject}
          onChange={handleSubjectChange}
        />
        <button
          className="bg-gray-600 hover:bg-gray-700 rounded-lg w-2/12 p-2"
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
      <div
        id="votes"
        className="flex gap-x-2 overflow-x-scroll scrollbarWidth py-4"
      >
        {votes.map((vote, index) => (
          <input
            key={index}
            type="text"
            className="bg-transparent border border-gray-700 rounded-lg p-2"
            placeholder={`Proposal ${index + 1}`}
            value={vote}
            onChange={(e) => handleVoteChange(index, e)}
          />
        ))}
        <button
          className="bg-gray-600 hover:bg-gray-700 rounded-lg p-2 w-32"
          onClick={addVoteField}
        >
          Add Vote
        </button>
      </div>
    </section>
  );
};
