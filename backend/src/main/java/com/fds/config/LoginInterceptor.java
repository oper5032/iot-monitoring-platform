package com.fds.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.HashMap;
import java.util.Map;

public class LoginInterceptor implements HandlerInterceptor {

//    @Override
//    public boolean preHandle(HttpServletRequest request,
//                             HttpServletResponse response,
//                             Object handler) throws Exception {
//
//        String uri = request.getRequestURI();
//
//        // 로그인/예외 API는 패스
//        if (uri.startsWith("/api/auth")) {
//            return true;
//        }
//
//        HttpSession session = request.getSession(false);
//        
//        if (session == null || session.getAttribute("LOGIN_USER") == null) {
//
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json;charset=UTF-8");
//
//            String json = """
//                    {
//                        "res_code": "unauthorized",
//                        "res_msg": "로그인이 필요합니다."
//                    }
//                    """;
//
//            response.getWriter().write(json);
//            return false;
//        }
//
//        return true;
//    }
}