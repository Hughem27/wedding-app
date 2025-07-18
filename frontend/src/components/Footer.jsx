import { QRCodeCanvas } from 'qrcode.react';

function FooterQR() {
  const siteUrl = "https://www.hannahandhugh.site";

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">Scan to open the site</p>
        <QRCodeCanvas value={siteUrl} size={256} className="footer-qr" />
      </div>
    </footer>
  );
}

export default FooterQR;
