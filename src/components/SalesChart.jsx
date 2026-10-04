import React, { useState } from 'react';

export default function SalesChart({ data, height = 240 }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // Normalization logic
  const values = data.map(d => d.value);
  const minVal = 0;
  const maxVal = 35000;

  const width = 600;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  // Generate cubic bezier smooth curve
  const createCurvedPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX1 = current.x + (next.x - current.x) / 2;
      const controlY1 = current.y;
      const controlX2 = current.x + (next.x - current.x) / 2;
      const controlY2 = next.y;
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = createCurvedPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="sales-chart-wrapper" style={{ position: 'relative', width: '100%' }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="sales-svg-chart"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[10000, 20000, 30000].map((level) => {
          const y = paddingY + chartHeight - ((level - minVal) / (maxVal - minVal)) * chartHeight;
          return (
            <g key={level}>
              <line 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke="#e2e8f0" 
                strokeDasharray="4 4" 
                strokeWidth="1"
              />
              <text 
                x={paddingX - 10} 
                y={y + 4} 
                textAnchor="end" 
                fill="#94a3b8" 
                fontSize="11"
                fontWeight="500"
              >
                {level / 1000}k
              </text>
            </g>
          );
        })}

        {/* 0 Baseline */}
        <line 
          x1={paddingX} 
          y1={height - paddingY} 
          x2={width - paddingX} 
          y2={height - paddingY} 
          stroke="#cbd5e1" 
          strokeWidth="1"
        />

        {/* Gradient Area Fill */}
        <path d={areaPath} fill="url(#salesGradient)" />

        {/* Smooth Curved Line */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="#1868f7" 
          strokeWidth="3" 
          strokeLinecap="round"
        />

        {/* Interactive Data Points */}
        {points.map((pt, i) => (
          <g 
            key={i} 
            onMouseEnter={() => setHoverIndex(i)} 
            onMouseLeave={() => setHoverIndex(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle 
              cx={pt.x} 
              cy={pt.y} 
              r={hoverIndex === i ? 6 : 4} 
              fill="#ffffff" 
              stroke="#1868f7" 
              strokeWidth="2.5" 
            />
            {/* Transparent larger hit area */}
            <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

            {/* X-axis date labels */}
            <text 
              x={pt.x} 
              y={height - paddingY + 18} 
              textAnchor="middle" 
              fill="#64748b" 
              fontSize="12"
              fontWeight="600"
            >
              {pt.date}
            </text>
          </g>
        ))}

        {/* Tooltip on hover */}
        {hoverIndex !== null && (
          <g transform={`translate(${points[hoverIndex].x}, ${points[hoverIndex].y - 38})`}>
            <rect 
              x="-45" 
              y="-12" 
              width="90" 
              height="28" 
              rx="6" 
              fill="#0f172a" 
            />
            <polygon points="0,16 -5,12 5,12" fill="#0f172a" />
            <text 
              x="0" 
              y="6" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="11.5" 
              fontWeight="700"
            >
              {points[hoverIndex].label}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
