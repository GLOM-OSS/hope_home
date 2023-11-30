import Image from 'next/image';

export function MediaGrid({
  src: image,
  height = 400,
  objectFit = 'cover',
  width = '100%',
}: {
  src: string;
  objectFit?: 'contain' | 'cover';
  height?: string | number;
  width?: string | number;
}) {
  const isVideo = image.endsWith('.mp4') || image.endsWith('.webm');
  return isVideo ? (
    <video
      playsInline
      autoPlay
      muted
      // loop
      controls
      src={image}
      width={100}
      height={400} 
      style={{
        width,
        height,
        objectFit: 'contain',
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
      }}
    />
  ) : (
    <Image
      src={image}
      alt={`property-${image}`}
      width={100}
      height={400}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = '/logo_green.png';
      }}
      style={{
        width,
        height,
        objectFit,
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
      }}
    />
  );
}
