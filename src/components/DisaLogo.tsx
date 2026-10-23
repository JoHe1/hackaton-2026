import logoUrl from '../../referencias/Logotipo_Disa.jpg';

// Official logo file (referencias/Logotipo_Disa.jpg, 1024×490), shown as-is or cropped
// with CSS so the hummingbird or the wordmark can be used on their own.
const SOURCE = { width: 1024, height: 490 };
// Top-left corner of the "D" of the wordmark, which overlaps the bird's bounding box.
const WORDMARK_TOP_LEFT = { x: 284, y: 252 };
const CROPS = {
  full: { x: 0, y: 0, w: 1024, h: 490 },
  bird: { x: 58, y: 58, w: 365, h: 270 },
  wordmark: { x: 300, y: 262, w: 664, h: 166 },
};

interface Props {
  variant?: keyof typeof CROPS;
  width: number;
  className?: string;
}

export function DisaLogo({ variant = 'full', width, className = '' }: Props) {
  const crop = CROPS[variant];
  const scale = width / crop.w;
  return (
    <span
      role="img"
      aria-label="DISA"
      className={`relative inline-block shrink-0 bg-no-repeat ${className}`}
      style={{
        width,
        height: Math.round(crop.h * scale),
        backgroundImage: `url(${logoUrl})`,
        backgroundSize: `${SOURCE.width * scale}px ${SOURCE.height * scale}px`,
        backgroundPosition: `${-crop.x * scale}px ${-crop.y * scale}px`,
        mixBlendMode: 'multiply',
      }}
    >
      {variant === 'bird' && (
        <span
          className="absolute bottom-0 right-0 bg-white"
          style={{ left: (WORDMARK_TOP_LEFT.x - crop.x) * scale, top: (WORDMARK_TOP_LEFT.y - crop.y) * scale }}
        />
      )}
    </span>
  );
}
