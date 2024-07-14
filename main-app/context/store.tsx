"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface Props {
  signer: any;
  setSigner: Dispatch<SetStateAction<any>>;
  anonAadhaarVerifierAddress: string;
  setAnonAadhaarVerifierAddress: Dispatch<SetStateAction<string>>;
  anonAadhaarCore: any;
  setAnonAadhaarCore: Dispatch<SetStateAction<any>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<Props | undefined>({
  signer: null,
  setSigner: () => {},
  anonAadhaarVerifierAddress: "",
  setAnonAadhaarVerifierAddress: () => {},
  anonAadhaarCore: null,
  setAnonAadhaarCore: () => {},
  address: "",
  setAddress: () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [signer, setSigner] = useState<any>(null);
  const [anonAadhaarVerifierAddress, setAnonAadhaarVerifierAddress] =
    useState<string>("");
  const [anonAadhaarCore, setAnonAadhaarCore] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  return (
    <GlobalContext.Provider
      value={{
        signer,
        setSigner,
        anonAadhaarVerifierAddress,
        setAnonAadhaarVerifierAddress,
        anonAadhaarCore,
        setAnonAadhaarCore,
        address,
        setAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
