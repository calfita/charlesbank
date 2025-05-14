import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import AccountCard from '../components/AccountCard';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await apiFetch('/accounts');
        setAccounts(data);
      } catch (err) {
        console.error('Error al obtener cuentas:', err.message);
      }
    };

    loadAccounts();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Tus cuentas</h1>

      {accounts.length === 0 ? (
       <Loader/>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map(acc => (
            <AccountCard key={acc._id} {...acc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
