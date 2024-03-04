package com.me;

import com.me.entity.User;
import com.me.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SpringMybatisTests {
    /*
    @Autowired
    private UserMapper userMapper;

    @Test
    public void testSearch() {
        User user = userMapper.search(1L);
        System.out.println(user);
    }

    @Test
    public void testInsert() {
        User user = new User();
        user.setUsername("sfssssfs");
        user.setPassword("s");
        user.setEmail("hahssashahha");

        userMapper.insert(user);
    }

    @Test
    public void testUpdate() {
        User user = new User();
        user.setId(1);
        user.setUsername("wahaha");
        user.setPassword("s");
        user.setEmail("zqwqdd");

        userMapper.update(user);
    }

    */
}
