package com.me.service;

import com.me.entity.Invitation;
import java.util.List;

public interface InvitationService {
    void sendInvitation(Invitation invitation);

    void acceptInvitation(Long invitationId);

    void declineInvitation(Long invitationId);

    List<Invitation> getPendingInvitations(Integer inviteeId);

}



