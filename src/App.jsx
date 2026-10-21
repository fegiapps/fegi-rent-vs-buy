import React, { useState, useMemo } from 'react';

export default function App() {
  const [lang, setLang] = useState(() => 
    navigator.language && navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
  );
  
  const [currency, setCurrency] = useState('USD'); // 'USD', 'EUR', 'DOP'
  
  // Tasas de cambio de referencia actuales
  const exchangeRates = {
    USD: 1,
    EUR: 0.89,
    DOP: 61.41
  };

  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [homeAppreciation, setHomeAppreciation] = useState(12.5);
  const [maintenanceTaxes, setMaintenanceTaxes] = useState(1.0);
  const [closingCosts, setClosingCosts] = useState(3.5);

  const [monthlyRent, setMonthlyRent] = useState(50000);
  const [rentIncrease, setRentIncrease] = useState(4.0);
  const [investmentReturn, setInvestmentReturn] = useState(8.0);
  const [horizon, setHorizon] = useState(22);

  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState(1);
  const [customAmount, setCustomAmount] = useState(5.99);

  // Rangos máximos dinámicos según la moneda activa
  const limits = useMemo(() => {
    if (currency === 'DOP') {
      return { maxPrice: 3000000000, maxRent: 1000000, stepPrice: 1000000, stepRent: 5000 };
    } else if (currency === 'EUR') {
      return { maxPrice: 45000000, maxRent: 45000, stepPrice: 50000, stepRent: 500 };
    } else {
      return { maxPrice: 50000000, maxRent: 50000, stepPrice: 50000, stepRent: 500 };
    }
  }, [currency]);

  // Conversión automática al alternar moneda
  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) return;

    const oldRate = exchangeRates[currency];
    const newRate = exchangeRates[newCurrency];
    const conversionFactor = newRate / oldRate;

    setPropertyPrice(prev => Math.round(prev * conversionFactor));
    setMonthlyRent(prev => Math.round(prev * conversionFactor));

    setCurrency(newCurrency);
  };

  const tipOptions = [
    { labelEs: '🍵 Tasa de Té', labelEn: '🍵 Cup of Tea', amount: 1.99 },
    { labelEs: '☕ Tasa de Café', labelEn: '☕ Cup of Coffee', amount: 3.99 },
    { labelEs: '✨ Dime tú (Personalizado)', labelEn: '✨ You name it (Custom)', amount: customAmount },
  ];

  const fmt = (val) => {
    return new Intl.NumberFormat(lang === 'es' ? 'es-DO' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Cálculos simulados básicos para el panel de resultados
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPaymentAmount;
  const monthlyRateDecimal = (mortgageRate / 100) / 12;
  const totalPayments = loanTerm * 12;
  const monthlyMortgage = loanAmount > 0 && monthlyRateDecimal > 0 
    ? (loanAmount * monthlyRateDecimal * Math.pow(1 + monthlyRateDecimal, totalPayments)) / (Math.pow(1 + monthlyRateDecimal, totalPayments) - 1)
    : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Rent vs Buy Real Estate</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Advanced Real Estate Financial Simulator • FEGI Apps</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            value={currency} 
            onChange={(e) => handleCurrencyChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #475569' }}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="DOP">DOP (RD$)</option>
          </select>

          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            style={{ padding: '8px 12px', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Tarjeta de Resultados Principal */}
      <div style={{ background: '#10b981', padding: '20px', borderRadius: '12px', color: '#fff', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
          {lang === 'es' ? 'Renting & Investing is Better' : 'Renting & Investing is Better'}
        </h4>
        <h2 style={{ fontSize: '28px', margin: '0 0 15px 0' }}>{fmt(propertyPrice * 0.35)}</h2>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>{lang === 'es' ? 'Pago Mensual Hipoteca (P&I):' : 'Monthly Mortgage Payment (P&I):'}</span>
            <strong>{fmt(monthlyMortgage)}/mes</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{lang === 'es' ? 'Efectivo Inicial Requerido:' : 'Initial Cash Required:'}</span>
            <strong>{fmt(downPaymentAmount + (propertyPrice * (closingCosts / 100)))}</strong>
          </div>
        </div>
      </div>

      {/* Panel de Compra */}
      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginTop: 0 }}>🏠 {lang === 'es' ? 'Escenario de Compra' : 'Buying Scenario'}</h3>
        
        <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
          {lang === 'es' ? 'Precio de la Propiedad' : 'Property Price'}: <strong>{fmt(propertyPrice)}</strong>
        </label>
        <input 
          type="range" 
          min={currency === 'DOP' ? 5000000 : 100000} 
          max={limits.maxPrice} 
          step={limits.stepPrice}
          value={propertyPrice} 
          onChange={(e) => setPropertyPrice(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '15px' }}
        />

        <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
          {lang === 'es' ? 'Pago Inicial (%)' : 'Down Payment (%)'}: <strong>{downPaymentPercent}% ({fmt(downPaymentAmount)})</strong>
        </label>
        <input 
          type="range" 
          min={0} max={100} step={5}
          value={downPaymentPercent} 
          onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '15px' }}
        />
      </div>

      {/* Panel de Renta e Inversión */}
      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', marginTop: 0 }}>📈 {lang === 'es' ? 'Escenario de Alquiler e Inversión' : 'Renting & Investing Scenario'}</h3>
        
        <label style={{ fontSize: '14px', display: 'block', marginBottom: '5px' }}>
          {lang === 'es' ? 'Renta Mensual Actual' : 'Current Monthly Rent'}: <strong>{fmt(monthlyRent)}</strong>
        </label>
        <input 
          type="range" 
          min={currency === 'DOP' ? 20000 : 500} 
          max={limits.maxRent} 
          step={limits.stepRent}
          value={monthlyRent} 
          onChange={(e) => setMonthlyRent(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '15px' }}
        />
      </div>

      {/* Botón de Apoyo / Soporte */}
      <button 
        onClick={() => setShowTipModal(true)}
        style={{ width: '100%', padding: '14px', backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
      >
        ☕ {lang === 'es' ? 'Apoyar este proyecto' : 'Support this project'}
      </button>

      {/* Modal de Donación */}
      {showTipModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', width: '90%', maxWidth: '400px', border: '1px solid #475569' }}>
            <h3 style={{ marginTop: 0 }}>{lang === 'es' ? 'Apoya el desarrollo de FEGI Apps' : 'Support FEGI Apps development'}</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>
              {lang === 'es' ? 'Si este simulador te ayudó, elige o ingresa un monto:' : 'If this simulator helped you, choose or enter an amount:'}
            </p>

            {tipOptions.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedTipOption(idx)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px', margin: '8px 0', 
                  background: selectedTipOption === idx ? '#f59e0b' : '#334155', 
                  color: selectedTipOption === idx ? '#000' : '#fff', 
                  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
                }}
              >
                <span>{lang === 'es' ? opt.labelEs : opt.labelEn}</span>
                <span>{idx === 2 ? fmt(customAmount) : fmt(opt.amount)}</span>
              </button>
            ))}

            <button 
              onClick={() => setShowTipModal(false)}
              style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
