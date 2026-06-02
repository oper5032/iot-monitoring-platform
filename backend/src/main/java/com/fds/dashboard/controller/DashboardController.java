package com.fds.dashboard.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fds.dashboard.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
	
	private final DashboardService dashboardService;
	
	public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
	
	// 도시가스 회사 단말 전체 수량
	@PostMapping("/cityGasDeviceCnt")
	public Map<String, Object> cityGasDeviceCnt() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			HashMap<String, Object> data = dashboardService.getCityGasDeviceCnt();
			
            result.put("res_code", "success");
            result.put("res_data", data);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 도시가스 회사 리스트
	@PostMapping("/cityGasCompanyList")
	public Map<String, Object> cityGasCompanyList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getCityGasCompanyList();
			
            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 도시가스 장애 리스트
	@PostMapping("/cityGasCompanyStatusList")
	public Map<String, Object> cityGasCompanyStatusList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getCityGasCompanyStatusList();
			
            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 고압탱크 전체 수량
	@PostMapping("/highTankDeviceCnt")
	public Map<String, Object> highTankDeviceCnt() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			HashMap<String, Object> data = dashboardService.getHighTankDeviceCnt();
			
            result.put("res_code", "success");
            result.put("res_data", data);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 고압탱크 판매점 리스트
	@PostMapping("/highTankCompanyList")
	public Map<String, Object> highTankCompanyList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getHighTankCompanyList();
			
            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}

	// 고압탱크 장애 리스트
	@PostMapping("/highTankStatusList")
	public Map<String, Object> highTankStatusList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getHighTankStatusList();

            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
		
	}
	
	// 기화기 전체 수량
	@PostMapping("/skgasCbtDeviceCnt")
	public Map<String, Object> skgasCbtDeviceCnt() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			HashMap<String, Object> data = dashboardService.getSkgasCbtDeviceCnt();
			
            result.put("res_code", "success");
            result.put("res_data", data);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 기화기 판매점 리스트
	@PostMapping("/skgasCbtCompanyList")
	public Map<String, Object> skgasCbtCompanyList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getSkgasCbtCompanyList();
			
            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}

	
	// 기화기 현황 리스트
	@PostMapping("/skgasCbtList")
	public Map<String, Object> skgasCbtList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getSkgasCbtList();

            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 스마트 미터링 전체 수량
	@PostMapping("/smartMeteringCnt")
	public Map<String, Object> smartMeteringCnt() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			HashMap<String, Object> data = dashboardService.getSmartMeteringCnt();
			
            result.put("res_code", "success");
            result.put("res_data", data);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 스마트 미터링 판매점 리스트
	@PostMapping("/smartMeteringCompanyList")
	public Map<String, Object> smartMeteringCompanyList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getSmartMeteringCompanyList();
			
            result.put("res_code", "success");
            result.put("res_data", list);
		} catch (Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}
	
	// 스마트 미터링 장애 리스트
	@PostMapping("/smartMeteringList")
	public Map<String, Object> smartMeteringList() {
		
		Map<String, Object> result = new HashMap();
		
		try {
			List<HashMap<String, Object>> list = dashboardService.getSmartMeteringList();

            result.put("res_code", "success");
            result.put("res_data", list);
		} catch(Exception e) {
			result.put("res_code", "fail");
            result.put("res_msg", e.getMessage());
		}
		
		return result;
	}


}
