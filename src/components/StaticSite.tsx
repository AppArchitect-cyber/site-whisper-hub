import React from 'react';

interface StaticSiteProps {
  siteName: string;
  whatsappNumber: string;
  logoUrl?: string;
  description?: string;
}

const StaticSite: React.FC<StaticSiteProps> = ({ 
  siteName, 
  whatsappNumber, 
  logoUrl = "/placeholder.svg",
  description = "Get your ID instantly — claim an extra welcome bonus"
}) => {
  const formatWhatsAppLink = (number: string) => {
    // Remove any non-digit characters and ensure it starts with country code
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{siteName}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={description} />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root{
              --accent:#25D366; --accent2:#1ebe5b;
              --card-w:560px; --radius:18px;
            }
            *{box-sizing:border-box}
            html,body{height:100%}
            body{
              margin:0;font-family:Inter,system-ui,Arial;
              background:#fff;
              display:flex; align-items:center; justify-content:center; padding:28px; color:#fff;
            }

            .card{
              width:100%; max-width:var(--card-w);
              background:#000;
              border-radius:var(--radius); padding:36px; text-align:center;
              box-shadow:0 28px 80px rgba(2,6,23,0.6); position:relative; overflow:hidden;
              animation:cardIn .7s cubic-bezier(.2,.9,.2,1);
            }
            @keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(.996)}to{opacity:1;transform:none}}

            .logo-wrap{display:flex; align-items:center; justify-content:center; height:150px; margin-bottom:14px;}
            .logo{width:220px; max-width:86%;}
            .logo img{display:block;width:100%;height:auto;object-fit:contain;}

            h1{margin:6px 0 0;font-size:22px;font-weight:800;color:#fff;letter-spacing:0.4px}
            p.lead{margin:8px 0 18px;color:#ccc;font-size:15px}
            .small-note{color:#aaa;margin-top:10px;font-size:13px}

            .wa-btn {
              position:relative;
              display:inline-flex;
              align-items:center;
              justify-content:center;
              gap:10px;
              padding:14px 26px;
              border-radius:999px;
              font-weight:800;
              font-size:16px;
              color:#fff;
              text-decoration:none;
              background:linear-gradient(135deg, #25D366 0%, #1ebe5b 100%);
              box-shadow:0 10px 30px rgba(37,211,102,0.4);
              transition:all 0.3s ease;
              animation:btnFloat 3s ease-in-out infinite;
            }
            @keyframes btnFloat {
              0%   { transform:translateY(0); box-shadow:0 10px 30px rgba(37,211,102,0.4);}
              50%  { transform:translateY(-6px); box-shadow:0 20px 50px rgba(37,211,102,0.6);}
              100% { transform:translateY(0); box-shadow:0 10px 30px rgba(37,211,102,0.4);}
            }
            .wa-btn:hover {
              transform:translateY(-8px) scale(1.05);
              background:linear-gradient(135deg, #1ebe5b 0%, #25D366 100%);
              box-shadow:0 24px 60px rgba(37,211,102,0.7);
            }
            .wa-icon{width:20px;height:20px;display:inline-block;}
          `
        }} />
      </head>
      <body>
        <main className="card">
          <div className="logo-wrap">
            <div className="logo">
              <img src={logoUrl} alt={`${siteName} logo`} />
            </div>
          </div>

          <h1>{siteName}</h1>
          <p className="lead">{description}</p>

          <div className="cta">
            <a 
              className="wa-btn" 
              href={formatWhatsAppLink(whatsappNumber)} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span className="wa-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.52 3.48A11.94 11.94 0 0012 .5C6.21.5 1.5 5.2 1.5 11c0 1.95.51 3.86 1.48 5.55L.5 23.5l6.98-1.83A11.5 11.5 0 0012 22.5c5.79 0 10.5-4.7 10.5-10.5 0-3.02-1.17-5.86-3.98-7.52z" fill="#fff"></path>
                  <path d="M17.4 14.18c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.67.15-.2.3-.78.96-.96 1.16-.18.2-.36.22-.66.07-.3-.15-1.28-.47-2.44-1.51-.9-.8-1.51-1.79-1.69-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.37-.05-.52-.05-.15-.67-1.6-.92-2.2-.24-.57-.5-.48-.67-.49-.17-.01-.37-.01-.56-.01-.18 0-.52.07-.79.36-.27.29-1.03 1.01-1.03 2.48 0 1.47 1.06 2.9 1.21 3.1.15.2 2.09 3.18 5.07 4.32 2.98 1.15 2.98.76 3.52.72.54-.04 1.74-.7 1.99-1.38.25-.68.25-1.26.18-1.38-.07-.12-.27-.2-.57-.35z" fill="#25D366"></path>
                </svg>
              </span>
              <span>Get ID & Extra Bonus</span>
            </a>
            <div className="small-note">You'll be redirected to WhatsApp.</div>
          </div>
        </main>
      </body>
    </html>
  );
};

export default StaticSite;