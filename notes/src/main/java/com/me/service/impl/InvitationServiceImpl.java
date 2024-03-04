package com.me.service.impl;

import com.me.entity.Collaborator;
import com.me.entity.Invitation;
import com.me.exception.UnauthorizedException;
import com.me.mapper.CollaMapper;
import com.me.mapper.InvitationMapper;
import com.me.mapper.NoteMapper;
import com.me.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class InvitationServiceImpl implements InvitationService {

    @Autowired
    private InvitationMapper invitationMapper;

    @Autowired
    private CollaMapper collaMapper;

    @Autowired
    private NoteMapper noteMapper;

    // Send
    @Override
    public void sendInvitation(Invitation invitation) {
        Integer inviterId = invitation.getInviterId();
        Integer noteId = invitation.getNoteId();
        if (noteMapper.isOwnerOrHasPermission(noteId, inviterId)) {
            invitationMapper.insertInvitation(invitation);
        } else {
            throw new UnauthorizedException("User does not have permission to add collaborators.");        }
    }

    // Accept
    @Override
    public void acceptInvitation(Long invitationId) {
        invitationMapper.updateInvitationStatus(invitationId, "accepted");
        Invitation invitation = invitationMapper.findInvitationById(invitationId);

        if (invitation != null && "accepted".equals(invitation.getStatus())) {
            // Create collaborator object
            Collaborator collaborator = new Collaborator();
            collaborator.setNoteId(invitation.getNoteId());
            collaborator.setUserId(invitation.getInviteeId());
            collaborator.setInviterId(invitation.getInviterId());

            collaMapper.insertCollaborators(collaborator);
        } else {

            throw new IllegalStateException("Invitation not found or not accepted");
        }
    }

    // Decline
    @Override
    public void declineInvitation(Long invitationId) {
        invitationMapper.updateInvitationStatus(invitationId, "declined");
    }

    // Pending
    @Override
    public List<Invitation> getPendingInvitations(Integer inviteeId) {
        return invitationMapper.findPendingInvitationsByInvitee(inviteeId);
    }
}
