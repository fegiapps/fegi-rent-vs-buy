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

  // Tasas de cambio editables manualmente por el usuario
  const [customRates, setCustomRates] = useState({
    EUR: 0.89,
    DOP: 61.41
  });

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

  // Rangos máximos dinámicos independientes por divisa según lo acordado
  const limits = useMemo(() => {
    if (currency === 'DOP') {
      return { 
        minPrice: 3000000, maxPrice: 100000000, stepPrice: 1000000, 
        minRent: 20000, maxRent: 500000, stepRent: 5000 
      };
    } else if (currency === 'EUR') {
      return { 
        minPrice: 100000, maxPrice: 50000000, stepPrice: 50000, 
        minRent: 1000, maxRent: 50000, stepRent: 500 
      };
    } else {
      // USD
      return { 
        minPrice: 100000, maxPrice: 50000000, stepPrice: 50000, 
        minRent: 1000, maxRent: 50000, stepRent: 500 
      };
    }
  }, [currency]);

  // Conversión automática al alternar moneda usando la tasa actual
  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) return;

    const getRate = (cur) => cur === 'USD' ? 1 : customRates[cur];
    const oldRate = getRate(currency);
    const newRate = getRate(newCurrency);
    const conversionFactor = newRate / oldRate;

    setHomePrice(prev => Math.round(prev * conversionFactor));
    setMonthlyRent(prev => Math.round(prev * conversionFactor));

    setCurrency(newCurrency);
  };

  // Actualizar tasa manual y recalcular valores en consecuencia si es necesario
  const handleRateChange = (cur, newRate) => {
    const val = parseFloat(newRate) || 1;
    setCustomRates(prev => ({ ...prev, [cur]: val }));
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
      exchangeRateLabel: 'Tasa (1 USD =):'
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
      exchangeRateLabel: 'Rate (1 USD =):'
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
    const monthlyInvReturn
