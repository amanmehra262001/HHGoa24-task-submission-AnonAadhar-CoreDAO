import Image from "next/image";
import { Inter } from "next/font/google";
import { PostVote } from "@/components/post-vote";
import { Login } from "@/components/login";
import { Votes } from "@/components/votes";
import { useEffect, useState } from "react";
import { PARENT_CONTRACT_ABI } from "@/utils/parent-contract-abi";
import { PARENT_CONTRACT_ADDRESS } from "@/utils/constant";
import { useGlobalContext } from "@/context/store";
import { ethers } from "ethers";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { signer } = useGlobalContext();
  const [allVoteAddresses, setAllVoteAddresses] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching all votes");
    if (signer !== null) {
      fetchAllVotes();
    }
  }, [signer]);

  const fetchAllVotes = async () => {
    console.log("Fetching all votes in function");
    const contract = new ethers.Contract(
      PARENT_CONTRACT_ADDRESS,
      PARENT_CONTRACT_ABI,
      signer
    );

    const votes = await contract.getAllVotes();
    console.log("Votes:", votes);
    setAllVoteAddresses(votes);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Login />
      <PostVote />
      <Votes voteAddresses={allVoteAddresses} />
    </main>
  );
}
