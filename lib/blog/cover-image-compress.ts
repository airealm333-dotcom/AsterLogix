/**
 * Downscale + JPEG-encode cover images in the browser so uploads are much smaller
 * and faster (original phone photos are often 3–12 MB).
 */
export async function prepareBlogCoverForUpload(
  file: File,
  options?: { maxLongEdge?: number; jpegQuality?: number }
): Promise<{ blob: Blob; contentType: string; filenameSuffix: string }> {
  const maxLongEdge = options?.maxLongEdge ?? 1920;
  const jpegQuality = options?.jpegQuality ?? 0.82;

  if (file.type === "image/gif") {
    return {
      blob: file,
      contentType: file.type || "image/gif",
      filenameSuffix: ".gif",
    };
  }

  const bmp = await createImageBitmap(file);
  try {
    const { width: w, height: h } = bmp;
    const longEdge = Math.max(w, h);
    const scale = longEdge > maxLongEdge ? maxLongEdge / longEdge : 1;
    const tw = Math.max(1, Math.round(w * scale));
    const th = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        blob: file,
        contentType: file.type || "image/jpeg",
        filenameSuffix: file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "",
      };
    }
    ctx.drawImage(bmp, 0, 0, tw, th);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", jpegQuality)
    );
    if (!blob || blob.size === 0) {
      return {
        blob: file,
        contentType: file.type || "image/jpeg",
        filenameSuffix: file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "",
      };
    }
    return { blob, contentType: "image/jpeg", filenameSuffix: ".jpg" };
  } finally {
    bmp.close();
  }
}
