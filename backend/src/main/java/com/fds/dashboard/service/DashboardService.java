package com.fds.dashboard.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fds.dashboard.repository.main.DashboardRepository;
import com.fds.external.repository.sub.ExternalRepository;

@Service
public class DashboardService {
	
	private final DashboardRepository dashboardRepository;
	private final ExternalRepository externalRepository;

    public DashboardService(DashboardRepository dashboardRepository, ExternalRepository externalRepository) {
        this.dashboardRepository = dashboardRepository;
		this.externalRepository = externalRepository;
    }
    
    
    public HashMap<String, Object> getCityGasDeviceCnt() {
    	return dashboardRepository.selectCityGasDeviceCnt();
    }
    
    public List<HashMap<String, Object>> getCityGasCompanyList() {
        return dashboardRepository.selectCityGasCompanyList();
    }
    
    public List<HashMap<String, Object>> getCityGasCompanyStatusList() {
        return dashboardRepository.selectCityGasCompanyStatusList();
    }
    
    
    
    public HashMap<String, Object> getHighTankDeviceCnt() {
    	return dashboardRepository.selectHighTankDeviceCnt();
    }
    
    public List<HashMap<String, Object>> getHighTankCompanyList() {
        return dashboardRepository.selectHighTankCompanyList();
    }
    
    public List<HashMap<String, Object>> getHighTankStatusList() {
    	return dashboardRepository.selectHighTankStatusList();
    }
    
    
    
    public HashMap<String, Object> getSkgasCbtDeviceCnt() {
    	return dashboardRepository.selectSkgasCbtDeviceCnt();
    }
    
    public List<HashMap<String, Object>> getSkgasCbtCompanyList() {
        return dashboardRepository.selectSkgasCbtCompanyList();
    }
    
    public List<HashMap<String, Object>> getSkgasCbtList() {
    	return dashboardRepository.selectSkgasCbtList();
    }
    
    
    
    
    public HashMap<String, Object> getSmartMeteringCnt() {
    	return externalRepository.selectSmartMeteringCnt();
    }
    
    public List<HashMap<String, Object>> getSmartMeteringCompanyList() {
    	return externalRepository.selectSmartMeteringCompanyList();
    }
    
    public List<HashMap<String, Object>> getSmartMeteringList() {
    	return externalRepository.selectSmartMeteringList();
    }

}
