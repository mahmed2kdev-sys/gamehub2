import noImage from "../assets/no-image-placeholder.webp";

export default function getCroppedImageUrl(url: string | null | undefined): string {
  if (!url) return noImage;
  const idx = url.indexOf("media/");
  if (idx === -1) return url;
  return url.slice(0, idx) + "media/crop/600/400/" + url.slice(idx + 6);
}
