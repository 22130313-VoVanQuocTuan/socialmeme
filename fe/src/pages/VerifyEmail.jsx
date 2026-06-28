import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { verifyEmail } from '../service/authApi';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Dang xac thuc email cua ban...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Lien ket xac thuc khong hop le.');
      return;
    }

    const runVerification = async () => {
      try {
        const data = await verifyEmail(token);
        setStatus('success');
        setMessage(data.message || 'Xac thuc email thanh cong. Vui long quay lai trang dang nhap.');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.detail ||
            'Khong the xac thuc email. Lien ket co the da het han hoac khong hop le.'
        );
      }
    };

    runVerification();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600">SocialMeme</h1>
        <div
          className={`mt-6 rounded-xl p-4 text-sm ${
            status === 'success'
              ? 'bg-green-50 text-green-700'
              : status === 'error'
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-50 text-gray-600'
          }`}
        >
          {message}
        </div>

        <Link
          to="/login"
          className="inline-flex items-center justify-center mt-6 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Quay lai dang nhap
        </Link>
      </div>
    </div>
  );
}
