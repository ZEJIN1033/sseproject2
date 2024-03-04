package com.me.controller;


import com.me.entity.Result;
import com.me.entity.User;
import com.me.service.UserService;
import com.me.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        log.info("User login: {}", user);
        User u = userService.login(user);

        System.out.println(user);

        // login success, generate token
        if (u != null) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", u.getId());
            claims.put("username", u.getUsername());
            String jwt = JwtUtils.generateJwt(claims);
            return Result.success(jwt);
        }

        // login fail, return error msg
        return Result.error("Invalid Username or Password");
    }

}