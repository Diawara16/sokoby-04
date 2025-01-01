import React from "react";
import { CustomerDashboard } from "@/components/customers/CustomerDashboard";

export default function Customers() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Clients</h1>
      <CustomerDashboard />
    </div>
  );
}