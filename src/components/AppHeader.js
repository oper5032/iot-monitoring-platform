import { CHeader, CContainer, CHeaderBrand, CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      navigate('/login', {replace: true});    
    } catch(err) {
      console.log(err);
      alert("로그아웃 처리 중 오류가 발생하였습니다.");
    }
  };

  return (
    <CHeader className="border-bottom bg-dark text-white">
      <CContainer fluid className="px-4">
        <CHeaderBrand className="mb-0 h5 text-white">
          FDS Monitoring
        </CHeaderBrand>

        <CButton color="outline-light" size="sm" onClick={handleLogout}>
          로그아웃
        </CButton>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;