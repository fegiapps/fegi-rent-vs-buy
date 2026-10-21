import React, { useState, useMemo } from 'react';

export default function App() {
  // Idioma y Moneda
  const [lang, setLang] = useState(() => 
    navigator.language && navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
  );
  const [currency, setCurrency] = useState('USD');
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTipOption, setSelectedTipOption] = useState(1); // 0: Té ($1.99), 1: Café ($3.99), 2: Personalizado
  const [customAmount, setCustomAmount] = useState(5.99);
  const [tipProcessed, setTipProcessed] = useState(false);

  // Tasas de cambio de referencia actuales del mercado
  const exchangeRates = {
    USD: 1,
    EUR: 0.89,
    DOP: 61.41
  };

  const tipOptions = [
    { labelEs: '🍵 Tasa de Té', labelEn: '🍵 Cup of Tea', amount: 1.99 },
    { labelEs: '☕ Tasa de Café', labelEn: '☕ Cup of Coffee', amount: 3.99 },
    { labelEs: '✨ Dime tú (Personalizado)', labelEn: '✨ You name it (Custom)', amount: customAmount },
  ];

  // Parámetros de Compra
  const [homePrice, setHomePrice] = useState(350000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [appreciationRate, setAppreciationRate] = useState(4.5);
  const [maintenancePct, setMaintenancePct] = useState(1.0);
  const [closingCostsPct, setClosingCostsPct] = useState(3.5);

  // Parámetros de Alquiler e Inversión
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [rentInflation, setRentInflation] = useState(4.0);
  const [investmentReturn, setInvestmentReturn] = useState(8.0);
  const [horizonYears, setHorizonYears] = useState(10);

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

    setHomePrice(prev => Math.round(prev * conversionFactor));
    setMonthlyRent(prev => Math.round(prev * conversionFactor));

    setCurrency(newCurrency);
  };

  const t = {
    es: {
      title: 'Rent vs Buy Real Estate',
      subtitle: 'Simulador Financiero Inmobiliario Avanzado • FEGI Apps',
      buySection: 'Escenario de Compra',
      rentSection: 'Escenario de Alquiler e Inversión',
      homePrice: 'Precio de la Propiedad',
      downPayment: 'Inicial (%)',
      interestRate: 'Tasa Hipotecaria Anual (%)',
      loanTerm: 'Plazo del Préstamo (Años)',
      appreciation: 'Plusvalía Anual Estimada (%)',
      maintenance: 'Mantenimiento + Impuestos Anual (%)',
      closingCosts: 'Gastos de Cierre / Transferencia (%)',
      monthlyRent: 'Alquiler Mensual Actual',
      rentIncrease: 'Aumento Anual de Alquiler (%)',
      invReturn: 'Rendimiento Anual de Inversión (%)',
      horizon: 'Horizonte de Comparación (Años)',
      verdictBuy: 'COMPRAR ES MEJOR OPCIÓN',
      verdictRent: 'ALQUILAR E INVERTIR ES MEJOR',
      netWorthDiff: 'Ventaja de Patrimonio Neto (Net Worth) a',
      years: 'años',
      monthlyMortgage: 'Cuota Hipotecaria Mensual (P&I)',
      initialCash: 'Efectivo Inicial Requerido',
      buyNetWorth: 'Patrimonio al Comprar',
      rentNetWorth: 'Patrimonio al Alquilar + Invertir',
      netWorthTooltip: 'Patrimonio Neto: Valor total de activos menos deudas al final del horizonte.',
      supportBtn: '🍵 Apoyar este proyecto',
      supportTitle: 'Apoya el desarrollo de FEGI Apps',
      supportDesc: 'Si este simulador te ha ayudado, elige o ingresa un monto para apoyarnos:',
      contribute: 'Aportar',
      enterCustom: 'Ingresa tu monto ($ USD):',
      thankYou: '¡Muchísimas gracias por tu apoyo! Tu contribución impulsa nuevas herramientas financieras.',
      close: 'Cerrar',
    },
    en: {
      title: 'Rent vs Buy Real Estate',
      subtitle: 'Advanced Real Estate Financial Simulator • FEGI Apps',
      buySection: 'Buying Scenario',
      rentSection: 'Renting & Investing Scenario',
      homePrice: 'Property Price',
      downPayment: 'Down Payment (%)',
      interestRate: 'Annual Mortgage Rate (%)',
      loanTerm: 'Loan Term (Years)',
      appreciation: 'Annual Home Appreciation (%)',
      maintenance: 'Annual Maintenance & Taxes (%)',
      closingCosts: 'Closing Costs (%)',
      monthlyRent: 'Current Monthly Rent',
      rentIncrease: 'Annual Rent Increase (%)',
      invReturn: 'Annual Investment Return (%)',
      horizon: 'Comparison Horizon (Years)',
      verdictBuy: 'BUYING IS BETTER',
      verdictRent: 'RENTING & INVESTING IS BETTER',
      netWorthDiff: 'Net Worth Advantage over',
      years: 'years',
      monthlyMortgage: 'Monthly Mortgage Payment (P&I)',
      initialCash: 'Initial Cash Required',
      buyNetWorth: 'Net Worth (Buying)',
      rentNetWorth: 'Net Worth (Rent + Invest)',
      netWorthTooltip: 'Net Worth: Total assets minus liabilities at the end of the horizon.',
      supportBtn: '🍵 Support this project',
      supportTitle: 'Support FEGI Apps development',
      supportDesc: 'If this simulator helped you, choose or enter an amount to support us:',
      contribute: 'Contribute',
      enterCustom: 'Enter your amount ($ USD):',
      thankYou: 'Thank you so much for your support! Your contribution powers new financial tools.',
      close: 'Close',
    },
  }[lang];

  // Motor Matemático de Simulación Mes a Mes
  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const closingCosts = homePrice * (closingCostsPct / 100);
    const initialCashOutlay = downPayment + closingCosts;
    const loanAmount = homePrice - downPayment;

    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    const monthlyMortgage =
      monthlyRate > 0
        ? (loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1)
        : loanAmount / totalPayments;

    let currentHomeValue = homePrice;
    let remainingBalance = loanAmount;
    let currentRent = monthlyRent;

    let renterPortfolio = initialCashOutlay;
    let buyerPortfolio = 0;

    const monthlyAppreciation =
      Math.pow(1 + appreciationRate / 100, 1 / 12) - 1;
    const monthlyInvReturn = Math.pow(1 + investmentReturn / 100, 1 / 12) - 1;
    const totalMonths = horizonYears * 12;

    for (let m = 1; m <= totalMonths; m++) {
      currentHomeValue *= 1 + monthlyAppreciation;
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment =
        m <= totalPayments ? monthlyMortgage - interestPayment : 0;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      const monthlyMaintenance =
        (currentHomeValue * (maintenancePct / 100)) / 12;
      const totalBuyerMonthlyCost =
        (m <= totalPayments ? monthlyMortgage : 0) + monthlyMaintenance;

      renterPortfolio *= 1 + monthlyInvReturn;
      buyerPortfolio *= 1 + monthlyInvReturn;

      const monthlyDiff = totalBuyerMonthlyCost - currentRent;
      if (monthlyDiff > 0) {
        renterPortfolio += monthlyDiff;
      } else {
        buyerPortfolio += Math.abs(monthlyDiff);
      }

      if (m % 12 === 0) {
        currentRent *= 1 + rentInflation / 100;
      }
    }

    const sellingCosts = currentHomeValue * 0.05;
    const buyerNetWorth =
      currentHomeValue - remainingBalance - sellingCosts + buyerPortfolio;
    const renterNetWorth = renterPortfolio;

    return {
      monthlyMortgage,
      initialCashOutlay,
      buyerNetWorth,
      renterNetWorth,
      difference: Math.abs(buyerNetWorth - renterNetWorth),
      buyWins: buyerNetWorth >= renterNetWorth,
    };
  }, [
    homePrice,
    downPaymentPct,
    interestRate,
    loanTermYears,
    appreciationRate,
    maintenancePct,
    closingCostsPct,
    monthlyRent,
    rentInflation,
    investmentReturn,
    horizonYears,
  ]);

  const fmt = (val) =>
    new Intl.NumberFormat(lang === 'es' ? 'es-DO' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        minHeight: '100vh',
        padding: '16px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header con el isotipo RB */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '20px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
              }}
            >
              RB
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                {t.title}
              </h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                {t.subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              style={{
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 10px',
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="DOP">DOP (RD$)</option>
            </select>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              style={{
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </header>

        {/* Tarjeta Principal de Veredicto */}
        <div
          style={{
            background: results.buyWins
              ? 'linear-gradient(135deg, #0ea5e9 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              opacity: 0.9,
            }}
          >
            {results.buyWins ? t.verdictBuy : t.verdictRent}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', margin: '6px 0' }}>
            +{fmt(results.difference)}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{t.netWorthDiff} {horizonYears} {t.years}</span>
            <span title={t.netWorthTooltip} style={{ cursor: 'help', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>?</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>
                {t.monthlyMortgage}
              </div>
              <div style={{ fontSize: '17px', fontWeight: '700' }}>
                {fmt(results.monthlyMortgage)}/mes
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>
                {t.initialCash}
              </div>
              <div style={{ fontSize: '17px', fontWeight: '700' }}>
                {fmt(results.initialCashOutlay)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>
                {t.buyNetWorth}
              </div>
              <div style={{ fontSize: '17px', fontWeight: '700' }}>
                {fmt(results.buyerNetWorth)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', opacity: 0.85 }}>
                {t.rentNetWorth}
              </div>
              <div style={{ fontSize: '17px', fontWeight: '700' }}>
                {fmt(results.renterNetWorth)}
              </div>
            </div>
          </div>
        </div>

        {/* Controles Interactivos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Columna Compra */}
          <div
            style={{
              background: '#1e293b',
              padding: '18px',
              borderRadius: '14px',
              border: '1px solid #334155',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginTop: 0,
                marginBottom: '16px',
                color: '#38bdf8',
              }}
            >
              🏠 {t.buySection}
            </h2>

            <SliderControl
              label={t.homePrice}
              value={homePrice}
              setValue={setHomePrice}
              min={currency === 'DOP' ? 1000000 : 50000}
              max={limits.maxPrice}
              step={currency === 'DOP' ? 500000 : 10000}
              display={fmt(homePrice)}
            />
            <SliderControl
              label={t.downPayment}
              value={downPaymentPct}
              setValue={setDownPaymentPct}
              min={0}
              max={80}
              step={1}
              display={`${downPaymentPct}% (${fmt(
                (homePrice * downPaymentPct) / 100
              )})`}
            />
            <SliderControl
              label={t.interestRate}
              value={interestRate}
              setValue={setInterestRate}
              min={1}
              max={18}
              step={0.1}
              display={`${interestRate}%`}
            />
            <SliderControl
              label={t.loanTerm}
              value={loanTermYears}
              setValue={setLoanTermYears}
              min={5}
              max={30}
              step={5}
              display={`${loanTermYears} years`}
            />
            <SliderControl
              label={t.appreciation}
              value={appreciationRate}
              setValue={setAppreciationRate}
              min={0}
              max={15}
              step={0.5}
              display={`${appreciationRate}%`}
            />
            <SliderControl
              label={t.maintenance}
              value={maintenancePct}
              setValue={setMaintenancePct}
              min={0}
              max={5}
              step={0.1}
              display={`${maintenancePct}%`}
            />
            <SliderControl
              label={t.closingCosts}
              value={closingCostsPct}
              setValue={setClosingCostsPct}
              min={0}
              max={10}
              step={0.5}
              display={`${closingCostsPct}%`}
            />
          </div>

          {/* Columna Alquiler e Inversión */}
          <div
            style={{
              background: '#1e293b',
              padding: '18px',
              borderRadius: '14px',
              border: '1px solid #334155',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginTop: 0,
                marginBottom: '16px',
                color: '#10b981',
              }}
            >
              📈 {t.rentSection}
            </h2>

            <SliderControl
              label={t.monthlyRent}
              value={monthlyRent}
              setValue={setMonthlyRent}
              min={currency === 'DOP' ? 10000 : 500}
              max={limits.maxRent}
              step={currency === 'DOP' ? 5000 : 250}
              display={fmt(monthlyRent)}
            />
            <SliderControl
              label={t.rentIncrease}
              value={rentInflation}
              setValue={setRentInflation}
              min={0}
              max={10}
              step={0.5}
              display={`${rentInflation}%`}
            />
            <SliderControl
              label={t.invReturn}
              value={investmentReturn}
              setValue={setInvestmentReturn}
              min={1}
              max={20}
              step={0.5}
              display={`${investmentReturn}%`}
            />
            <SliderControl
              label={t.horizon}
              value={horizonYears}
              setValue={setHorizonYears}
              min={1}
              max={30}
              step={1}
              display={`${horizonYears} years`}
            />
          </div>
        </div>

        {/* Botón de Apoyo */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => {
              setTipProcessed(false);
              setShowTipModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '30px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
          >
            {t.supportBtn}
          </button>
        </div>

        {/* Modal de Aporte con opción personalizada */}
        {showTipModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '420px',
                width: '100%',
                border: '1px solid #334155',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 10px 0', color: '#f59e0b' }}>
                {t.supportTitle}
              </h3>

              {!tipProcessed ? (
                <>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                    {t.supportDesc}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {tipOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTipOption(idx)}
                        style={{
                          background: selectedTipOption === idx ? '#f59e0b' : '#334155',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>{lang === 'es' ? opt.labelEs : opt.labelEn}</span>
                        <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                          {idx === 2 ? `$${customAmount}` : `$${opt.amount}`}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedTipOption === 2 && (
                    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                      <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                        {t.enterCustom}
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          background: '#0f172a',
                          color: '#fff',
                          border: '1px solid #38bdf8',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          fontWeight: '700',
                        }}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => setTipProcessed(true)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      width: '100%',
                      marginBottom: '10px',
                    }}
                  >
                    {t.contribute} (${selectedTipOption === 2 ? customAmount : tipOptions[selectedTipOption].amount})
                  </button>
                </>
              ) : (
                <p style={{ fontSize: '14px', color: '#34d399', lineHeight: '1.5', margin: '20px 0' }}>
                  {t.thankYou}
                </p>
              )}

              <button
                onClick={() => setShowTipModal(false)}
                style={{
                  backgroundColor: '#334155',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Auxiliar para Sliders Limpios
function SliderControl({ label, value, setValue, min, max, step, display }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ color: '#cbd5e1' }}>{label}</span>
        <span style={{ fontWeight: '700', color: '#38bdf8' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#38bdf8',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
