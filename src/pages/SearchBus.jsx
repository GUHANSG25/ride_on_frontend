import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/common/Hero';
import SearchBox from '../components/common/SearchBox';
import { searchTrip } from '../features/trip/Slice/TripSlice';  
import TripList from '../features/trip/components/TripList';    
import '../styles/global.css'
import SearchTripList from '../features/trip/components/SearchTripList'

const FILTER_TYPES = ['AC', 'NON-AC', 'SLEEPER', 'SEATER', 'SEMI-SLEEPER'];
const SORT_OPTIONS = [
  { id: 'price',    label: 'Price' },
  { id: 'timing',   label: 'Departure Time' },
  { id: 'duration', label: 'Duration' },
];

export default function SearchBus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { trips, loading, error } = useSelector((state) => state.trip);

  const [filtered, setFiltered]         = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeSort, setActiveSort]     = useState(null);

  const source      = searchParams.get('from')  || '';
  const destination = searchParams.get('to')    || '';
  const date        = searchParams.get('date')  || '';

  useEffect(() => {
    if (source && destination && date) {
      dispatch(searchTrip({ source, destination, date }));
      setActiveFilter(null);
      setActiveSort(null);
    }
  }, [source, destination, date]);

  useEffect(() => {
    setFiltered(trips || []);
  }, [trips]);

  const handleSearch = (from, to, travelDate) => {
    setSearchParams({ from, to, date: travelDate });
  };

  const handleFilter = (type) => {
  const next = activeFilter === type ? null : type;
  setActiveFilter(next);

  const base = next
      ? (trips || []).filter((t) => {
          const busType = t.busType?.toUpperCase();
          const amenity = t.amenity?.toUpperCase();
          return busType === next || amenity === next;
        })
      : (trips || []);

    setFiltered(applySorting(base, activeSort));
  };

  const handleSort = (sortId) => {
    const next = activeSort === sortId ? null : sortId;
    setActiveSort(next);
    setFiltered(applySorting(filtered, next));
  };

  const applySorting = (list, sortId) => {
    if (!sortId) return [...list];
    return [...list].sort((a, b) => {
      if (sortId === 'price') return a.fare - b.fare;
      if (sortId === 'timing') return (a.departureTime || '').localeCompare(b.departureTime || '');
      if (sortId === 'duration') return calcMins(a) - calcMins(b);
      return 0;
    });
  };

  const calcMins = (trip) => {
    if (!trip.departureTime || !trip.arrivalTime) return 9999;
    const [dh, dm] = trip.departureTime.split(':').map(Number);
    const [ah, am] = trip.arrivalTime.split(':').map(Number);
    let m = (ah * 60 + am) - (dh * 60 + dm);
    return m < 0 ? m + 1440 : m;
  };

  return (
    <div class = "search-bus-page">
      <Header />
      <Hero />
      <SearchBox onSearch={handleSearch} />

      <div className="sortby-bar">
        <span className="sortby-label">Sort by:</span>
        <div className="sortby-pills">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`sortby-pill ${activeSort === opt.id ? 'active' : ''}`}
              onClick={() => handleSort(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bus-page-layout">

        <aside className="filter-sidebar">
          <h5 className="filter-title">Filter Buses</h5>
          <hr className="filter-divider" />
          <div className="filter-btn-group">
            {FILTER_TYPES.map((type) => (
              <button
                key={type}
                className={`filter-btn ${activeFilter === type ? 'active' : ''}`}
                onClick={() => handleFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
          {activeFilter && (
            <button className="filter-clear-btn" onClick={() => handleFilter(activeFilter)}>
              Clear filter
            </button>
          )}
        </aside>

        <div className="bus-results">
          {source && destination && date ? (
            <>
              {!loading && !error && filtered.length > 0 && (
                <p className="results-count">
                  {filtered.length} bus{filtered.length !== 1 ? 'es' : ''} found
                  {activeFilter ? ` · ${activeFilter}` : ''}
                </p>
              )}
              <SearchTripList trips={filtered} loading={loading} error={error} />
            </>
          ) : (
            <div className="trip-list-state">
              <p>Enter your source, destination and date to find buses.</p>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}