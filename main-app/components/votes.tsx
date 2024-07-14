import { Vote } from "./vote";

export const Votes = ({ voteAddresses }: { voteAddresses: Array<string> }) => {
  return (
    <section className="flex flex-col w-full">
      <p className="text-xl font-bold">Open Topics</p>
      {voteAddresses.map((address) => (
        <Vote voteAddress={address} key={address} />
      ))}
    </section>
  );
};
