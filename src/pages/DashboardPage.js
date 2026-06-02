import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';


import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilList } from '@coreui/icons';

import api from '../api/axios';

import CityGasDashboard from './dashboard/CityGasDashboard';
import HighTankDashboard from './dashboard/HighTankDashboard';
import SkVaporizerDashboard from './dashboard/SkVaporizerDashboard';
import SmartMeteringDashboard from './dashboard/SmartMeteringDashboard';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('citygas');

  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompanyCard, setSelectedCompanyCard] = useState(null);

  const [companyListLoading, setCompanyListLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [companySearchKeyword, setCompanySearchKeyword] = useState('');

  const [cityCount, setCityCount] = useState(0);
  const [cityGasData, setCityGasData] = useState([]);

  const [highTankCount, setHighTankCount] = useState(0);
  const [highPressureTankData, setHighPressureTankData] = useState([]);
  
  const [skGasVaporCount, setSkGasVaporCount] = useState(0);
  const [skVaporizerData, setSkVaporizerData] = useState([]);

  const [smartMeteringCount, setSmartMeteringCount] = useState(0);
  const [smartMeteringData, setSmartMeteringData] = useState([]);

  useEffect(() => {
    const loadSummaryData = async () => {
      cityGasDvcCnt();
      cityGasCompanyStatusList();

      highTankDvcCnt();
      highTankStatusList();

      skGasCbtCnt();
      skGasCbtList();

      smartMeteringCnt();
      smartMeteringList();
    };

    loadSummaryData();
  }, []);

  const cityGasDvcCnt = async () => {
    try {
      const response = await api.post('/api/dashboard/cityGasDeviceCnt');

      if (response.data.res_code === 'success') {
        setCityCount(response.data.res_data.city_cnt || 0);
      } else {
        setCityCount(0);
      }
    } catch (err) {
      console.log(err);
      setCityCount(0);
    }
  };

  const cityGasCompanyStatusList = async () => {
    try {
      const response = await api.post('/api/dashboard/cityGasCompanyStatusList');

      if (response.data.res_code === 'success') {
        setCityGasData(response.data.res_data || []);
      } else {
        setCityGasData([]);
      }
    } catch (err) {
      console.log(err);
      setCityGasData([]);
    }
  };

  const highTankDvcCnt = async () => {
    try {
      const response = await api.post('/api/dashboard/highTankDeviceCnt');

      if (response.data.res_code === 'success') {
        setHighTankCount(response.data.res_data.tank_cnt || 0);
      } else {
        setHighTankCount(0);
      }
    } catch (err) {
      console.log(err);
      setHighTankCount(0);
    }
  };

  const highTankStatusList = async () => {
    try {
      const response = await api.post('/api/dashboard/highTankStatusList');

      if (response.data.res_code === 'success') {
        setHighPressureTankData(response.data.res_data || []);
      } else {
        setHighPressureTankData([]);
      }
    } catch (err) {
      console.log(err);
      setHighPressureTankData([]);
    }
  };

  const skGasCbtCnt = async () => {
    try {
      const response = await api.post('/api/dashboard/skgasCbtDeviceCnt');

      if (response.data.res_code === 'success') {
        setSkGasVaporCount(response.data.res_data.cbt_cnt || 0);
      } else {
        setSkGasVaporCount(0);
      }
    } catch (err) {
      console.log(err);
      setSkGasVaporCount(0);
    }
  };

  const skGasCbtList = async () => {
    try {
      const response = await api.post('/api/dashboard/skgasCbtList');

      if (response.data.res_code === 'success') {
        setSkVaporizerData(response.data.res_data || []);
      } else {
        setSkVaporizerData([]);
      }
    } catch (err) {
      console.log(err);
      setSkVaporizerData([]);
    }
  };

  const smartMeteringCnt = async () => {
    try {
      const response = await api.post('/api/dashboard/smartMeteringCnt');

      if (response.data.res_code === 'success') {
        setSmartMeteringCount(response.data.res_data.sm_cnt || 0);
      } else {
        setSmartMeteringCount(0);
      }
    } catch (err) {
      console.log(err);
      setSmartMeteringCount(0);
    }
  };

  const smartMeteringList = async () => {
    try {
      const response = await api.post('/api/dashboard/smartMeteringList');

      if (response.data.res_data) {
        setSmartMeteringData(response.data.res_data || []);
      } else {
        setSmartMeteringData([]);
      }
    } catch (err) {
      console.log(err);
      setSmartMeteringData([]);
    }
  };

  const summaryCards = [
    {
      key: 'citygas',
      title: '도시가스 회사',
      total: cityCount,
      error: cityGasData.length,
      manager: '추창훈 차장',
    },
    {
      key: 'tank',
      title: '고압 탱크',
      total: highTankCount,
      error: highPressureTankData.length,
      manager: '박홍범 이사',
    },
    {
      key: 'sk',
      title: 'SK가스 기화기',
      total: skGasVaporCount,
      error: skVaporizerData.length,
      manager: '박홍범 이사',
    },
    {
      key: 'sm',
      title: '스마트 미터링',
      total: smartMeteringCount,
      error: smartMeteringData.length,
      manager: '이재화 과장',
    },
  ];

  const openCompanyModal = async (e, item) => {
    e.stopPropagation();

    setSelectedCompanyCard(item);
    setCompanyModalVisible(true);
    setCompanyList([]);
    setCompanySearchKeyword('');

    await loadCompanyList(item.key);
  };

  const loadCompanyList = async (key) => {
    try {
      setCompanyListLoading(true);

      let url = '';

      if (key === 'citygas') {
        url = '/api/dashboard/cityGasCompanyList';
      } else if (key === 'tank') {
        url = '/api/dashboard/highTankCompanyList';
      } else if (key === 'sk') {
        url = '/api/dashboard/skgasCbtCompanyList';
      } else if (key === 'sm') {
        url = '/api/dashboard/smartMeteringCompanyList';
      }

      if (!url) return;

      const response = await api.post(url);

      if (response.data.res_code === 'success') {
        setCompanyList(response.data.res_data || []);
      } else {
        setCompanyList([]);
      }
    } catch (err) {
      console.log(err);
      setCompanyList([]);
    } finally {
      setCompanyListLoading(false);
    }
  };

  const renderActiveDashboard = () => {
    if (activeTab === 'citygas') {
      return <CityGasDashboard />;
    }

    if (activeTab === 'tank') {
      return <HighTankDashboard />;
    }

    if (activeTab === 'sk') {
      return <SkVaporizerDashboard />;
    }

    if (activeTab === 'sm') {
      return <SmartMeteringDashboard />;
    }

    return null;
  };

  const filteredCompanyList = companyList.filter((item) => {
  const keyword = companySearchKeyword.toLowerCase();

  return [
    item.group_comp_nm,
    item.comp_nm,
    item.cust_nm,
    item.apt_nm,
    item.addr,
    item.cust_addr,
    item.comp_addr,
    item.address,
    item.emp_nm,
    item.emp_phone,
    item.cnt,
  ]
    .join(' ')
    .toLowerCase()
    .includes(keyword);
});

  return (
    <>
      <h4 className="mb-4 d-flex align-items-center">
        <CIcon icon={cilSpeedometer} className="me-2" />
        대시보드
      </h4>

      <CRow className="mb-4">
        {summaryCards.map((item) => (
          <CCol md={3} key={item.key}>
            <CCard
              className={`shadow-sm dashboard-summary-card ${
                activeTab === item.key ? 'border-primary' : ''
              }`}
              style={{
                cursor: 'pointer',
                borderWidth: activeTab === item.key ? '2px' : '1px',
              }}
              onClick={() => setActiveTab(item.key)}
            >
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-medium-emphasis mb-0">
                    {item.title}
                  </h6>

                  <CButton
                    color="light"
                    variant="outline"
                    size="sm"
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '32px',
                      height: '32px',
                      padding: 0,
                    }}
                    onClick={(e) => openCompanyModal(e, item)}
                  >
                    <CIcon icon={cilList} size="sm" />
                  </CButton>
                </div>

                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <div className="text-medium-emphasis small">전체</div>
                    <h3 className="fw-bold mb-0">{item.total.toLocaleString()}</h3>
                  </div>

                  <div className="text-end">
                    <div className="text-danger small">장애</div>
                    <h4 className="fw-bold text-danger mb-0">
                      {item.error.toLocaleString()}
                    </h4>
                  </div>
                  <div className="text-end">
                    <div className="text-danger small">장애율</div>
                    <h4 className="fw-bold text-danger mb-0">
                      {item.total > 0
                          ? ((item.error / item.total) * 100).toFixed(2)
                          : '0.00'}
                        %
                    </h4>
                  </div>
                </div>

                <h6 className="text-medium-emphasis mt-3 mb-0">
                  당사 담당자 : {item.manager}
                </h6>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CCard className="shadow-sm">
        <CCardBody>
          {renderActiveDashboard()}
        </CCardBody>
      </CCard>
      <CModal
        visible={companyModalVisible}
        onClose={() => setCompanyModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {selectedCompanyCard?.title} 업체 리스트
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-medium-emphasis">
              총 {filteredCompanyList.length.toLocaleString()}건
            </div>

            <div style={{ width: '280px' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="업체명, 주소, 담당자, 연락처 검색"
                value={companySearchKeyword}
                onChange={(e) => setCompanySearchKeyword(e.target.value)}
              />
            </div>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <CListGroup>
              {companyListLoading ? (
                <CListGroupItem className="text-center">
                  불러오는 중...
                </CListGroupItem>
              ) : filteredCompanyList.length > 0 ? (
                filteredCompanyList.map((item, index) => (
                  <CListGroupItem key={index}>
                    <div className="fw-bold">
                      {item.comp_nm || item.apt_nm || '-'}
                    </div>
                    <div className="small text-medium-emphasis">
                      주소 : {item.addr || item.cust_addr || item.comp_addr || item.address || '-'}
                    </div>
                    <div className="small text-medium-emphasis">
                      담당자 : {item.emp_nm || item.user_nm || '-'}
                    </div>
                    <div className="small text-medium-emphasis">
                      연락처 : {item.emp_phone || item.apt_tel || '-'}
                    </div>
                    <div className="small fw-bold">
                      배정 단말 수 : {(item.cnt || 0).toLocaleString()}EA
                    </div>
                  </CListGroupItem>
                ))
              ) : (
                <CListGroupItem className="text-center">
                  데이터가 없습니다.
                </CListGroupItem>
              )}
            </CListGroup>
          </div>
        </CModalBody>
      </CModal>
    </>
    
  );
};

export default DashboardPage;