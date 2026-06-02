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

const SmartMeteringDashboard = () => {
  const [smartMeteringData, setSmartMeteringData] = useState([]);
  const [smLoading, setSmLoading] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    smartMeteringList();
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

  const smartMeteringList = async () => {
    try {
      setSmLoading(true);

      const response = await api.post('/api/dashboard/smartMeteringList');

      if (response.data.res_data) {
        setSmartMeteringData(response.data.res_data || []);
      } else {
        setSmartMeteringData([]);
      }
    } catch (err) {
      console.log(err);
      setSmartMeteringData([]);
    } finally {
      setSmLoading(false);
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

  const filteredSortedSmartMeteringData = useMemo(() => {
    let result = [...smartMeteringData];

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();

      result = result.filter((item) =>
        [
          item.apt_nm,
          item.bldg_id,
          item.cust_nm,
          item.serial_no,
          item.isType,
          item.dvc_status,
          item.tran_dttm,
          item.comm_error,
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
  }, [smartMeteringData, searchKeyword, sortKey, sortOrder]);

  const exportSmartMeteringExcel = () => {

    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const dateTimeStr = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;

    const excelData = filteredSortedSmartMeteringData.map((item) => ({
      아파트명: item.apt_nm || '',
      동: item.bldg_id || '',
      호: item.cust_nm || '',
      일련번호: item.serial_no || '',
      타입: item.isType || '',
      단말상태: item.dvc_status || '',
      전송시간: formatDateTime(item.tran_dttm),
      통신점검: item.comm_error || '',
      
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: [
        '아파트명',
        '동',
        '호',
        '일련번호',
        '타입',
        '단말상태',
        '전송시간',
        '통신점검',
      ],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '스마트미터링');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(fileData, `스마트미터링_현황_${dateTimeStr}.xlsx`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">스마트 미터링 현황</h5>

        <CButton color="success" onClick={exportSmartMeteringExcel}>
          엑셀 다운로드
        </CButton>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-medium-emphasis">
          총 {filteredSortedSmartMeteringData.length}건
        </div>

        <div style={{ width: '300px' }}>
          <CFormInput
            placeholder="거래처명, 동호수, 일련번호, 아파트명 검색"
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
                onClick={() => handleSort('apt_nm')}
              >
                아파트명 {getSortIcon('apt_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('bldg_id')}
              >
                동 {getSortIcon('bldg_id')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('cust_nm')}
              >
                호 {getSortIcon('cust_nm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('serial_no')}
              >
                일련번호 {getSortIcon('serial_no')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('isType')}
              >
                타입 {getSortIcon('isType')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('dvc_status')}
              >
                단말상태 {getSortIcon('dvc_status')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('tran_dttm')}
              >
                전송시간 {getSortIcon('tran_dttm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('comm_error')}
              >
                통신점검 {getSortIcon('comm_error')}
              </CTableHeaderCell>

            </CTableRow>
          </CTableHead>

          <CTableBody>
            {smLoading ? (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  불러오는 중...
                </CTableDataCell>
              </CTableRow>
            ) : filteredSortedSmartMeteringData.length > 0 ? (
              filteredSortedSmartMeteringData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.apt_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.bldg_id || '-'}</CTableDataCell>
                  <CTableDataCell>{item.cust_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.serial_no || '-'}</CTableDataCell>
                  <CTableDataCell>
                    {item.isType}
                  </CTableDataCell>
                  <CTableDataCell>
                    {renderStatusBadge(item.dvc_status)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {formatDateTime(item.tran_dttm)}
                  </CTableDataCell>
                  <CTableDataCell>{renderStatusBadge(item.comm_error || '-')}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
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

export default SmartMeteringDashboard;