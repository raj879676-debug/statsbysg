import React, { useEffect, useRef, useMemo } from 'react';

// Math helpers for statistical distributions
const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (n > 20) { // Approximation for larger n to avoid overflow
     return Math.exp(Math.log(gamma(n + 1)) - Math.log(gamma(k + 1)) - Math.log(gamma(n - k + 1)));
  }
  return factorial(n) / (factorial(k) * factorial(n - k));
};

const gamma = (z: number): number => {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916244059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};

// Distribution PDF functions
const pdf = {
  normal: (x: number, mu: number, sigma: number) => 
    (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)),
  
  exponential: (x: number, lambda: number) => 
    x < 0 ? 0 : lambda * Math.exp(-lambda * x),
  
  uniform: (x: number, a: number, b: number) => 
    (x >= a && x <= b) ? 1 / (b - a) : 0,
  
  beta: (x: number, alpha: number, beta: number) => {
    if (x < 0 || x > 1) return 0;
    const B = (gamma(alpha) * gamma(beta)) / gamma(alpha + beta);
    return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / B;
  },
  
  gamma: (x: number, k: number, theta: number) => {
    if (x < 0) return 0;
    return (1 / (Math.pow(theta, k) * gamma(k))) * Math.pow(x, k - 1) * Math.exp(-x / theta);
  },
  
  chiSquare: (x: number, df: number) => pdf.gamma(x, df / 2, 2),
  
  t: (x: number, df: number) => {
    const term1 = gamma((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gamma(df / 2));
    const term2 = Math.pow(1 + (x * x) / df, -(df + 1) / 2);
    return term1 * term2;
  },
  
  f: (x: number, d1: number, d2: number) => {
    if (x <= 0) return 0;
    const numerator = Math.sqrt(Math.pow(d1 * x, d1) * Math.pow(d2, d2) / Math.pow(d1 * x + d2, d1 + d2));
    const denominator = x * (gamma(d1 / 2) * gamma(d2 / 2) / gamma((d1 + d2) / 2));
    return numerator / denominator || 0;
  },
  
  logNormal: (x: number, mu: number, sigma: number) => {
    if (x <= 0) return 0;
    return (1 / (x * sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma));
  },
  
  pareto: (x: number, xm: number, alpha: number) => {
    if (x < xm) return 0;
    return (alpha * Math.pow(xm, alpha)) / Math.pow(x, alpha + 1);
  },
  
  weibull: (x: number, lambda: number, k: number) => {
    if (x < 0) return 0;
    return (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k));
  },
  
  cauchy: (x: number, x0: number, gammaVal: number) => {
    return 1 / (Math.PI * gammaVal * (1 + Math.pow((x - x0) / gammaVal, 2)));
  }
};

const pmf = {
  bernoulli: (k: number, p: number) => (k === 0 ? 1 - p : k === 1 ? p : 0),
  binomial: (k: number, n: number, p: number) => combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k),
  poisson: (k: number, lambda: number) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k || 0),
  geometric: (k: number, p: number) => Math.pow(1 - p, k) * p,
  negativeBinomial: (k: number, r: number, p: number) => combinations(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r),
  discreteUniform: (k: number, a: number, b: number) => (k >= a && k <= b && Number.isInteger(k)) ? 1 / (b - a + 1) : 0,
  hypergeometric: (k: number, N: number, K: number, n: number) => {
    if (k < Math.max(0, n + K - N) || k > Math.min(n, K)) return 0;
    return (combinations(K, k) * combinations(N - K, n - k)) / combinations(N, n);
  }
};

const StatisticalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    
    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', resize);
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    resize();
    
    const drawCurve = (
      points: { x: number; y: number }[], 
      color: string, 
      width: number, 
      opacity: number,
      dash: number[] = []
    ) => {
      ctx.beginPath();
      ctx.setLineDash(dash);
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = width;
      
      if (points.length < 2) return;
      
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    };

    const render = () => {
      time += 0.005; // Slower time step for better visualization
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;

      // Only show visualizations on screen widths >= 600px to avoid clutter on mobile
      if (width < 600) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      
      // Responsive scale and gap logic - positioned to be beside the main heading with space
      const scale = Math.min(width * 0.05, 80); 
      const gap = width * 0.32; 
      
      const cycleTime = 10; 
      const drawDelay = 0; // Start drawing immediately
      const drawDuration = 5; // 5 seconds to draw
      const currentTime = time;

      // Define balanced sequence items
      const leftSequence = [
        // PMF
        { 
          type: 'pmf', 
          name: 'Bernoulli Distribution', 
          color: '#8b5cf6', 
          fn: (k: number) => pmf.bernoulli(k, 0.5), 
          range: [0, 1], 
          formula: 'P(X=x) = p^x (1-p)^(1-x)',
          mean: 'p', 
          var: 'p(1-p)'
        },
        { 
          type: 'pmf', 
          name: 'Binomial Distribution', 
          color: '#3b82f6', 
          fn: (k: number) => pmf.binomial(k, 20, 0.5), 
          range: [0, 20], 
          formula: 'P(X=x) = C(n,x) p^x (1-p)^(n-x)',
          mean: 'np', 
          var: 'np(1-p)'
        },
        { 
          type: 'pmf', 
          name: 'Poisson Distribution', 
          color: '#ef4444', 
          fn: (k: number) => pmf.poisson(k, 10), 
          range: [0, 25], 
          formula: 'P(X=x) = (e^-λ λ^x) / x!',
          mean: 'λ', 
          var: 'λ'
        },
        { 
          type: 'pmf', 
          name: 'Geometric Distribution', 
          color: '#10b981', 
          fn: (k: number) => pmf.geometric(k, 0.2), 
          range: [0, 20], 
          formula: 'P(X=x) = (1-p)^(x-1) p',
          mean: '1/p', 
          var: '(1-p)/p^2'
        },
        { 
          type: 'pmf', 
          name: 'Negative Binomial', 
          color: '#f97316', 
          fn: (k: number) => pmf.negativeBinomial(k, 5, 0.5), 
          range: [5, 25], 
          formula: 'P(X=x) = C(x-1, r-1) p^r (1-p)^(x-r)',
          mean: 'r/p', 
          var: 'r(1-p)/p^2'
        },
        { 
          type: 'pmf', 
          name: 'Hypergeometric', 
          color: '#ec4899', 
          fn: (k: number) => pmf.hypergeometric(k, 50, 10, 10), 
          range: [0, 10], 
          formula: 'P(X=x) = [C(K,x) C(N-K, n-x)] / C(N,n)',
          mean: 'n(K/N)', 
          var: 'n(K/N)(1-K/N)(N-n)/(N-1)'
        },
        { 
          type: 'pmf', 
          name: 'Discrete Uniform', 
          color: '#f59e0b', 
          fn: (k: number) => pmf.discreteUniform(k, 1, 10), 
          range: [1, 10], 
          formula: 'P(X=x) = 1/n',
          mean: '(a+b)/2', 
          var: '((b-a+1)^2 - 1)/12'
        },
        
        { type: 'chart', name: 'Stacked Bar Chart', color: '#ef4444', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          const data = [0.4, 0.6, 0.8, 0.7, 0.9, 0.5];
          const data2 = [0.3, 0.2, 0.4, 0.5, 0.3, 0.4];
          const limit = Math.ceil(data.length * p);
          for(let i=0; i<limit; i++) {
            const h1 = data[i]*s; const h2 = data2[i]*s;
            ctx.fillStyle = '#ef4444'; ctx.fillRect(x - s*1.0 + i*s*0.35, y - h1, s*0.25, h1);
            ctx.fillStyle = '#3b82f6'; ctx.fillRect(x - s*1.0 + i*s*0.35, y - h1 - h2, s*0.25, h2);
          }
        }},
        { type: 'chart', name: 'Grouped Bar Chart', color: '#8b5cf6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          const dataA = [0.5, 0.8, 0.6, 0.9];
          const dataB = [0.3, 0.5, 0.4, 0.7];
          const limit = Math.ceil(dataA.length * p);
          for(let i=0; i<limit; i++) {
            const h1 = dataA[i]*s; const h2 = dataB[i]*s;
            ctx.fillStyle = '#8b5cf6'; ctx.fillRect(x - s*0.9 + i*s*0.45, y - h1, s*0.2, h1);
            ctx.fillStyle = '#10b981'; ctx.fillRect(x - s*0.9 + i*s*0.45 + s*0.22, y - h2, s*0.2, h2);
          }
        }},
        { type: 'chart', name: 'Frequency Polygon', color: '#f59e0b', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          const data = [0.2, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4, 0.3];
          const limit = Math.ceil(data.length * p);
          const pts = []; 
          for(let i=0; i<limit; i++) pts.push({ x: x - s*1.0 + i*s*0.3, y: y - data[i]*s*1.2 });
          if(pts.length > 0) {
            drawCurve(pts, '#f59e0b', 2.5, opacity);
            pts.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI*2); ctx.fillStyle='#f59e0b'; ctx.globalAlpha = opacity; ctx.fill(); });
          }
        }},
        { type: 'chart', name: 'Ogive Chart', color: '#a855f7', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          const pts = []; for(let i=0; i<=10*p; i++) pts.push({ x: x - s*1.0 + i*s*0.2, y: y - (i/10)*s*1.2 });
          drawCurve(pts, '#a855f7', 3, opacity);
        }},
        { type: 'chart', name: 'Bar Chart (Vertical)', color: '#ef4444', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.globalAlpha = opacity * 0.8;
            for(let i=0; i<8*p; i++) { const h = (0.3 + Math.sin(i)*0.2)*s*1.5; ctx.fillStyle = '#ef4444'; ctx.fillRect(x - s*1.0 + i*s*0.25, y - h, s*0.18, h); }
        }},
        { type: 'chart', name: 'Bar Chart (Horizontal)', color: '#8b5cf6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.globalAlpha = opacity * 0.8;
            for(let i=0; i<6*p; i++) { const w = (0.5 + Math.cos(i)*0.3)*s*1.8; ctx.fillStyle = '#8b5cf6'; ctx.fillRect(x - s*1.0, y - s*1.5 + i*s*0.25, w, s*0.18); }
        }},
        { type: 'chart', name: 'Waterfall Chart', color: '#10b981', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          const steps = [0.4, 0.3, -0.2, 0.5, -0.1, 0.6];
          let curr = y - s*0.4;
          const limit = Math.ceil(steps.length * p);
          for(let i=0; i<limit; i++) {
            const h = steps[i]*s; ctx.fillStyle = h > 0 ? '#10b981' : '#ef4444';
            ctx.fillRect(x - s*1.0 + i*s*0.35, curr, s*0.25, -h); 
            curr -= h;
          }
        }},
        { type: 'chart', name: 'Gantt Chart', color: '#3b82f6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          for(let i=0; i<5*p; i++) {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(x - s*1.0 + i*s*0.3, y - s*1.2 + i*s*0.25, s*0.6, s*0.1);
          }
        }},
        { type: 'chart', name: 'Sankey Diagram', color: '#14b8a6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          for(let i=0; i<4*p; i++) {
            ctx.beginPath(); ctx.moveTo(x - s*1.2, y - s*0.9 + i*s*0.3);
            ctx.bezierCurveTo(x, y - s*0.9 + i*s*0.3, x, y - s*0.4, x + s*1.2, y - s*0.4);
            ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)'; ctx.globalAlpha = opacity * 0.4; ctx.lineWidth = 12; ctx.stroke();
          }
        }},
        { type: 'chart', name: 'Flowchart', color: '#475569', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity;
          if(p>0.2) ctx.strokeRect(x-s*0.5, y-s*1.5, s, s*0.4);
          if(p>0.4) { ctx.beginPath(); ctx.moveTo(x, y-s*1.1); ctx.lineTo(x, y-s*0.8); ctx.stroke(); }
          if(p>0.6) { ctx.beginPath(); ctx.moveTo(x, y-s*0.8); ctx.lineTo(x-s*0.5, y-s*0.4); ctx.lineTo(x+s*0.5, y-s*0.4); ctx.closePath(); ctx.stroke(); }
        }},
        { type: 'chart', name: 'Pareto Chart', color: '#3b82f6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          for(let i=0; i<6*p; i++) {
            const h = s*(1.2 - i*0.15); ctx.fillStyle = '#3b82f6'; ctx.fillRect(x - s*1.0 + i*s*0.35, y - h, s*0.28, h);
          }
          ctx.beginPath(); ctx.moveTo(x - s*1.0, y - s*1.2);
          for(let i=0; i<6*p; i++) { ctx.lineTo(x - s*1.0 + i*s*0.35, y - s*1.2 + i*s*0.15); }
          ctx.strokeStyle = '#ef4444'; ctx.globalAlpha = opacity; ctx.stroke();
        }}

      ];

      const rightSequence = [
        // PDF
        { 
          type: 'pdf', 
          name: 'Normal Distribution', 
          color: '#3b82f6', 
          fn: (x: number) => pdf.normal(x, 0, 1), 
          range: [-4, 4], 
          formula: 'f(x) = [1/(σ√(2π))] e^(-1/2((x-μ)/σ)^2)',
          mean: 'μ', 
          var: 'σ^2'
        },
        { 
          type: 'pdf', 
          name: 'Exponential Distribution', 
          color: '#ef4444', 
          fn: (x: number) => pdf.exponential(x, 1), 
          range: [0, 5], 
          formula: 'f(x) = λ e^(-λx)',
          mean: '1/λ', 
          var: '1/λ^2'
        },
        { 
          type: 'pdf', 
          name: 'Continuous Uniform', 
          color: '#f59e0b', 
          fn: (x: number) => pdf.uniform(x, 0, 1), 
          range: [0, 1], 
          formula: 'f(x) = 1/(b-a)',
          mean: '(a+b)/2', 
          var: '(b-a)^2/12'
        },
        { 
          type: 'pdf', 
          name: 'Gamma Distribution', 
          color: '#10b981', 
          fn: (x: number) => pdf.gamma(x, 2, 2), 
          range: [0, 15], 
          formula: 'f(x) = [β^α / Γ(α)] x^(α-1) e^(-βx)',
          mean: 'α/β', 
          var: 'α/β^2'
        },
        { 
          type: 'pdf', 
          name: 'Beta Distribution', 
          color: '#8b5cf6', 
          fn: (x: number) => pdf.beta(x, 3, 6), 
          range: [0, 1], 
          formula: 'f(x) = [x^(α-1) (1-x)^(β-1)] / B(α,β)',
          mean: 'α/(α+β)', 
          var: '(αβ) / [(α+β)^2 (α+β+1)]'
        },
        { 
          type: 'pdf', 
          name: 'Chi-Squared Distribution', 
          color: '#ec4899', 
          fn: (x: number) => pdf.chiSquare(x, 4), 
          range: [0, 15], 
          formula: 'f(x) = [1/(2^(k/2) Γ(k/2))] x^(k/2-1) e^(-x/2)',
          mean: 'k', 
          var: '2k'
        },
        { 
          type: 'pdf', 
          name: 'Cauchy Distribution', 
          color: '#ec4899', 
          fn: (x: number) => pdf.cauchy(x, 0, 1), 
          range: [-5, 5], 
          formula: 'f(x) = 1 / [π γ (1 + ((x-x0)/γ)^2)]',
          mean: 'Undefined', 
          var: 'Undefined' 
        },
        { 
          type: 'pdf', 
          name: 'Log-Normal Distribution', 
          color: '#14b8a6', 
          fn: (x: number) => pdf.logNormal(x, 0, 0.5), 
          range: [0.1, 5], 
          formula: 'f(x) = [1/(xσ√(2π))] e^(-(ln x - μ)^2 / (2σ^2))',
          mean: 'e^(μ + σ^2/2)', 
          var: '(e^σ^2 - 1) e^(2μ + σ^2)'
        },
        { 
          type: 'pdf', 
          name: 'Weibull Distribution', 
          color: '#a855f7', 
          fn: (x: number) => pdf.weibull(x, 1, 2), 
          range: [0, 3], 
          formula: 'f(x) = (k/λ) (x/λ)^(k-1) e^(-(x/λ)^k)',
          mean: 'λ Γ(1 + 1/k)', 
          var: 'λ^2 [Γ(1 + 2/k) - (Γ(1 + 1/k))^2]'
        },
        
        // Charts
        { type: 'chart', name: 'Donut Chart', color: '#10b981', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            let start = 0; [0.2, 0.3, 0.25, 0.25].forEach((v, i) => { 
                ctx.beginPath(); ctx.moveTo(x + s*0.2, y - s*1.0); ctx.arc(x + s*0.2, y - s*1.0, s*0.8*p, start, start + v*Math.PI*2); 
                ctx.strokeStyle = ['#3b82f6', '#ef4444', '#8b5cf6', '#10b981'][i]; ctx.lineWidth = s*0.3; ctx.globalAlpha = opacity; ctx.stroke(); start += v*Math.PI*2; 
            });
        }},
        { type: 'chart', name: 'Funnel Chart', color: '#8b5cf6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          for(let i=0; i<5*p; i++) { const w = s*(2 - i*0.4); ctx.fillStyle = '#8b5cf6'; ctx.fillRect(x + s*0.2 - w/2, y - s*1.5 + i*s*0.35, w, s*0.3); }
        }},
        { type: 'chart', name: 'Treemap', color: '#8b5cf6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          const rects = [[0,0,1,1], [1,0,0.5,0.5], [1,0.5,0.5,0.5], [0,1,0.7,0.5], [0.7,1,0.8,0.5]];
          rects.slice(0, Math.floor(rects.length*p)).forEach((r, i) => {
            ctx.globalAlpha = opacity * 0.8;
            ctx.fillStyle = `hsl(${260 + i*20}, 70%, 60%)`;
            ctx.fillRect(x - s*1.0 + r[0]*s*1.6, y - s*1.8 + r[1]*s*1.2, r[2]*s*0.8, r[3]*s*0.8);
            ctx.strokeStyle = '#fff'; ctx.strokeRect(x - s*1.0 + r[0]*s*1.6, y - s*1.8 + r[1]*s*1.2, r[2]*s*0.8, r[3]*s*0.8);
          });
        }},
        { type: 'chart', name: 'Venn Diagram', color: '#ec4899', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.globalAlpha = 0.4 * p * opacity;
            ctx.fillStyle='#3b82f6'; ctx.beginPath(); ctx.arc(x - s*0.3, y - s*1.0, s*0.65, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(x + s*0.4, y - s*1.0, s*0.65, 0, Math.PI*2); ctx.fill();
        }},
        { type: 'chart', name: 'Radar Chart', color: '#f59e0b', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.globalAlpha = opacity;
            ctx.beginPath(); for(let i=0; i<6; i++) {
                const a = (i/6)*Math.PI*2; const r = (0.4 + Math.sin(i*2)*0.2)*s*1.0*p; // Reduced radius slightly
                const px = x + s*0.2 + Math.cos(a)*r; const py = y - s*1.0 + Math.sin(a)*r; // Shifted center up
                if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.strokeStyle='#f59e0b'; ctx.lineWidth=3; ctx.stroke();
        }},
        { type: 'chart', name: 'Pictograph', color: '#ec4899', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          for(let i=0; i<5*p; i++) {
            for(let j=0; j<5; j++) {
              ctx.beginPath(); ctx.arc(x - s*0.7 + i*s*0.35, y - s*1.6 + j*s*0.35, 6, 0, Math.PI*2);
              ctx.fillStyle = '#ec4899'; ctx.fill();
            }
          }
        }},
        { type: 'chart', name: 'Line Graph', color: '#3b82f6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            const pts = []; for(let i=0; i<=20*p; i++) pts.push({ x: x - s*0.8 + i*s*0.1, y: y - s*0.6 + Math.sin(i*0.5)*s*0.25 });
            drawCurve(pts, '#3b82f6', 2.5, opacity);
        }},
        { type: 'chart', name: 'Area Chart', color: '#3b82f6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.beginPath(); ctx.moveTo(x - s*0.8, y - s*0.1);
            for(let i=0; i<=20*p; i++) { ctx.lineTo(x - s*0.8 + i*s*0.1, y - s*0.1 - (0.5 + Math.sin(i*0.4)*0.3)*s*0.8); }
            ctx.lineTo(x - s*0.8 + 20*p*s*0.1, y - s*0.1); ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'; ctx.globalAlpha = opacity * 0.3; ctx.fill();
        }},
        { type: 'chart', name: 'Histogram', color: '#ef4444', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.globalAlpha = opacity * 0.8;
          for(let i=0; i<12*p; i++) { const h = (0.2 + Math.exp(-Math.pow(i-6, 2)/10)*0.8)*s*1.2; ctx.fillStyle = '#ef4444'; ctx.fillRect(x - s*0.8 + i*s*0.18, y - s*0.1 - h, s*0.16, h); }
        }},
        { type: 'chart', name: 'Less Than Ogive', color: '#10b981', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.beginPath(); ctx.moveTo(x - s*0.8, y - s*0.1);
            for(let i=0; i<=20*p; i++) { 
                const val = (1 - Math.exp(-i*0.2)) * s * 1.2;
                ctx.lineTo(x - s*0.8 + i*s*0.1, y - s*0.1 - val); 
            }
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3; ctx.globalAlpha = opacity; ctx.stroke();
            // Fill area
            ctx.lineTo(x - s*0.8 + 20*p*s*0.1, y - s*0.1); ctx.closePath();
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'; ctx.fill();
        }},
        { type: 'chart', name: 'More Than Ogive', color: '#ef4444', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.beginPath(); ctx.moveTo(x - s*0.8, y - s*0.1 - s*1.2);
            for(let i=0; i<=20*p; i++) { 
                const val = Math.exp(-i*0.2) * s * 1.2;
                ctx.lineTo(x - s*0.8 + i*s*0.1, y - s*0.1 - val); 
            }
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.globalAlpha = opacity; ctx.stroke();
            // Fill area
            ctx.lineTo(x - s*0.8 + 20*p*s*0.1, y - s*0.1); ctx.lineTo(x - s*0.8, y - s*0.1); ctx.closePath();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; ctx.fill();
        }},
        { type: 'chart', name: 'Scatter Plot', color: '#10b981', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.globalAlpha = opacity * 0.8;
            const points = [
              [0.2, 0.8], [0.4, 0.6], [0.5, 0.9], [0.7, 0.4], [0.9, 0.7], 
              [0.1, 0.5], [0.3, 0.3], [0.6, 0.8], [0.8, 0.2], [1.2, 0.6],
              [1.5, 0.9], [1.8, 0.5], [1.3, 0.4], [1.7, 0.1], [2.0, 0.3]
            ];
            const limit = Math.ceil(points.length * p);
            for(let i=0; i<limit; i++) { 
                ctx.beginPath(); ctx.arc(x - s*0.8 + points[i][0]*s, y - s*0.1 - points[i][1]*s*1.2, 3.5, 0, Math.PI*2); 
                ctx.fillStyle = '#10b981'; ctx.fill(); 
            }
        }},
        { type: 'chart', name: 'Box Plot', color: '#06b6d4', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            ctx.strokeStyle='#06b6d4'; ctx.lineWidth=3; ctx.globalAlpha = opacity;
            if(p > 0.5) {
                ctx.strokeRect(x - s*0.5, y - s*1.2, s*2, s*0.6);
                ctx.beginPath(); ctx.moveTo(x - s*1.0, y - s*0.9); ctx.lineTo(x - s*0.5, y - s*0.9); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(x + s*1.5, y - s*0.9); ctx.lineTo(x + s*2.0, y - s*0.9); ctx.stroke();
            }
        }},
        { type: 'chart', name: 'Violin Plot', color: '#14b8a6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.beginPath(); ctx.fillStyle = '#14b8a6'; ctx.globalAlpha = opacity * 0.8;
          for(let i=-s*1.5*p; i<0; i+=2) { const w = Math.sin((i/(s*1.5))*Math.PI)*s*0.5; ctx.lineTo(x + s*0.5 + w, y - s*0.1 + i); }
          for(let i=0; i>-s*1.5*p; i-=2) { const w = -Math.sin((i/(s*1.5))*Math.PI)*s*0.5; ctx.lineTo(x + s*0.5 + w, y - s*0.1 + i); }
          ctx.fill();
        }},
        { type: 'chart', name: 'Heat Map', color: '#f97316', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            const data = [
              [0.8, 0.2, 0.5, 0.9, 0.3],
              [0.4, 0.7, 0.1, 0.6, 0.8],
              [0.9, 0.3, 0.6, 0.2, 0.4],
              [0.2, 0.8, 0.4, 0.7, 0.1],
              [0.6, 0.1, 0.9, 0.3, 0.5]
            ];
            const rows = Math.min(5, Math.ceil(5 * p * 2));
            for(let i=0; i<rows; i++) {
                for(let j=0; j<5; j++) {
                    const val = data[i][j];
                    ctx.fillStyle = `rgba(249, 115, 22, ${val})`;
                    ctx.globalAlpha = opacity;
                    ctx.fillRect(x - s*0.8 + i*s*0.4, y - s*1.4 + j*s*0.3, s*0.35, s*0.25);
                }
            }
        }},
        { type: 'chart', name: 'Bubble Chart', color: '#ec4899', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          const bubbles = [
            [0.2, 0.4, 20], [0.5, 0.8, 30], [0.8, 0.3, 25], 
            [1.2, 0.7, 35], [1.5, 0.5, 20], [1.8, 0.9, 40],
            [0.3, 0.9, 15], [0.7, 1.2, 28], [1.4, 1.1, 22], [1.9, 0.2, 33]
          ];
          const limit = Math.ceil(bubbles.length * p);
          for(let i=0; i<limit; i++) {
            const [bx, by, r] = bubbles[i];
            ctx.beginPath(); 
            ctx.arc(x - s*0.8 + bx*s, y - s*0.1 - by*s, (r/40)*s, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(236, 72, 153, 0.5)'; 
            ctx.globalAlpha = opacity * 0.5; 
            ctx.fill();
          }
        }},
        { type: 'chart', name: 'Chord Diagram', color: '#6366f1', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.beginPath(); ctx.arc(x + s*0.2, y - s*0.8, s*0.8, 0, Math.PI*2); ctx.strokeStyle = '#6366f1'; ctx.globalAlpha = opacity; ctx.stroke();
          const limit = Math.ceil(10 * p);
          for(let i=0; i<limit; i++) {
            const a1 = (i*0.6) % (Math.PI*2); const a2 = (i*2.1) % (Math.PI*2);
            ctx.beginPath(); ctx.moveTo(x + s*0.2 + Math.cos(a1)*s*0.8, y - s*0.8 + Math.sin(a1)*s*0.8);
            ctx.quadraticCurveTo(x + s*0.2, y - s*0.8, x + s*0.2 + Math.cos(a2)*s*0.8, y - s*0.8 + Math.sin(a2)*s*0.8);
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'; ctx.globalAlpha = opacity * 0.3; ctx.stroke();
          }
        }},
        { type: 'chart', name: 'Smith Chart', color: '#475569', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.beginPath(); ctx.arc(x + s*0.2, y - s*0.8, s*0.8, 0, Math.PI*2); ctx.strokeStyle = '#475569'; ctx.globalAlpha = opacity; ctx.stroke();
          for(let i=1; i<5*p; i++) { ctx.beginPath(); ctx.arc(x + s*0.2 + s*0.8 - s*0.8/i, y - s*0.8, s*0.8/i, 0, Math.PI*2); ctx.stroke(); }
        }},
        { type: 'chart', name: 'Phase Portrait', color: '#ec4899', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
            for(let i=0; i<10*p; i++) {
                ctx.beginPath(); ctx.strokeStyle = '#ec4899'; ctx.globalAlpha = opacity;
                for(let t=0; t<20; t++) {
                    const r = (i*0.1 + t*0.01)*s; const px = x + s*0.2 + Math.cos(t*0.5)*r; const py = y - s*0.8 + Math.sin(t*0.5)*r;
                    if(t===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
        }},
        { type: 'chart', name: 'Ternary Plot', color: '#10b981', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.beginPath(); ctx.moveTo(x + s*0.2, y - s*1.4); ctx.lineTo(x - s*0.6, y - s*0.2); ctx.lineTo(x + s*1.0, y - s*0.2); ctx.closePath(); ctx.strokeStyle = '#10b981'; ctx.globalAlpha = opacity; ctx.stroke();
          const points = [[0.2, 0.3], [0.5, 0.1], [0.1, 0.6], [0.4, 0.4], [0.6, 0.2], [0.3, 0.5], [0.7, 0.1], [0.2, 0.7]];
          const limit = Math.ceil(points.length * p);
          for(let i=0; i<limit; i++) {
            const [a, b] = points[i]; const c = 1-a-b;
            const px = x + s*0.2 + (c - b)*s*0.8; const py = y - s*0.2 - a*s*1.2;
            ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2); ctx.fillStyle = '#10b981'; ctx.fill();
          }
        }},
        { type: 'chart', name: 'Control Chart', color: '#475569', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(x-s*0.8, y-s*0.9); ctx.lineTo(x+s*1.2, y-s*0.9); ctx.strokeStyle = '#475569'; ctx.globalAlpha = opacity * 0.5; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x-s*0.8, y-s*0.3); ctx.lineTo(x+s*1.2, y-s*0.3); ctx.stroke();
          ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x-s*0.8, y-s*0.6);
          for(let i=1; i<=15*p; i++) { 
            const dy = (Math.sin(i*2) * 0.12) + (Math.cos(i*3.5) * 0.08); 
            ctx.lineTo(x-s*0.8+i*s*0.13, y-s*0.6+dy*s); 
          }
          ctx.strokeStyle='#3b82f6'; ctx.globalAlpha = opacity; ctx.stroke();
        }},
        { type: 'chart', name: 'QQ-Plot', color: '#8b5cf6', draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p: number, opacity: number) => {
          ctx.beginPath(); ctx.moveTo(x-s*0.8, y - s*0.1); ctx.lineTo(x+s*1.2, y-s*1.3); ctx.strokeStyle = '#8b5cf6'; ctx.globalAlpha = opacity * 0.5; ctx.stroke();
          const limit = Math.ceil(20 * p);
          for(let i=0; i<limit; i++) {
            const xv = (i/20)*s*2 - s*1.0; 
            const noise = (Math.sin(i*4) * 0.05);
            const yv = xv*0.6 + noise*s;
            ctx.beginPath(); ctx.arc(x + s*0.2 + xv, y - s*0.7 - yv, 3, 0, Math.PI*2); ctx.fillStyle = '#8b5cf6'; ctx.globalAlpha = opacity; ctx.fill();
          }
        }}

      ];

      const drawItem = (item: any, posX: number, posY: number, progress: number) => {
        const drawProgress = Math.min(1, Math.max(0, (progress * cycleTime - drawDelay) / drawDuration));
        let opacity = 1;
        if (progress > 0.9) opacity = (1 - progress) / 0.1;
        if (progress < 0.1) opacity = progress / 0.1;

        ctx.save();
        
        const axisLeft = posX - scale * 1.2;
        const axisRight = posX + scale * 1.5;
        const axisBottom = posY;
        const axisTop = posY - scale * 3.0; // Increased height significantly for full peaks

        // Draw Axes
        ctx.globalAlpha = opacity * 0.8;
        ctx.strokeStyle = item.color || '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(axisLeft, axisBottom);
        ctx.lineTo(axisRight, axisBottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(axisLeft, axisBottom - scale * 1.5); // Axis line height
        ctx.lineTo(axisLeft, axisBottom);
        ctx.stroke();

        // Clipping to prevent overflow - strictly within axes boundaries
        ctx.save();
        ctx.beginPath();
        ctx.rect(axisLeft, axisTop, (axisRight - axisLeft), (axisBottom - axisTop));
        ctx.clip();
        
        if (progress * cycleTime >= drawDelay) {
          if (item.type === 'pdf') {
            const pts = [];
            const [start, end] = item.range!;
            const steps = 150;
            const limit = Math.floor(steps * drawProgress);
            // Beta distribution is made smaller as per request
            const customScale = item.name === 'Beta Distribution' ? 0.6 : 1.2;
            for(let i=0; i<=limit; i++) {
              const xv = start + (i/steps)*(end - start);
              const yv = (item as any).fn(xv);
              pts.push({ x: posX - scale*1.0 + (i/steps)*scale*2.1, y: posY - yv*scale*customScale });
            }
            drawCurve(pts, item.color!, 3.5, opacity);
          } else if (item.type === 'pmf') {
            const [start, end] = item.range!;
            const range = end - start;
            const limit = Math.floor(range * drawProgress);
            for(let k=start; k<=start + limit; k++) {
              const val = (item as any).fn(k);
              const px = posX - scale*1.0 + ((k-start)/range)*scale*2.1;
              const py = posY - val*scale*1.2;
              ctx.beginPath(); ctx.moveTo(px, posY); ctx.lineTo(px, py); ctx.stroke();
              ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
            }
          } else if (item.type === 'chart') {
             (item as any).draw(ctx, posX, posY, scale, drawProgress, opacity);
          }
        }
        ctx.restore(); // Restore from clipping

        ctx.globalAlpha = opacity * 0.8;
        ctx.fillStyle = item.color || '#475569';
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(item.name, posX, posY + 55);

        ctx.restore();
      };

      const renderCycling = (sequence: any[], posX: number, posY: number) => {
        const index = Math.floor(currentTime / cycleTime) % sequence.length;
        const item = sequence[index];
        const progress = (currentTime % cycleTime) / cycleTime;
        drawItem(item, posX, posY, progress);
      };

      const midY = centerY + height * 0.08; // Shifted further downward as requested
      renderCycling(leftSequence, centerX - gap, midY);
      renderCycling(rightSequence, centerX + gap, midY);

      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 -z-10 pointer-events-none opacity-70 select-none"
    />
  );
};

export default StatisticalBackground;
