/**
 * Player chrome for the 160x90 video scenes: a progress bar (the fill is
 * scaled by the timeline) and a play/pause icon, so they read as videos.
 */
export function VideoChrome({ id, playing = true }: { id: string; playing?: boolean }) {
  return (
    <g>
      <rect x="0" y="82" width="160" height="8" fill="#000" opacity="0.55" />
      <g transform="translate(6 86)">
        <g data-prop={`${id}-play`}>
          <g data-state="playing" opacity={playing ? 1 : 0}>
            <rect x="-2.5" y="-2.5" width="1.8" height="5" fill="#fff" />
            <rect x="0.7" y="-2.5" width="1.8" height="5" fill="#fff" />
          </g>
          <g data-state="paused" opacity={playing ? 0 : 1}>
            <path d="M-2.2 -2.8L2.8 0L-2.2 2.8Z" fill="#fff" />
          </g>
        </g>
      </g>
      <rect x="13" y="85" width="140" height="2" rx="1" fill="#fff" opacity="0.35" />
      <g transform="translate(13 85)">
        <rect data-el={`${id}-progress`} width="140" height="2" rx="1" fill="var(--error)" transform="scale(0.08 1)" />
      </g>
    </g>
  );
}
