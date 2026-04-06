import Chat from "./components/chat";

export default function Home() {
  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Chat />
    </main>
  );
}
