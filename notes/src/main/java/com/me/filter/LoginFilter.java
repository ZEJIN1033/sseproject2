package com.me.filter;

import com.alibaba.fastjson.JSONObject;
import com.me.entity.Result;
import com.me.utils.JwtUtils;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.io.IOException;

// Replacement of Interceptor
@Slf4j
// @WebFilter(urlPatterns = "/*")
public class LoginFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;

        // 1. Get request url
        String url = req.getRequestURI().toString();
        log.info("Request url: {}", url);

        // 2. Check url contains /login or not
        if (url.contains("login")) {
            log.info("Login success! Gogogo!");
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 3. Get token in the request header
        String jwt = req.getHeader("token");

        // 4. Determine token is existed or not, if not, return error msg
        if (!StringUtils.hasLength(jwt)) {
            log.info("Error! Token is empty!");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            resp.getWriter().write(notLogin);
            return;
        }

        // 5. Parse token
        try {
            JwtUtils.parseJWT(jwt);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("Fail to parse token");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            resp.getWriter().write(notLogin);
            return;
        }

        // 6. Go
        log.info("Login success! Gogogo......");
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
