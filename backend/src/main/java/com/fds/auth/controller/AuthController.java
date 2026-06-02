package com.fds.auth.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fds.auth.dto.LoginUser;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	@PostMapping(value = "/login")
	public Map<String, Object> login(@RequestBody HashMap<String, Object> params, HttpSession session, HttpServletRequest request) {
		
		Map<String, Object> result = new HashMap<>();
		
		// 접근 IP
	    String clientIp = getClientIp(request);

	    // 접근 시간
	    String accessTime = LocalDateTime.now()
	            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
		
		// 임시 로그인 체크
		if ( 
				"admin".equals(params.get("userId")) &&
				"1234".equals(params.get("userPw"))
			) {
			LoginUser loginUser = new LoginUser("admin", "관리자");
			
			session.setAttribute("LOGIN_USER", loginUser);
			
			System.out.println(
	                "[LOGIN SUCCESS] " +
	                "TIME=" + accessTime +
	                ", IP=" + clientIp +
	                ", ID=" + params.get("userId")
	        );
			
			result.put("res_code", "success");
            result.put("res_msg", "로그인 성공");
            result.put("res_data", loginUser);
		} else {
			result.put("res_code", "fail");
            result.put("res_msg", "아이디 또는 비밀번호가 올바르지 않습니다.");
		}
		
		return result;
	}
	
	@GetMapping("/me")
    public Map<String, Object> me(HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        Object loginUser = session.getAttribute("LOGIN_USER");

        if (loginUser == null) {
            result.put("res_code", "fail");
            result.put("res_msg", "로그인 정보가 없습니다.");
        } else {
            result.put("res_code", "success");
            result.put("res_data", loginUser);
        }

        return result;
    }
	
	@PostMapping("/logout")
	public Map<String, Object> logout(HttpSession session) {
		session.invalidate();
		
		Map<String, Object> result = new HashMap<>();
		result.put("res_code", "success");
		result.put("res_msg", "로그아웃 되었습니다.");
		
		return result;
	}
	
	private String getClientIp(HttpServletRequest request) {

	    String ip = request.getHeader("X-Forwarded-For");

	    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
	        ip = request.getHeader("Proxy-Client-IP");
	    }

	    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
	        ip = request.getHeader("WL-Proxy-Client-IP");
	    }

	    if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
	        ip = request.getRemoteAddr();
	    }

	    return ip;
	}

}
