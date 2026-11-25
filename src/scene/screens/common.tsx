/**
 * States every screen shares, drawn in the screen's local coordinates
 * (0..w, 0..h). `id` prefixes data-el hooks (e.g. "main-deploy-bar").
 */

const mono = { fontFamily: "var(--font-jetbrains), monospace" };
type Size = { w: number; h: number; id: string };

export function OffState({ w, h }: Size) {
  return (
    <g>
      <rect width={w} height={h} fill="var(--screen)" />
      <path d={`M${w * 0.62} 0h${w * 0.16}l${-w * 0.36} ${h}h${-w * 0.16}z`} fill="var(--paper)" opacity="0.05" />
    </g>
  );
}

export function BootState({ w, h, id }: Size) {
  const r = Math.min(w, h) * 0.14;
  return (
    <g>
      <rect width={w} height={h} fill="var(--ink)" />
      <g transform={`translate(${w / 2} ${h * 0.42})`}>
        <circle r={r * 1.6} fill="var(--window-cool)" opacity="0.15" />
        <circle r={r} fill="var(--accent)" />
        <circle r={r * 0.62} fill="var(--paper)" />
        <path d={`M0 0V${-r * 0.45}M0 0L${r * 0.32} ${r * 0.16}`} stroke="var(--ink)" strokeWidth={r * 0.12} strokeLinecap="round" />
      </g>
      <rect x={w * 0.25} y={h * 0.72} width={w * 0.5} height={Math.max(2, h * 0.04)} rx="1" fill="var(--paper)" opacity="0.2" />
      <g transform={`translate(${w * 0.25} ${h * 0.72})`}>
        <rect data-el={`${id}-boot-bar`} width={w * 0.5} height={Math.max(2, h * 0.04)} rx="1" fill="var(--window-cool)" transform="scale(0.05 1)" />
      </g>
    </g>
  );
}

export function ErrorState({ w, h, big = false }: Size & { big?: boolean }) {
  const r = Math.min(w, h) * (big ? 0.12 : 0.18);
  return (
    <g>
      <rect width={w} height={h} fill="var(--error)" />
      <g transform={`translate(${big ? r + w * 0.08 : w / 2} ${big ? h * 0.34 : h * 0.4})`}>
        <circle r={r} fill="var(--paper)" />
        <path d={`M${-r * 0.4} ${-r * 0.4}L${r * 0.4} ${r * 0.4}M${r * 0.4} ${-r * 0.4}L${-r * 0.4} ${r * 0.4}`} stroke="var(--error)" strokeWidth={r * 0.28} strokeLinecap="round" />
      </g>
      {big ? (
        <g fill="var(--paper)" style={mono}>
          <text x={w * 0.28} y={h * 0.32} fontSize="15" fontWeight="800">
            Build failed
          </text>
          <text x={w * 0.28} y={h * 0.43} fontSize="8">
            exit code 1
          </text>
          <text x={w * 0.07} y={h * 0.67} fontSize="8.5">
            TypeError: cannot read
          </text>
          <text x={w * 0.07} y={h * 0.76} fontSize="8.5">
            {`properties of undefined ('prod')`}
          </text>
          <text x={w * 0.07} y={h * 0.9} fontSize="8" opacity="0.7">
            at deploy (day.ts:42:7)
          </text>
        </g>
      ) : (
        <g fill="var(--paper)" opacity="0.85">
          <rect x={w * 0.15} y={h * 0.68} width={w * 0.7} height={h * 0.06} rx="1" />
          <rect x={w * 0.15} y={h * 0.8} width={w * 0.5} height={h * 0.06} rx="1" />
        </g>
      )}
    </g>
  );
}

export function DeployState({ w, h, id, big = false }: Size & { big?: boolean }) {
  const barH = big ? 12 : Math.max(3, h * 0.09);
  return (
    <g>
      <rect width={w} height={h} fill="var(--screen)" />
      {big ? (
        <g style={mono}>
          <text x="16" y="34" fontSize="10" fill="var(--can)">
            $ ship --prod
          </text>
          <text x="16" y="58" fontSize="9" fill="var(--paper)">
            Building... Uploading...
          </text>
          <text x="16" y="110" fontSize="8" fill="var(--wall-shade)">
            3 regions, 0 errors
          </text>
        </g>
      ) : (
        <g fill="var(--paper)" opacity="0.6">
          <rect x={w * 0.1} y={h * 0.2} width={w * 0.5} height={h * 0.06} rx="1" />
          <rect x={w * 0.1} y={h * 0.32} width={w * 0.7} height={h * 0.06} rx="1" />
        </g>
      )}
      <rect x={w * 0.08} y={h * 0.58} width={w * 0.84} height={barH} rx={barH / 2} fill="var(--ink)" />
      <g transform={`translate(${w * 0.08} ${h * 0.58})`}>
        <rect data-el={`${id}-deploy-bar`} width={w * 0.84} height={barH} rx={barH / 2} fill="var(--can)" transform="scale(0.02 1)" />
      </g>
    </g>
  );
}

export function SuccessState({ w, h, big = false }: Size & { big?: boolean }) {
  const r = Math.min(w, h) * (big ? 0.18 : 0.24);
  return (
    <g>
      <rect width={w} height={h} fill="var(--can)" />
      <g transform={`translate(${w / 2} ${big ? h * 0.39 : h * 0.45})`}>
        <circle r={r} fill="var(--paper)" />
        <path
          d={`M${-r * 0.45} 0l${r * 0.33} ${r * 0.33}l${r * 0.62} ${-r * 0.66}`}
          stroke="var(--can-dark)"
          strokeWidth={r * 0.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      {big && (
        <g textAnchor="middle" fill="var(--ink)" style={mono}>
          <text x={w / 2} y={h * 0.75} fontSize="16" fontWeight="800">
            Deployed
          </text>
          <text x={w / 2} y={h * 0.87} fontSize="8.5">
            live in production
          </text>
        </g>
      )}
    </g>
  );
}
