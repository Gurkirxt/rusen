import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./input.css";
import Sidebar from "@/components/page/sidebar"

function App() {

  return (
    <>
      <Sidebar></Sidebar>
    </>
  );
}

export default App;
