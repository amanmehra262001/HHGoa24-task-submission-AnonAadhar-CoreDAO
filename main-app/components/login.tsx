import { useGlobalContext } from "@/context/store";
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
  useProver,
} from "@anon-aadhaar/react";
import { deserialize } from "@anon-aadhaar/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const Login = () => {
  const [anonAadhaar] = useAnonAadhaar();
  const { setSigner, setAnonAadhaarCore, address, setAddress } =
    useGlobalContext();
  const [, latestProof] = useProver();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
    console.log("Anon Aadhaar", anonAadhaar);

    const aaObj = localStorage.getItem("anonAadhaar");
    const anonAadhaarProofs = JSON.parse(aaObj!).anonAadhaarProofs;
    if (anonAadhaarProofs === undefined || anonAadhaarProofs.length === 0)
      return;
    deserialize(
      anonAadhaarProofs[Object.keys(anonAadhaarProofs).length - 1].pcd
    ).then((result) => {
      console.log(result);
      setAnonAadhaarCore(result);
    });
  }, [anonAadhaar, latestProof]);

  const handleMetamaskConnect = async () => {
    // Connect Metamask
    console.log("Connecting Metamask...");
    try {
      // @ts-ignore
      await window?.ethereum.request({ method: "eth_requestAccounts" });
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const _signer = await provider.getSigner();
      setSigner(_signer);
      setAddress(await _signer.getAddress());
      console.log("Metamask connected");
    } catch (error) {
      alert("Failed to connect Metamask");
      console.error("Failed to connect Metamask", error);
    }
  };

  return (
    <>
      <section id="nav" className="flex w-full justify-between">
        <div>
          <LogInWithAnonAadhaar nullifierSeed={1234} />
          <p>{anonAadhaar?.status}</p>
        </div>
        <div>
          {/* Render the proof if generated and valid */}
          {anonAadhaar?.status === "logged-in" && (
            <div>
              <p>✅ Proof is valid</p>
              <AnonAadhaarProof
                // @ts-ignore
                code={JSON.stringify(anonAadhaar.anonAadhaarProof, null, 2)}
              />
            </div>
          )}
        </div>
        <div>
          {address.length > 0 ? (
            <p className="p-2 bg-yellow-500 rounded-lg">
              {address.slice(0, 6)}...{address.slice(-6)}
            </p>
          ) : (
            <button
              className="p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg"
              onClick={handleMetamaskConnect}
            >
              Connect Metamask
            </button>
          )}
        </div>
      </section>
    </>
  );
};
