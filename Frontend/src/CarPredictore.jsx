import React, { useState, useEffect } from 'react';

export default function CarPredictor() {
  const [formData, setFormData] = useState({
    Car_Name: '',
    Present_Price: '',
    Kms_Driven: '',
    Fuel_Type: '',
    Seller_Type: '',
    Transmission: '',
    Owner: 0,
    Car_Age: ''
  });

  const [dropdownOptions, setDropdownOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/dropdown-options`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch options');
        return res.json();
      })
      .then((data) => {
        setDropdownOptions(data);
        setFormData((prev) => ({
          ...prev,
          Car_Name: data.Car_Name?.[0] || '',
          Fuel_Type: data.Fuel_Type?.[0] || '',
          Seller_Type: data.Seller_Type?.[0] || '',
          Transmission: data.Transmission?.[0] || ''
        }));
        setFetching(false);
      })
      .catch((err) => {
        setError(err.message);
        setFetching(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Exact strict data format parsing matching your exact object schema
    const payload = {
      Car_Name: formData.Car_Name,
      Present_Price: parseFloat(formData.Present_Price),
      Kms_Driven: parseInt(formData.Kms_Driven, 10),
      Fuel_Type: formData.Fuel_Type,
      Seller_Type: formData.Seller_Type,
      Transmission: formData.Transmission,
      Owner: parseInt(formData.Owner, 10),
      Car_Age: parseInt(formData.Car_Age, 10)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to get prediction');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-gray-500 text-sm font-medium tracking-wide">Loading system options...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans antialiased text-gray-900">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Used Car Valuation</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the technical metrics to evaluate current market price.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Car Name */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Car Model</label>
              <select
                name="Car_Name"
                value={formData.Car_Name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              >
                {dropdownOptions?.Car_Name?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Present Price */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Present Price (In Lakhs)</label>
              <input
                type="number"
                step="0.01"
                name="Present_Price"
                required
                placeholder="5.59"
                value={formData.Present_Price}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>

            {/* Kms Driven */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Kilometers Driven</label>
              <input
                type="number"
                name="Kms_Driven"
                required
                placeholder="27000"
                value={formData.Kms_Driven}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>

            {/* Car Age */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Car Age (Years)</label>
              <input
                type="number"
                name="Car_Age"
                required
                placeholder="12"
                value={formData.Car_Age}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fuel Type</label>
              <select
                name="Fuel_Type"
                value={formData.Fuel_Type}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              >
                {dropdownOptions?.Fuel_Type?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Seller Type */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller Type</label>
              <select
                name="Seller_Type"
                value={formData.Seller_Type}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              >
                {dropdownOptions?.Seller_Type?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Transmission</label>
              <select
                name="Transmission"
                value={formData.Transmission}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              >
                {dropdownOptions?.Transmission?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Owner */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Number of Previous Owners</label>
              <select
                name="Owner"
                value={formData.Owner}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              >
                <option value={0}>0 (First Hand)</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition shadow-sm disabled:opacity-40 disabled:pointer-events-none mt-2"
          >
            {loading ? 'Calculating...' : 'Calculate Resale Value'}
          </button>
        </form>

        {/* Dynamic Plain Output Box */}
        {result && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Calculated Price Estimate</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-3xl font-bold tracking-tight text-gray-900">₹ {result.predicted_price_lakhs}</span>
                <span className="text-sm font-medium text-gray-500 ml-1.5">Lakhs</span>
              </div>
              <div className="text-sm font-semibold text-emerald-600 sm:text-right bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-md self-start sm:self-auto">
                ₹ {result.predicted_price_rupees.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="mt-3 text-[10px] font-mono text-gray-400 text-right">
              Raw Pipeline Drift: {result.raw_model_output}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}