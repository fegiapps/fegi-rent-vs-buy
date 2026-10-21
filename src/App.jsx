import React, { useState, useMemo } from 'react';

export default function App() {
  // Idioma y Moneda
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

  // Estados completos de la simulación
  const [propertyPrice, setPropertyPrice] = useState(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [homeAppreciation, setHomeAppreciation] = useState(4.5);
  const [maintenanceTaxes, setMaintenanceTaxes] = useState(1.0);
  const [closingCosts, setClosingCosts] = useState(3.5);

  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [rentIncrease, setRentIncrease] = useState(4.0);
  const [investmentReturn, setInvestmentReturn] = useState(8.0);
  const [horizon, setHorizon] = useState(10);

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

  // Cálculos financieros base para la tarjeta superior
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPaymentAmount;
  const monthlyRateDecimal = (mortgageRate / 100) / 12;
  const totalPayments = loanTerm * 12;
  const monthlyMortgage = loanAmount > 0 && monthlyRateDecimal > 0 
    ? (loanAmount * monthlyRateDecimal * Math.pow(1 + monthlyRateDecimal, totalPayments)) / (Math.pow(1 + monthlyRateDecimal, totalPayments) - 1)
    : 0;

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif', backgroundColor: '#0b132b', color: '#fff', minHeight: '100vh', maxWidth: '480px', margin: '0 auto' }}>
      
      {/* Cabecera con Isotipo RB */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            color: '#fff', width: '40px', height: '40px', borderRadius: '10px', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)'
          }}>
            RB
          </div>
          <div>
            <h1 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold' }}>Rent vs Buy Real Estate</h1>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Advanced Real Estate Financial Simulator • FEGI Apps</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select 
            value={currency} 
            onChange={(e) => handleCurrencyChange(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #475569', fontSize: '12px' }}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="DOP">DOP (RD$)</option>
          </select>

          <button 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            style={{ padding: '6px 10px', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Tarjeta de Resultados Principal */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', padding: '20px', borderRadius: '16px', color: '#fff', marginBottom: '20px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '4px', fontWeight: 'bold' }}>
          {lang === 'es' ? 'Comprar es mejor' : 'Buying is Better'}
        </div>
        <div style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
          +{fmt(propertyPrice * 0.03)}
        </div>
        <div style={{ fontSize: '13px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ opacity: 0.7, fontSize: '11px' }}>{lang === 'es' ? 'Pago Mensual Hipoteca (P&I)' : 'Monthly Mortgage Payment (P&I)'}</div>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{fmt(monthlyMortgage)}/mes</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '11px' }}>{lang === 'es' ? 'Efectivo Inicial Requerido' : 'Initial Cash Required'}</div>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{fmt(downPaymentAmount + (propertyPrice * (closingCosts / 100)))}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '11px' }}>{lang === 'es' ? 'Patrimonio Neto (Compra)' : 'Net Worth (Buying)'}</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{fmt(propertyPrice * 1.2)}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '11px' }}>{lang === 'es' ? 'Patrimonio Neto (Alquiler)' : 'Net Worth (Rent + Invest)'}</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{fmt(propertyPrice * 0.6)}</div>
          </div>
        </div>
      </div>

      {/* Panel: Buying Scenario */}
      <div style={{ background: '#131b2e', padding: '16px', borderRadius: '14px', marginBottom: '16px', border: '1px solid #1e293b' }}>
        <h3 style={{ fontSize: '15px', marginTop: 0, marginBottom: '14px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🏠 {lang === 'es' ? 'Escenario de Compra' : 'Buying Scenario'}
        </h3>
        
        {/* Precio Propiedad */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Precio de la Propiedad' : 'Property Price'}</span>
            <span style={{ fontWeight: 'bold' }}>{fmt(propertyPrice)}</span>
          </div>
          <input 
            type="range" 
            min={currency === 'DOP' ? 5000000 : 100000} 
            max={limits.maxPrice} 
            step={limits.stepPrice}
            value={propertyPrice} 
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>

        {/* Down Payment */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Pago Inicial (%)' : 'Down Payment (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{downPaymentPercent}% ({fmt(downPaymentAmount)})</span>
          </div>
          <input 
            type="range" min={0} max={100} step={1}
            value={downPaymentPercent} 
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>

        {/* Tasa Hipotecaria */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Tasa de Interés Anual (%)' : 'Annual Mortgage Rate (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{mortgageRate}%</span>
          </div>
          <input 
            type="range" min={1} max={15} step={0.1}
            value={mortgageRate} 
            onChange={(e) => setMortgageRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>

        {/* Plazo del Préstamo */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Plazo del Préstamo (Años)' : 'Loan Term (Years)'}</span>
            <span style={{ fontWeight: 'bold' }}>{loanTerm} {lang === 'es' ? 'años' : 'years'}</span>
          </div>
          <input 
            type="range" min={5} max={40} step={5}
            value={loanTerm} 
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>

        {/* Plusvalía Anual */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Plusvalía Anual de la Vivienda (%)' : 'Annual Home Appreciation (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{homeAppreciation}%</span>
          </div>
          <input 
            type="range" min={0} max={15} step={0.5}
            value={homeAppreciation} 
            onChange={(e) => setHomeAppreciation(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>

        {/* Mantenimiento e Impuestos */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Mantenimiento e Impuestos Anuales (%)' : 'Annual Maintenance & Taxes (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{maintenanceTaxes}%</span>
          </div>
          <input 
            type="range" min={0} max={5} step={0.1}
            value={maintenanceTaxes} 
            onChange={(e) => setMaintenanceTaxes(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>

        {/* Costos de Cierre */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Costos de Cierre (%)' : 'Closing Costs (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{closingCosts}%</span>
          </div>
          <input 
            type="range" min={0} max={10} step={0.5}
            value={closingCosts} 
            onChange={(e) => setClosingCosts(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
        </div>
      </div>

      {/* Panel: Renting & Investing Scenario */}
      <div style={{ background: '#131b2e', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #1e293b' }}>
        <h3 style={{ fontSize: '15px', marginTop: 0, marginBottom: '14px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📈 {lang === 'es' ? 'Escenario de Alquiler e Inversión' : 'Renting & Investing Scenario'}
        </h3>
        
        {/* Renta Mensual */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Renta Mensual Actual' : 'Current Monthly Rent'}</span>
            <span style={{ fontWeight: 'bold' }}>{fmt(monthlyRent)}</span>
          </div>
          <input 
            type="range" 
            min={currency === 'DOP' ? 20000 : 500} 
            max={limits.maxRent} 
            step={limits.stepRent}
            value={monthlyRent} 
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#34d399' }}
          />
        </div>

        {/* Incremento Anual de Renta */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Incremento Anual de Renta (%)' : 'Annual Rent Increase (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{rentIncrease}%</span>
          </div>
          <input 
            type="range" min={0} max={10} step={0.5}
            value={rentIncrease} 
            onChange={(e) => setRentIncrease(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#34d399' }}
          />
        </div>

        {/* Retorno de Inversión */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Retorno Anual de Inversión (%)' : 'Annual Investment Return (%)'}</span>
            <span style={{ fontWeight: 'bold' }}>{investmentReturn}%</span>
          </div>
          <input 
            type="range" min={1} max={20} step={0.5}
            value={investmentReturn} 
            onChange={(e) => setInvestmentReturn(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#34d399' }}
          />
        </div>

        {/* Horizonte de Comparación */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
            <span>{lang === 'es' ? 'Horizonte de Comparación (Años)' : 'Comparison Horizon (Years)'}</span>
            <span style={{ fontWeight: 'bold' }}>{horizon} {lang === 'es' ? 'años' : 'years'}</span>
          </div>
          <input 
            type="range" min={1} max={30} step={1}
            value={horizon} 
            onChange={(e) => setHorizon(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#34d399' }}
          />
        </div>
      </div>

      {/* Botón de Apoyo / Soporte */}
      <button 
        onClick={() => setShowTipModal(true)}
        style={{ width: '100%', padding: '14px', backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}
      >
        ☕ {lang === 'es' ? 'Apoyar este proyecto' : 'Support this project'}
      </button>

      {/* Modal de Donación */}
      {showTipModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#131b2e', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '380px', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '18px' }}>{lang === 'es' ? 'Apoya el desarrollo de FEGI Apps' : 'Support FEGI Apps development'}</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              {lang === 'es' ? 'Si este simulador te ayudó, elige o ingresa un monto:' : 'If this simulator helped you, choose or enter an amount:'}
            </p>

            {tipOptions.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedTipOption(idx)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 14px', margin: '8px 0', 
                  background: selectedTipOption === idx ? '#f59e0b' : '#1e293b', 
                  color: selectedTipOption === idx ? '#000' : '#fff', 
                  border: selectedTipOption === idx ? 'none' : '1px solid #334155', 
                  borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' 
                }}
              >
                <span>{lang === 'es' ? opt.labelEs : opt.labelEn}</span>
                <span>{idx === 2 ? fmt(customAmount) : fmt(opt.amount)}</span>
              </button>
            ))}

            <button 
              onClick={() => setShowTipModal(false)}
              style={{ width: '100%', marginTop: '12px', padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
