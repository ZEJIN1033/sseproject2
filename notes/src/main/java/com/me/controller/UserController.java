package com.me.controller;

import com.me.entity.Result;
import com.me.entity.User;
import com.me.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{userId}")
    public Result delete(@PathVariable Integer userId) {
        log.info("delete a user: {}", userId);
        userService.delete(userId);
        return Result.success();
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/user")
    public Result insert(@RequestBody User user) {
        log.info("add a user: {}", user);
        userService.insert(user);
        return Result.success();
    }

}
