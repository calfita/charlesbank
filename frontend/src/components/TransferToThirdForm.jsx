import { useState } from 'react';
import { apiFetch } from '../services/api';

const TransferToThirdForm = ({ fromAccountId, currency, fromBalance, onSuccess }) => {
  const [toCBU, setToCBU] = useState('');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (amount > fromBalance) {
      setError('Saldo insuficiente');
      return;
    }

    try {
      const body = { fromAccountId, toCBU, amount, currency, concept };
      await apiFetch('/transfers/third', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setSuccess('Transferencia realizada con éxito');
      setAmount('');
      setConcept('');
      setToCBU('');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="transfer-form" onSubmit={handleSubmit}>
      <h3>Transferencia a tercero</h3>

      <p className="account-info">Saldo disponible: ${fromBalance}</p>

      <label>CBU o alias destino:</label>
      <input
        type="text"
        value={toCBU}
        onChange={e => setToCBU(e.target.value)}
        required
      />

      <label>Monto:</label>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />

      <label>Concepto:</label>
      <input
        type="text"
        value={concept}
        onChange={e => setConcept(e.target.value)}
      />

      <button type="submit">Enviar</button>

      {error && <p className="error-msg">{error}</p>}
      {success && (
        <div className="ticket-box">
          <div className="checkmark">✔️</div>
          <h4>Transferencia confirmada</h4>
          <p>{success}</p>
        </div>
      )}
    </form>
  );
};

export default TransferToThirdForm;
