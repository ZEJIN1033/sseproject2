package com.me.service.impl;

import com.me.entity.User;
import com.me.mapper.NoteMapper;
import com.me.mapper.UserMapper;
import com.me.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private NoteMapper noteMapper;
    @Override
    public User login(User user) {
        return userMapper.getUP(user);
    }

    @Transactional(rollbackOn = Exception.class) // Appear all exceptions will rollback
    @Override
    public void delete(Integer id) {
        userMapper.delete(id);
        noteMapper.deleteByUserId(id);
    }

    @Override
    public void insert(User user) { userMapper.insert(user); }

}
