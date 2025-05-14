import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import TransferForm from "../components/TransferForm";
import TransferToThirdForm from "../components/TransferToThirdForm";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

const AccountDetail = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showThirdModal, setShowThirdModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const acc = await apiFetch(`/accounts/${id}`);
      const txs = await apiFetch(`/accounts/${id}/transactions`);

      setAccount(acc);
      setTransactions(txs);
    } catch (err) {
      console.error("Error al cargar cuenta:", err.message);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!account) return <Loader />;

  return (
    <div className="account-detail-container">
      <BackButton />
      <div className="account-detail-card">
        <h2>{account.alias}</h2>
        <p>
          <strong>CBU:</strong> {account.cbu}
        </p>
        <p>
          <strong>Tipo:</strong> {account.type}
        </p>
        <p>
          <strong>Moneda:</strong> {account.currency}
        </p>
        <p>
          <strong>Saldo:</strong> 💰 {account.balance} {account.currency}
        </p>
        <p
          className={`account-status ${
            account.status === "active" ? "active" : "inactive"
          }`}
        >
          Estado: {account.status}
        </p>

        <button className="btn-transfer" onClick={() => setShowModal(true)}>
          Transferir a cuenta propia
        </button>
        <button
          className="btn-transfer"
          onClick={() => setShowThirdModal(true)}
        >
          Transferir a tercero
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <TransferForm
              fromAccountId={account._id}
              currency={account.currency}
              fromBalance={account.balance}
              onSuccess={() => {
                setShowModal(false);
                fetchData();
              }}
            />
          </div>
        </div>
      )}

      {showThirdModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowThirdModal(false)}
            >
              ×
            </button>
            <TransferToThirdForm
              fromAccountId={account._id}
              currency={account.currency}
              fromBalance={account.balance}
              onSuccess={() => {
                setShowThirdModal(false);
                fetchData();
              }}
            />
          </div>
        </div>
      )}

      <div className="transactions-section">
        <h3>Últimos movimientos</h3>
        {transactions.length === 0 ? (
          <p className="no-transactions">No hay transacciones aún.</p>
        ) : (
          <ul className="transactions-list">
            {transactions.map((tx) => (
              <li key={tx._id} className="transaction-item">
                <span className="tx-type">[{tx.type}]</span>
                <span className="tx-concept">{tx.concept}</span>
                <span className="tx-amount">
                  {tx.amount} {tx.currency}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountDetail;
