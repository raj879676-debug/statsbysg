import { motion } from 'motion/react';
import { memo, useMemo } from 'react';
import { STAT_SYMBOLS } from '../constants';

const NormalCurve = () => (
  <svg viewBox="0 0 100 40" className="w-24 h-auto opacity-40">
    <path d="M0,35 Q25,35 50,5 Q75,35 100,35" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="5" x2="50" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
  </svg>
);

const BoxPlot = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <line x1="20" y1="5" x2="20" y2="35" stroke="currentColor" strokeWidth="2" />
    <rect x="10" y="15" width="20" height="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="5" x2="25" y2="5" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="35" x2="25" y2="35" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const PieChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M20,20 L20,5 A15,15 0 0,1 35,20 Z" fill="currentColor" opacity="0.5" />
    <path d="M20,20 L35,20 A15,15 0 0,1 20,35 Z" fill="currentColor" opacity="0.3" />
  </svg>
);

const LineGraph = () => (
    <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
      <polyline points="5,35 15,20 25,25 35,5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="5" cy="35" r="2" fill="currentColor" />
      <circle cx="15" cy="20" r="2" fill="currentColor" />
      <circle cx="25" cy="25" r="2" fill="currentColor" />
      <circle cx="35" cy="5" r="2" fill="currentColor" />
    </svg>
);

const RegressionPlot = () => (
    <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
      <circle cx="5" cy="30" r="1.5" fill="currentColor" />
      <circle cx="12" cy="25" r="1.5" fill="currentColor" />
      <circle cx="18" cy="22" r="1.5" fill="currentColor" />
      <circle cx="25" cy="15" r="1.5" fill="currentColor" />
      <circle cx="32" cy="10" r="1.5" fill="currentColor" />
      <line x1="0" y1="35" x2="40" y2="5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
);

const Histogram = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <rect x="5" y="25" width="6" height="10" fill="currentColor" />
    <rect x="11" y="15" width="6" height="20" fill="currentColor" />
    <rect x="17" y="10" width="6" height="25" fill="currentColor" />
    <rect x="23" y="20" width="6" height="15" fill="currentColor" />
    <rect x="29" y="27" width="6" height="8" fill="currentColor" />
  </svg>
);

const VennDiagram = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <circle cx="15" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="25" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="26" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BarChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <rect x="5" y="20" width="8" height="15" fill="currentColor" />
    <rect x="16" y="5" width="8" height="30" fill="currentColor" />
    <rect x="27" y="15" width="8" height="20" fill="currentColor" />
  </svg>
);

const RadarChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <polygon points="20,5 35,15 30,35 10,35 5,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <polygon points="20,10 30,18 20,30 10,18" fill="currentColor" opacity="0.4" />
  </svg>
);

const AreaChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,35 L5,20 L15,10 L25,25 L35,15 L35,35 Z" fill="currentColor" opacity="0.3" />
    <path d="M5,20 L15,10 L25,25 L35,15" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ScatterPlot = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <circle cx="8" cy="32" r="2" fill="currentColor" />
    <circle cx="12" cy="15" r="2" fill="currentColor" />
    <circle cx="22" cy="25" r="2" fill="currentColor" />
    <circle cx="28" cy="10" r="2" fill="currentColor" />
    <circle cx="35" cy="28" r="2" fill="currentColor" />
  </svg>
);

const StepChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <polyline points="5,35 15,35 15,25 25,25 25,15 35,15" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SigmoidCurve = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,35 Q20,35 20,20 Q20,5 35,5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BubbleChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <circle cx="10" cy="30" r="4" fill="currentColor" opacity="0.4" />
    <circle cx="25" cy="15" r="6" fill="currentColor" opacity="0.6" />
    <circle cx="32" cy="28" r="3" fill="currentColor" opacity="0.3" />
  </svg>
);

const Candlestick = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <line x1="10" y1="5" x2="10" y2="35" stroke="currentColor" strokeWidth="1" />
    <rect x="5" y="10" width="10" height="20" fill="currentColor" />
    <line x1="30" y1="5" x2="30" y2="35" stroke="currentColor" strokeWidth="1" />
    <rect x="25" y="15" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const Heatmap = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <rect x="5" y="5" width="10" height="10" fill="currentColor" opacity="0.2" />
    <rect x="15" y="5" width="10" height="10" fill="currentColor" opacity="0.8" />
    <rect x="25" y="5" width="10" height="10" fill="currentColor" opacity="0.4" />
    <rect x="5" y="15" width="10" height="10" fill="currentColor" opacity="0.9" />
    <rect x="15" y="15" width="10" height="10" fill="currentColor" opacity="0.3" />
    <rect x="25" y="15" width="10" height="10" fill="currentColor" opacity="0.6" />
  </svg>
);

const FunnelChart = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,5 L35,5 L30,15 L10,15 Z" fill="currentColor" opacity="0.8" />
    <path d="M10,17 L30,17 L25,27 L15,27 Z" fill="currentColor" opacity="0.5" />
    <path d="M15,29 L25,29 L22,37 L18,37 Z" fill="currentColor" opacity="0.2" />
  </svg>
);

const OgiveCurve = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,35 Q15,35 25,20 T35,5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const UniformDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <rect x="5" y="15" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="5" y1="15" x2="35" y2="15" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ExponentialDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,5 Q5,35 35,35" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BinomialDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <rect x="5" y="32" width="3" height="3" fill="currentColor" />
    <rect x="10" y="25" width="3" height="10" fill="currentColor" />
    <rect x="15" y="15" width="3" height="20" fill="currentColor" />
    <rect x="20" y="10" width="3" height="25" fill="currentColor" />
    <rect x="25" y="18" width="3" height="17" fill="currentColor" />
    <rect x="30" y="28" width="3" height="7" fill="currentColor" />
  </svg>
);

const BetaDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,35 C10,5 30,5 35,35" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ChiSquareDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,35 C5,5 15,15 35,35" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const FDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M5,35 C5,0 12,25 35,35" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const TDistribution = () => (
  <svg viewBox="0 0 40 40" className="w-12 h-12 opacity-40">
    <path d="M2,35 C10,35 20,10 20,10 C20,10 30,35 38,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const STAT_VISUALIZATIONS = [
  NormalCurve, BoxPlot, PieChart, LineGraph, RegressionPlot, 
  Histogram, VennDiagram, BarChart, RadarChart, AreaChart,
  ScatterPlot, StepChart, SigmoidCurve, BubbleChart, Candlestick,
  Heatmap, FunnelChart, OgiveCurve, UniformDistribution,
  ExponentialDistribution, BinomialDistribution, BetaDistribution,
  ChiSquareDistribution, FDistribution, TDistribution
];

const EXTENDED_SYMBOLS = [
  'Σ', 'μ', 'σ', 'π', 'χ²', 'ρ', 'β', 'α', 'n', 'k', 'Δ', 'θ', 'λ', 'ω', 'Φ', 'Ψ', 'Ω', 'ζ', 'η', 'τ', 'ε', 'ν', 'ξ', 
  'σ²', 'f(x)', '∫', '∬', 'lim', '∞', '≈', '≠', '≤', '≥', '√', 'log', 'ln', 'sin', 'cos', 'tan', 'P(A)', 'E(X)', 'Var(X)', 'r', 'R²', 'z', 't', 'F'
];

const FloatingSymbols = memo(() => {
  const items = useMemo(() => {
    const rows = 7; 
    const cols = 6;
    const count = rows * cols; // 42 items
    
    const allTypes = [
      ...STAT_VISUALIZATIONS.map(v => ({ type: 'viz', content: v })),
      ...EXTENDED_SYMBOLS.map(s => ({ type: 'symbol', content: s }))
    ];
    
    const shuffledTypes = [...allTypes].sort(() => Math.random() - 0.5);
    const pool = shuffledTypes.slice(0, count);
    const finalPool = pool.sort(() => Math.random() - 0.5);

    return finalPool.map((typeObj, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const initialX = (col * (100 / cols)) + (Math.random() * 5);
      const initialY = (row * (100 / rows)) + (Math.random() * 5);
      
      // Half move left, half move right
      const direction = row % 2 === 0 ? 1 : -1;
      
      return {
        id: i,
        initialX,
        initialY,
        direction,
        type: typeObj.type,
        content: typeObj.content,
        // Amplitude for "all directions" sine wave - keep it small to avoid lane crossing
        amplitude: 4 + Math.random() * 2, 
        duration: 40 + Math.random() * 20,
        scale: (0.8 + Math.random() * 0.4) * 1.3,
        rotateOffset: Math.random() * 360
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.3]">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ 
            left: item.initialX + '%', 
            top: item.initialY + '%',
            rotate: item.rotateOffset,
            scale: item.scale,
            opacity: 0
          }}
          animate={{
            // Moving in lanes (Horizontal) + Sine Wave (Vertical) = Movement in all directions
            left: [
              item.initialX + '%',
              (item.initialX + (item.direction * 100)) + '%'
            ],
            top: [
              item.initialY + '%',
              (item.initialY + item.amplitude) + '%',
              item.initialY + '%',
              (item.initialY - item.amplitude) + '%',
              item.initialY + '%'
            ],
            opacity: [0, 0.4, 0.4, 0]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
            // Top (wave) should maybe be a different duration or ease to feel more organic,
            // but keeping it simple for "no crossing" predictability
          }}
          className="absolute text-slate-900 select-none flex items-center justify-center transform-gpu"
        >
          {item.type === 'symbol' ? (
            <span className="font-serif text-4xl md:text-6xl font-black">{item.content as string}</span>
          ) : (
            <div className="scale-150">
              {/* @ts-ignore */}
              <item.content />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
});

FloatingSymbols.displayName = 'FloatingSymbols';

export default FloatingSymbols;
