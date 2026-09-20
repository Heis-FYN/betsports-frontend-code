import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/legacy.html");
  }, []);

  return <div className="min-h-screen bg-black" aria-label="Loading BetSports" />;
}
