import React from 'react';
import './ActivityFeed.css';

function ActivityFeed({ activities }) {
  return (
    <div className="activity-feed">
      <h3 className="feed-title">Recent Activity</h3>
      <ul className="feed-list">
        {activities.map((activity, index) => (
          <li key={index} className="feed-item">
            <span className="activity-time">{activity.time}</span>
            <span className="activity-description">{activity.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityFeed;