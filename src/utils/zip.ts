"use client";
import saveAs from "file-saver";
import JSZip from "jszip";

const exportZip = async (blobs: Blob[]) => {
  const zip = new JSZip();
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const arrayBuffer = await blob.arrayBuffer();
    zip.file(`file-${i}.mp3`, arrayBuffer);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "podcasts.zip");

  // try {
  //   const zipFile = await zip.generateAsync({ type: "blob" });
  //   const currentDate = new Date().getTime();
  //   const fileName = `combined-${currentDate}.zip`;
  //   FileSaver.saveAs(zipFile, fileName);
  // } catch (error) {
  //   console.error("Error generating zip file:", error);
  // }
};

export default exportZip;
