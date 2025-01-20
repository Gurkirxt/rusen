import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./input.css";
import { Button } from "@/components/ui/button"


function App() {

  return (
    <>
      <Button variant="secondary" className="bg-red-50">Secondary</Button>
    </>
  );
}

export default App;
