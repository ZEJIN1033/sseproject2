package com.me.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.me.entity.Result;
import com.me.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler) throws Exception {

        // 1. Get request url
        String url = req.getRequestURI().toString();
        log.info("Request url: {}", url);

        // 2. Check url contains /login or not
        if (url.contains("login")) {
            log.info("Login success! Gogogo!");
            return true;
        }

        // 3. Get token in the request header
        String jwt = req.getHeader("token");

        // 4. Determine token is existed or not, if not, return error msg
        if (!StringUtils.hasLength(jwt)) {
            log.info("Error! Token is empty!");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            resp.getWriter().write(notLogin);
            return false;
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
            return false;
        }

        // 6. Go
        log.info("Login success! Gogogo......");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
