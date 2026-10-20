import React, { useState, useMemo } from 'react';

export default function App() {
  // Idioma y Moneda
  const [lang, setLang] = useState(() => 
    navigator.language && navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
  );
  const [currency, setCurrency] = useState('USD');
  const [showTipModal, setShowTipModal] = useState(false);

  // Parámetros de Compra
  const [homePrice, setHomePrice] = useState(180000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTermYears, setLoanTermYears] = useState(20);
  const [appreciationRate, setAppreciationRate] = useState(4.5);
  const [maintenancePct, setMaintenancePct] = useState(1.0);
  const [closingCostsPct, setClosingCostsPct] = useState(3.5);

  // Parámetros de Alquiler e Inversión (Límite superior ampliado)
  const [monthlyRent, setMonthlyRent] = useState(1100);
  const [rentInflation, setRentInflation] = useState(4.0);
  const [investmentReturn, setInvestmentReturn] = useState(8.0);
  const [horizonYears, setHorizonYears] = useState(10);

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
      supportBtn: '☕ Apoyar este proyecto',
      supportTitle: 'Apoya a FEGI Apps',
      supportDesc:
        'Este simulador es gratuito y sin anuncios invasivos. Si te ayudó a tomar una mejor decisión financiera, puedes invitarnos un café.',
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
      supportBtn: '☕ Support this project',
      supportTitle: 'Support FEGI Apps',
      supportDesc:
        'This simulator is free and ad-free. If it helped you make a smarter financial decision, consider buying us a coffee.',
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
    new Intl.NumberFormat('en-US', {
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
        {/* Header con el nuevo isotipo RB */}
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
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 10px',
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="DOP">DOP (RD$)</option>
              <option value="EUR">EUR (€)</option>
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
          <div style={{ fontSize: '13px', opacity: 0.9 }}>
            {t.netWorthDiff} {horizonYears} {t.years}
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
              min={30000}
              max={2000000}
              step={5000}
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
              step={
