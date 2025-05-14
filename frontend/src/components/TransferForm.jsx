import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const TransferForm = ({ fromAccountId, currency, onSuccess, fromBalance }) => {
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const all = await apiFetch("/accounts");
        const own = all.filter(
          (a) => a._id !== fromAccountId && a.currency === currency
        );
        setAccounts(own);
        if (own.length > 0) setToAccountId(own[0]._id);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Error al cargar cuentas propias");
      }
    };
    fetchAccounts();
  }, [fromAccountId, currency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const body = { fromAccountId, toAccountId, amount, currency, concept };
      await apiFetch("/api/transfers/own", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setSuccess("Transferencia realizada con éxito");
      setAmount("");
      setConcept("");

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500); // espera 1.5 segundos antes de cerrar el modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="transfer-form" onSubmit={handleSubmit}>
      <h3>Transferencia entre cuentas propias</h3>
      <p className="account-info">Saldo origen: ${fromBalance}</p>
      <label>Cuenta destino:</label>
      <select
        value={toAccountId}
        onChange={(e) => setToAccountId(e.target.value)}
        required
        className="form-select"
      >
        <option value="">Seleccionar cuenta</option>
        {accounts.map((a) => (
          <option key={a._id} value={a._id}>
            {a.alias} - {a.type} - Saldo: ${a.balance}
          </option>
        ))}
      </select>

      <label>Monto:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <label>Concepto:</label>
      <input
        type="text"
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
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

export default TransferForm;
