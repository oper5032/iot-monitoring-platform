import React, { useEffect, useMemo, useState } from 'react';
import {
  CButton,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CFormInput,
  CBadge,
} from '@coreui/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';

import api from '../../api/axios';

const HighTankDashboard = () => {
  const [highPressureTankData, setHighPressureTankData] = useState([]);
  const [highTankLoading, setHighTankLoading] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    highTankStatusList();
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

  const highTankStatusList = async () => {
    try {
      setHighTankLoading(true);

      const response = await api.post('/api/dashboard/highTankStatusList');

      if (response.data.res_code === 'success') {
        setHighPressureTankData(response.data.res_data || []);
      } else {
        setHighPressureTankData([]);
      }
    } catch (err) {
      console.log(err);
      setHighPressureTankData([]);
    } finally {
      setHighTankLoading(false);
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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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

  const filteredSortedHighTankData = useMemo(() => {
    let result = [...highPressureTankData];

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();

      result = result.filter((item) =>
        [
          item.group_comp_nm,
          item.serial_no,
          item.cust_nm,
          item.cust_addr,
          item.error_stts,
          item.tran_type,
          item.remain1_percent,
          item.remain2_percent,
          item.tran_dttm,
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
  }, [highPressureTankData, searchKeyword, sortKey, sortOrder]);

  const exportHighTankExcel = () => {

    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const dateTimeStr = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;

    const excelData = filteredSortedHighTankData.map((item) => ({
      업체명: item.group_comp_nm || '',
      일련번호: item.serial_no || '',
      거래처명: item.cust_nm || '',
      주소: item.cust_addr || '',
      오류상태: item.error_stts || '',
      전송유형: item.tran_type || '',
      잔량1퍼센트: item.remain1_percent || '',
      잔량2퍼센트: item.remain2_percent || '',
      마지막전송시간: formatDateTime(item.tran_dttm),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: [
        '업체명',
        '일련번호',
        '거래처명',
        '주소',
        '오류상태',
        '전송유형',
        '잔량1퍼센트',
        '잔량2퍼센트',
        '마지막전송시간',
      ],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '고압 탱크');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(fileData, `고압탱크_현황_${dateTimeStr}.xlsx`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">고압 탱크 현황</h5>

        <CButton color="success" onClick={exportHighTankExcel}>
          엑셀 다운로드
        </CButton>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-medium-emphasis">
          총 {filteredSortedHighTankData.length}건
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
        <CTable hover responsive bordered align="middle" className="mb-0" style={{ fontSize: '12px' }}>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('group_comp_nm')}>
                업체명 {getSortIcon('group_comp_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('serial_no')}>
                일련번호 {getSortIcon('serial_no')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('cust_nm')}>
                거래처명 {getSortIcon('cust_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('cust_addr')}>
                주소 {getSortIcon('cust_addr')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('error_stts')}>
                오류상태 {getSortIcon('error_stts')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('tran_type')}>
                전송유형 {getSortIcon('tran_type')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('remain1_percent')}>
                잔량1(%) {getSortIcon('remain1_percent')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('remain2_percent')}>
                잔량2(%) {getSortIcon('remain2_percent')}
              </CTableHeaderCell>

              <CTableHeaderCell style={tableHeaderStyle} onClick={() => handleSort('tran_dttm')}>
                마지막 전송시간 {getSortIcon('tran_dttm')}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {highTankLoading ? (
              <CTableRow>
                <CTableDataCell colSpan="9" className="text-center">
                  불러오는 중...
                </CTableDataCell>
              </CTableRow>
            ) : filteredSortedHighTankData.length > 0 ? (
              filteredSortedHighTankData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.group_comp_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.serial_no || '-'}</CTableDataCell>
                  <CTableDataCell>{item.cust_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.cust_addr || '-'}</CTableDataCell>
                  <CTableDataCell>{renderStatusBadge(item.error_stts)}</CTableDataCell>
                  <CTableDataCell>{item.tran_type || '-'}</CTableDataCell>
                  <CTableDataCell>{item.remain1_percent ?? '-'}</CTableDataCell>
                  <CTableDataCell>{item.remain2_percent ?? '-'}</CTableDataCell>
                  <CTableDataCell>{formatDateTime(item.tran_dttm)}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="9" className="text-center">
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

export default HighTankDashboard;