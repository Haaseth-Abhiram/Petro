import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRootPage() {
  return <Navigate to="/admin/dashboard" replace />;
}
