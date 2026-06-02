package com.fds.dashboard.repository.main;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashboardRepository {
	HashMap<String, Object> selectCityGasDeviceCnt();
	List<HashMap<String, Object>> selectCityGasCompanyList();
	List<HashMap<String, Object>> selectCityGasCompanyStatusList();
	
	HashMap<String, Object> selectHighTankDeviceCnt();
	List<HashMap<String, Object>> selectHighTankCompanyList();
	List<HashMap<String, Object>> selectHighTankStatusList();
	
	HashMap<String, Object> selectSkgasCbtDeviceCnt();
	List<HashMap<String, Object>> selectSkgasCbtCompanyList();
	List<HashMap<String, Object>> selectSkgasCbtList();
}
