// src/components/Dashboard.jsx
import React from 'react';
import StatisticsCard from './StatisticsCard';;
import ActivityFeed from './ActivityFeed';
import './Dashboard.css';

function Dashboard() {
  // Placeholder data
  const statsData = [
    { title: "Total Users", value: "1,234", icon: "👥" },
    { title: "Revenue", value: "$12,345", icon: "💰" }
  ];
  
  const activityData = [
    { time: "Today, 2:30 PM", description: "John Doe created a new account" },
    { time: "Today, 1:15 PM", description: "Jane Smith made a purchase" },
    { time: "Yesterday, 4:45 PM", description: "Mike Johnson submitted a report" }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">My Dashboard</h1>
      
      <div className="stats-container">
        {statsData.map((stat, index) => (
          <StatisticsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      
      <div className="feed-container">
        <ActivityFeed activities={activityData} />
      </div>
    </div>
  );
}

export default Dashboard;