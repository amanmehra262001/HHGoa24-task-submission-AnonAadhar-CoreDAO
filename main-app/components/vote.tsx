import { useGlobalContext } from "@/context/store";
import { CHILD_CONTRACT_ABI } from "@/utils/child-vote-contract-abi";
import { Proposal } from "@/utils/constant";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { packGroth16Proof } from "@anon-aadhaar/core";

export const Vote = ({ voteAddress }: { voteAddress: string }) => {
  const { signer, anonAadhaarCore, address } = useGlobalContext();
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [votingQuestion, setVotingQuestion] = useState("");

  useEffect(() => {
    if (voteAddress && voteAddress !== "") fetchVoteDetails(voteAddress);
  }, [voteAddress]);

  const fetchVoteDetails = async (voteAddress: string) => {
    try {
      const contract = new ethers.Contract(
        voteAddress,
        CHILD_CONTRACT_ABI,
        signer
      );

      const proposalsCount = await contract.getProposalCount();
      console.log("proposalsCount", proposalsCount);

      const proposals = [];
      for (let i = 0; i < proposalsCount; i++) {
        proposals.push(await contract.getProposal(i));
      }
      console.log("proposals", proposals);
      setProposals(proposals);

      const votingQuestion = await contract.votingQuestion();
      console.log("votingQuestion", votingQuestion);
      setVotingQuestion(votingQuestion);
    } catch (error) {
      console.log("error while fetching vote details", error);
    }
  };

  const handleClick = async (index: number) => {
    await voteForProposal(index);
    await fetchVoteDetails(voteAddress);
  };

  const voteForProposal = async (proposalIndex: number) => {
    try {
      const contract = new ethers.Contract(
        voteAddress,
        CHILD_CONTRACT_ABI,
        signer
      );

      const nullifierSeed = anonAadhaarCore?.proof.nullifierSeed;
      const nullifier = anonAadhaarCore?.proof.nullifier;
      //   const timestamp = anonAadhaarCore?.proof.timestamp;
      const timestamp = "1720943882";
      const signal = address;
      const revealArray = [
        anonAadhaarCore.proof.ageAbove18,
        anonAadhaarCore.proof.gender,
        anonAadhaarCore.proof.pincode,
        anonAadhaarCore.proof.state,
      ];
      const packedGroth16Proof = packGroth16Proof(
        anonAadhaarCore?.proof.groth16Proof
      );

      console.log("proposalIndex", proposalIndex);
      console.log("nullifierSeed", nullifierSeed);
      console.log("nullifier", nullifier);
      console.log("timestamp", timestamp);
      console.log("signal", signal);
      console.log("revealArray", revealArray);
      console.log("packedGroth16Proof", packedGroth16Proof);

      const tx = await contract.voteForProposal(
        proposalIndex,
        nullifierSeed,
        nullifier,
        timestamp,
        signal,
        revealArray,
        packedGroth16Proof,
        { gasLimit: 1000000 }
      );
      console.log("tx", tx);

      const receipt = await tx.wait();
      console.log("receipt", receipt);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div
      key={voteAddress}
      className="flex flex-col w-full p-4 my-4 border border-gray-300 rounded-md"
    >
      <div className="flex justify-between gap-4">
        <p className="text-lg font-medium">{votingQuestion || ""}</p>
        <p className="text-lg font-medium">
          {voteAddress.slice(0, 6)}...{voteAddress.slice(-6)}
        </p>
      </div>
      <section className="flex gap-2 overflow-x-scroll scrollbarWidth">
        {proposals.map((proposal, index) => (
          <div
            key={index}
            className="flex flex-col p-4 my-4 border border-gray-300 rounded-md min-w-52 cursor-pointer hover:bg-gray-100 hover:text-gray-800"
            onClick={() => handleClick(index)}
          >
            <p className="text-lg font-medium">{proposal[0]}</p>
            <p className="text-lg font-medium">
              Votes: {parseInt(proposal[1]) || 0}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};
