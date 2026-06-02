import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CCard, CCardBody, CFormInput } from '@coreui/react';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: '',
    userPw: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/auth/login', form);

      if (response.data.res_code === 'success') {
        navigate('/dashboard');
      } else {
        alert(response.data.res_msg || '로그인 실패');
      }
    } catch (err) {
      console.log(err);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <CCard
        className="bg-dark text-white border-secondary shadow"
        style={{ width: '400px' }}
      >
        <CCardBody className="p-4">

          {/* 로고 */}
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: '120px',
                objectFit: 'contain',
                opacity: 0.95,
              }}
            />
          </div>

          {/* 타이틀 */}
          <h3 className="text-center mb-4 fw-bold">
            FDS Monitoring
          </h3>

          <CFormInput
            name="userId"
            placeholder="아이디"
            className="mb-3"
            value={form.userId}
            onChange={handleChange}
          />

          <CFormInput
            name="userPw"
            type="password"
            placeholder="비밀번호"
            className="mb-4"
            value={form.userPw}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />

          <CButton
            color="primary"
            className="w-100"
            onClick={handleLogin}
          >
            로그인
          </CButton>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default LoginPage;