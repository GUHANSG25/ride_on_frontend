import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/global.css';
import Toast from '../common/Toast'

export default function SearchBox({ onSearch }) {
  const navigate = useNavigate();
  const[toast,setToast] = useState(null);

  const showToast = (msg) => {
    setToast({msg});
    setTimeout(() => setToast(null),3000);
  }

  const [from, setFrom] = useState('');
  const [to, setTo]     = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from'))  setFrom(params.get('from'));
    if (params.get('to'))    setTo(params.get('to'));
    if (params.get('date'))  setDate(params.get('date'));
  }, []);

  const handleSearch = () => {
    if (!from.trim() || !to.trim() || !date) {
      showToast('Please fill in all fields.');
      return;
    }
    if (onSearch) {
      onSearch(from.trim(), to.trim(), date);
    } else {
      navigate(`/search?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}&date=${date}`);
    }
  };

  return (
    <section className="search-box">
      <div className="searching">
        <div className="row g-0 align-items-center">
          <div className="col-md-3 field">
            <label>From</label>
            <input
              type="text"
              placeholder="Source city"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="col-md-3 field">
            <label>To</label>
            <input
              type="text"
              placeholder="Destination city"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="col-md-3 field">
            <label>Departure</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="col-md-3 text-center">
            <button className="search-btn" type="button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
      <Toast toast={toast}/>
    </section>
  );
}