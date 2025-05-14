import { Link } from 'react-router-dom';
import { FaUniversity, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AccountCard = ({ _id, type, alias, cbu, balance, currency, status }) => {
  return (
    <Link to={`/accounts/${_id}`} className="account-card-link">
      <div className="account-card">
        <div className="account-header">
          <div className="account-type">
            <FaUniversity />
            {type} account
          </div>
          <span className="currency">{currency}</span>
        </div>

        <div className="account-details">
          <p><strong>Alias:</strong> {alias}</p>
          <p><strong>CBU:</strong> {cbu}</p>
        </div>

        <div className="account-balance">
          💰 {balance} {currency}
        </div>

        <div className={`account-status ${status === 'active' ? 'active' : 'inactive'}`}>
          {status === 'active' ? <FaCheckCircle /> : <FaTimesCircle />}
          Estado: {status}
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;
