package com.me.mapper;

import com.me.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    // delete notes
    @Delete("DELETE FROM users WHERE id = #{id}") // precompile
    void delete(Integer id);

    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("INSERT INTO users (username, password, email) VALUES (#{username}, #{password}, #{email})")
    void insert(User user);

    @Update("UPDATE users SET username = #{username}, password = #{password}, email = #{email} WHERE id = #{id}")
    void update(User user);

    @Select("SELECT * FROM users WHERE id = #{id}")
    User search(Long id);

    @Select("SELECT * FROM users WHERE username = #{username} and password = #{password}")
    User getUP(User user); // UP = "username and password"
}
