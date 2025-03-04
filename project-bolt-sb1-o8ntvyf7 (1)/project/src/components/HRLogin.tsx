import React, { useState } from 'react';
import { KeyRound, AlertCircle } from 'lucide-react';

interface Props {
  onLogin: (code: string) => void;
}

export function HRLogin({ onLogin }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('hr'); // Default to HR

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === 'hr' && code === 'Main123*') {
      onLogin('hr-' + code);
    } else if (userType === 'HR-ENG' && code === 'ENG123*') {
      onLogin('HR-ENG-' + code);
    } else if (userType === 'op-logistic' && code === 'OP123*') {
      onLogin('op-logistic-' + code);
    } else {
      setError('Invalid access code');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <KeyRound className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">System Access</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User Type
          </label>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="userType"
                value="hr"
                checked={userType === 'hr'}
                onChange={() => setUserType('hr')}
              />
              <span className="ml-2">HR (Main)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="userType"
                value="HR-ENG"
                checked={userType === 'HR-ENG'}
                onChange={() => setUserType('HR-ENG')}
              />
              <span className="ml-2">HR-ENG</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="userType"
                value="op-logistic"
                checked={userType === 'op-logistic'}
                onChange={() => setUserType('op-logistic')}
              />
              <span className="ml-2">Op-Logistic</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            {userType === 'hr' ? 'HR Access Code' : 
             userType === 'HR-ENG' ? 'HR-ENG Access Code' : 
             'Op-Logistic Access Code'}
          </label>
          <input
            type="password"
            id="code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Access Dashboard
        </button>
      </form>
    </div>
  );
}