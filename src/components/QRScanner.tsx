'use client'

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function QRScanner({ onScan }: { onScan: (code: string) => void }) {
  useEffect(() => {
    const targetId = 'html5qr-reader'
    const config = { fps: 10, qrbox: 250 };

    const scanner = new Html5QrcodeScanner(targetId, config, false);
    scanner.render((decodedText: string) => {
      onScan(decodedText);
      scanner.clear().catch(() => { });
    }, (err) => {
      console.debug('scan error', err);
    });

    return () => {
      scanner.clear().catch(() => { });
    }
  }, [onScan]);

  return <div id="html5qr-reader" />
}
