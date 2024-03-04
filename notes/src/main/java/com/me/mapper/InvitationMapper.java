package com.me.mapper;

import com.me.entity.Invitation;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface InvitationMapper {

    @Insert("INSERT INTO invitations (note_id, inviter_id, invitee_id, status) " +
            "VALUES (#{noteId}, #{inviterId}, #{inviteeId}, 'pending')")
    void insertInvitation(Invitation invitation);

    @Update("UPDATE invitations SET status = #{status} WHERE invitation_id = #{invitationId}")
    void updateInvitationStatus(@Param("invitationId") Long invitationId, @Param("status") String status);

    @Select("SELECT * FROM invitations WHERE invitee_id = #{inviteeId} AND status = 'pending'")
    List<Invitation> findPendingInvitationsByInvitee(@Param("inviteeId") Integer inviteeId);

    @Select("SELECT * FROM invitations WHERE invitation_id = #{invitationId}")
    Invitation findInvitationById(@Param("invitationId") Long invitationId);
}

