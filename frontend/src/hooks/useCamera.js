import { useState, useCallback } from 'react';

export const useCamera = (videoRef, canvasRef) => {
  const [stream, setStream] = useState(null);

  const startCamera = useCallback(async () => {
    if (stream) return; // Avoid starting if already running
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Could not access the camera. Please check permissions and try again.");
    }
  }, [videoRef, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, videoRef]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  }, [videoRef, canvasRef]);

  return { stream, startCamera, stopCamera, takePhoto };
};
