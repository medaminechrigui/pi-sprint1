import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { token, currentUser, logout } = useAuth();
  const [recettes, setRecettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecettes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recettes', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          navigate('/signin');
        }
        throw new Error('Failed to fetch recettes');
      }
      const data = await response.json();
      setRecettes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecettes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recette?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/recettes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete recette');
      }
      setRecettes(recettes.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading recettes...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h1 className="text-3xl font-bold mb-4">Recettes</h1>
      <button
        onClick={() => navigate('/recette/add')}
        className="mb-4 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
      >
        Add Recette
      </button>
      {recettes.length === 0 ? (
        <p>No recettes found.</p>
      ) : (
        <ul className="space-y-4">
          {recettes.map((recette) => (
            <li key={recette._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{recette.title}</h2>
              <p className="mb-2">{recette.description}</p>
              <p className="text-sm text-gray-600">By: {recette.userId?.username || 'Unknown'}</p>
              {currentUser && recette.userId?._id === currentUser._id && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => navigate(`/recette/edit/${recette._id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recette._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
