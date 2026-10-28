import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '48px', color: '#c49f60' }}>404</h1>
      <h2>Ой! Сторінку не знайдено</h2>
      <p style={{ margin: '20px 0' }}>Ви перейшли за неправильним посиланням.</p>
      <Link to="/" style={{ color: '#222c38', textDecoration: 'underline' }}>
        Повернутися на головну
      </Link>
    </div>
  );
}