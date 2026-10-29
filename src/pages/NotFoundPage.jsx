import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'serif' }}>
      <h1 style={{ fontSize: '64px', color: '#c49f60', marginBottom: '10px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Сторінку не знайдено</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Ви перейшли за неіснуючою адресою.</p>
      <Link 
        to="/" 
        style={{ 
          background: '#222c38', 
          color: '#fff', 
          padding: '12px 24px', 
          textDecoration: 'none', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Повернутися на головну
      </Link>
    </div>
  );
}