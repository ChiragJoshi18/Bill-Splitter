import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import CreateGroupForm from './CreateGroupModal';

const GroupList = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Head title="Your Groups" />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Groups</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Create New Group'}
        </button>

        {showForm && <CreateGroupForm onCreated={() => setShowForm(false)} />}

        {/* TODO: Display list of groups (in future after API setup) */}
        <p className="text-gray-600 mt-8">Group list will appear here...</p>
      </div>
    </>
  );
};

export default GroupList;
