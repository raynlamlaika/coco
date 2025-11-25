import React from 'react';
import Card from '../../components/common/Card';

const Messages: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">
          Chat with drivers and passengers on your trips.
        </p>
      </div>

      <Card>
        <Card.Body className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Messages will appear here once you join or create a trip.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Messages;
