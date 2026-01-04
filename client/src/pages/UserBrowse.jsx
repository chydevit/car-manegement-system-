import React from "react";
import CarList from "../components/CarList";

export default function UserBrowse() {
  return (
    <div className="container">
      <h2 className="text-xl font-semibold mb-3">Browse Cars</h2>
      <CarList />
    </div>
  );
}
