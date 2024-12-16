import React from "react";
import RawMaterial from "./components/RawMaterial";
import CreatePOForm from "./components/CreatePOForm";
import ApprovePO from "./components/ApprovePO";
import ListPO from "./components/ListPO";

export default function App() {
  return (
    <div>
      <CreatePOForm />
      <ListPO/>
    </div>
  );
}
