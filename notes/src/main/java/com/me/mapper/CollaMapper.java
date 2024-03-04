package com.me.mapper;

import com.me.entity.Collaborator;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CollaMapper {

    @Insert("INSERT INTO collaborators (note_id, user_id, inviter_id)" +
            "VALUES (#{noteId}, #{userId}, #{inviterId})")
    void insertCollaborators(Collaborator collaborator);

}
