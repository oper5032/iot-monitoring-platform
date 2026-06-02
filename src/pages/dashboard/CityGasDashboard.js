import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import {
  CButton,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CBadge,
  CFormInput,
} from '@coreui/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';

const CityGasDashboard = () => {
  const [cityGasData, setCityGasData] = useState([]);
  const [cityGasLoading, setCityGasLoading] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    cityGasCompanyStatusList();
  }, []);

  const tableHeaderStyle = {
    cursor: 'pointer',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    fontSize: '11px',
    whiteSpace: 'nowrap',
    padding: '8px 10px',
  };

  const tableWrapStyle = {
    maxHeight: '475px',
    overflowY: 'auto',
    overflowX: 'auto',
    border: '1px solid #dee2e6',
  };

  const cityGasCompanyStatusList = async () => {
    try {
      setCityGasLoading(true);

      const response = await api.post(
        '/api/dashboard/cityGasCompanyStatusList'
      );

      if (response.data.res_code === 'success') {
        setCityGasData(response.data.res_data || []);
      } else {
        setCityGasData([]);
      }
    } catch (err) {
      console.log(err);
      setCityGasData([]);
    } finally {
      setCityGasLoading(false);
    }
  };

  const renderStatusBadge = (value) => {
    if (value === '정상' || value === '점검완료' || value === '상시전원') {
      return <CBadge color="success">{value}</CBadge>;
    }

    if (
      value === '라인에러' ||
      value === '점검필요' ||
      value === '이상' ||
      value === '게이지점검' ||
      value === '통신점검'
    ) {
      return <CBadge color="danger">{value}</CBadge>;
    }

    if (value === '미점검') {
      return <CBadge color="warning">{value}</CBadge>;
    }

    return <CBadge color="secondary">{value || '-'}</CBadge>;
  };

  const formatDateTime = (value) => {
    if (!value) return '-';

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) return null;

    return sortOrder === 'asc' ? (
      <CIcon icon={cilArrowTop} className="ms-1" size="sm" />
    ) : (
      <CIcon icon={cilArrowBottom} className="ms-1" size="sm" />
    );
  };

  const filteredSortedCityGasData = useMemo(() => {
    let result = [...cityGasData];

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();

      result = result.filter((item) =>
        [
          item.group_comp_nm,
          item.serial_no,
          item.cust_nm,
          item.code_nm,
          item.meter_manufacturer,
          item.cust_addr,
          item.comm_stts,
          item.install_stts,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        let aValue = a[sortKey];
        let bValue = b[sortKey];

        if (sortKey === 'tran_dttm') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        const aNum = Number(aValue);
        const bNum = Number(bValue);

        if (!isNaN(aNum) && !isNaN(bNum) && aValue !== '' && bValue !== '') {
          return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
        }

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;

        return 0;
      });
    }

    return result;
  }, [cityGasData, searchKeyword, sortKey, sortOrder]);

  const exportCityGasExcel = () => {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const dateTimeStr = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;

    const excelData = filteredSortedCityGasData.map((item) => ({
      업체명: item.group_comp_nm || '',
      일련번호: item.serial_no || '',
      거래처명: item.cust_nm || '',
      계량기종류: item.code_nm || '',
      제조사: item.meter_manufacturer || '',
      CH1: item.CH1 || '',
      CH2: item.CH2 || '',
      설치상태: item.install_stts || '',
      통신상태: item.comm_stts || '',
      주소: item.cust_addr || '',
      마지막전송시간: formatDateTime(item.tran_dttm),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: [
        '업체명',
        '일련번호',
        '거래처명',
        '계량기종류',
        '제조사',
        'CH1',
        'CH2',
        '설치상태',
        '통신상태',
        '주소',
        '마지막전송시간',
      ],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '도시가스 회사');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(fileData, `도시가스_회사_현황_${dateTimeStr}.xlsx`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">도시가스 회사 현황</h5>

        <CButton color="success" onClick={exportCityGasExcel}>
          엑셀 다운로드
        </CButton>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-medium-emphasis">
          총 {filteredSortedCityGasData.length}건
        </div>

        <div style={{ width: '300px' }}>
          <CFormInput
            placeholder="업체명, 거래처명, 일련번호, 주소 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      <div style={tableWrapStyle}>
        <CTable
          hover
          responsive
          bordered
          align="middle"
          className="mb-0"
          style={{ fontSize: '12px' }}
        >
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('group_comp_nm')}
              >
                업체명 {getSortIcon('group_comp_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('serial_no')}
              >
                일련번호 {getSortIcon('serial_no')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('cust_nm')}
              >
                거래처명 {getSortIcon('cust_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('code_nm')}
              >
                계량기 종류 {getSortIcon('code_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('meter_manufacturer')}
              >
                제조사 {getSortIcon('meter_manufacturer')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('CH1')}
              >
                CH1 {getSortIcon('CH1')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('CH2')}
              >
                CH2 {getSortIcon('CH2')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('install_stts')}
              >
                설치 {getSortIcon('install_stts')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('comm_stts')}
              >
                통신 {getSortIcon('comm_stts')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('cust_addr')}
              >
                주소 {getSortIcon('cust_addr')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('tran_dttm')}
              >
                마지막 전송시간 {getSortIcon('tran_dttm')}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {cityGasLoading ? (
              <CTableRow>
                <CTableDataCell colSpan="11" className="text-center">
                  불러오는 중...
                </CTableDataCell>
              </CTableRow>
            ) : filteredSortedCityGasData.length > 0 ? (
              filteredSortedCityGasData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.group_comp_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.serial_no || '-'}</CTableDataCell>
                  <CTableDataCell>{item.cust_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.code_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.meter_manufacturer || '-'}</CTableDataCell>
                  <CTableDataCell>{item.CH1 || '-'}</CTableDataCell>
                  <CTableDataCell>{item.CH2 || '-'}</CTableDataCell>
                  <CTableDataCell>{renderStatusBadge(item.install_stts)}</CTableDataCell>
                  <CTableDataCell>{renderStatusBadge(item.comm_stts)}</CTableDataCell>
                  <CTableDataCell>{item.cust_addr || '-'}</CTableDataCell>
                  <CTableDataCell>{formatDateTime(item.tran_dttm)}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="11" className="text-center">
                  데이터가 없습니다.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </>
  );
};

export default CityGasDashboard;