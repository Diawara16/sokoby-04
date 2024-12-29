import React from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDashboard } from "@/components/dashboard/UserDashboard";

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardNavigation />
        </CardContent>
      </Card>
      
      <UserDashboard />
    </div>
  );
};

export default Dashboard;