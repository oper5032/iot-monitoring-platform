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
} from '@coreui/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom } from '@coreui/icons';

import api from '../../api/axios';

const SkVaporizerDashboard = () => {
  const [skVaporizerData, setSkVaporizerData] = useState([]);
  const [skLoading, setSkLoading] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    skGasCbtList();
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

  const skGasCbtList = async () => {
    try {
      setSkLoading(true);

      const response = await api.post('/api/dashboard/skgasCbtList');

      if (response.data.res_code === 'success') {
        setSkVaporizerData(response.data.res_data || []);
      } else {
        setSkVaporizerData([]);
      }
    } catch (err) {
      console.log(err);
      setSkVaporizerData([]);
    } finally {
      setSkLoading(false);
    }
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

  const filteredSortedSkVaporizerData = useMemo(() => {
    let result = [...skVaporizerData];

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();

      result = result.filter((item) =>
        [
          item.group_comp_nm,
          item.serial_no,
          item.cust_nm,
          item.cust_addr,
          item.latitude,
          item.longitude,
          item.AP_rsrp,
          item.RD_node_no,
          item.RD_tran_dttm,
          item.RD_rssi,
          item.RD_battery_adc,
          item.RS_node_no,
          item.RS_tran_dttm,
          item.RS_rssi,
          item.RS_battery_adc,
          item.RV_node_no,
          item.RV_tran_dttm,
          item.RV_rssi,
          item.RV_battery_adc,
          item.RV_temp_adc,
          item.RV_temp,
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

        if (
          sortKey === 'RD_tran_dttm' ||
          sortKey === 'RS_tran_dttm' ||
          sortKey === 'RV_tran_dttm'
        ) {
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
  }, [skVaporizerData, searchKeyword, sortKey, sortOrder]);

  const exportSkVaporizerExcel = () => {

    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    const dateTimeStr = `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;

    const excelData = filteredSortedSkVaporizerData.map((item) => ({
      업체명: item.group_comp_nm || '',
      일련번호: item.serial_no || '',
      거래처명: item.cust_nm || '',
      주소: item.cust_addr || '',
      위도: item.latitude || '',
      경도: item.longitude || '',
      AP_RSRP: item.AP_rsrp || '',
      RD_노드번호: item.RD_node_no || '',
      RD_수신시간: formatDateTime(item.RD_tran_dttm),
      RD_RSSI: item.RD_rssi || '',
      RD_배터리ADC: item.RD_battery_adc || '',
      RS_노드번호: item.RS_node_no || '',
      RS_수신시간: formatDateTime(item.RS_tran_dttm),
      RS_RSSI: item.RS_rssi || '',
      RS_배터리ADC: item.RS_battery_adc || '',
      RV_노드번호: item.RV_node_no || '',
      RV_수신시간: formatDateTime(item.RV_tran_dttm),
      RV_RSSI: item.RV_rssi || '',
      RV_배터리ADC: item.RV_battery_adc || '',
      RV_온도ADC: item.RV_temp_adc || '',
      RV_온도: item.RV_temp || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'SK가스 기화기');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(fileData, `SK가스_기화기_현황_${dateTimeStr}.xlsx`);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">SK가스 기화기 현황</h5>

        <CButton color="success" onClick={exportSkVaporizerExcel}>
          엑셀 다운로드
        </CButton>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-medium-emphasis">
          총 {filteredSortedSkVaporizerData.length}건
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
                onClick={() => handleSort('cust_addr')}
              >
                주소 {getSortIcon('cust_addr')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('AP_rsrp')}
              >
                AP RSRP {getSortIcon('AP_rsrp')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RD_node_no')}
              >
                RD 노드번호 {getSortIcon('RD_node_no')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RD_tran_dttm')}
              >
                RD 수신시간 {getSortIcon('RD_tran_dttm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RD_rssi')}
              >
                RD RSSI {getSortIcon('RD_rssi')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RD_battery_adc')}
              >
                RD 배터리 {getSortIcon('RD_battery_adc')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RS_node_no')}
              >
                RS 노드번호 {getSortIcon('RS_node_no')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RS_tran_dttm')}
              >
                RS 수신시간 {getSortIcon('RS_tran_dttm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RS_rssi')}
              >
                RS RSSI {getSortIcon('RS_rssi')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RS_battery_adc')}
              >
                RS 배터리 {getSortIcon('RS_battery_adc')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RV_node_no')}
              >
                RV 노드번호 {getSortIcon('RV_node_no')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RV_tran_dttm')}
              >
                RV 수신시간 {getSortIcon('RV_tran_dttm')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RV_rssi')}
              >
                RV RSSI {getSortIcon('RV_rssi')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RV_battery_adc')}
              >
                RV 배터리 {getSortIcon('RV_battery_adc')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RV_temp_adc')}
              >
                RV 온도ADC {getSortIcon('RV_temp_adc')}
              </CTableHeaderCell>

              <CTableHeaderCell
                style={tableHeaderStyle}
                onClick={() => handleSort('RV_temp')}
              >
                RV 온도 {getSortIcon('RV_temp')}
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {skLoading ? (
              <CTableRow>
                <CTableDataCell colSpan="19" className="text-center">
                  불러오는 중...
                </CTableDataCell>
              </CTableRow>
            ) : filteredSortedSkVaporizerData.length > 0 ? (
              filteredSortedSkVaporizerData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.group_comp_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.serial_no || '-'}</CTableDataCell>
                  <CTableDataCell>{item.cust_nm || '-'}</CTableDataCell>
                  <CTableDataCell>{item.cust_addr || '-'}</CTableDataCell>
                  <CTableDataCell>{item.AP_rsrp ?? '-'}</CTableDataCell>

                  <CTableDataCell>{item.RD_node_no || '-'}</CTableDataCell>
                  <CTableDataCell>{formatDateTime(item.RD_tran_dttm)}</CTableDataCell>
                  <CTableDataCell>{item.RD_rssi ?? '-'}</CTableDataCell>
                  <CTableDataCell>{item.RD_battery_adc ?? '-'}</CTableDataCell>

                  <CTableDataCell>{item.RS_node_no || '-'}</CTableDataCell>
                  <CTableDataCell>{formatDateTime(item.RS_tran_dttm)}</CTableDataCell>
                  <CTableDataCell>{item.RS_rssi ?? '-'}</CTableDataCell>
                  <CTableDataCell>{item.RS_battery_adc ?? '-'}</CTableDataCell>

                  <CTableDataCell>{item.RV_node_no || '-'}</CTableDataCell>
                  <CTableDataCell>{formatDateTime(item.RV_tran_dttm)}</CTableDataCell>
                  <CTableDataCell>{item.RV_rssi ?? '-'}</CTableDataCell>
                  <CTableDataCell>{item.RV_battery_adc ?? '-'}</CTableDataCell>
                  <CTableDataCell>{item.RV_temp_adc ?? '-'}</CTableDataCell>
                  <CTableDataCell>{item.RV_temp ?? '-'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="19" className="text-center">
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

export default SkVaporizerDashboard;