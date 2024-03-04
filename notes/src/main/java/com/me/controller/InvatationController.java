package com.me.controller;

import com.me.entity.Invitation;
import com.me.entity.Result;
import com.me.service.InvitationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
public class InvatationController {

    @Autowired
    private InvitationService invitationService;

    @CrossOrigin(origins = "*")
    @GetMapping("/api/{userId}/pending")
    public Result showPendings(@PathVariable Integer userId) {
        log.info("show {} pending invitations", userId);
        List<Invitation> pendingInvitations = invitationService.getPendingInvitations(userId);
        return Result.success(pendingInvitations);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/api/{userId}/send")
    public Result sendInvitation(@RequestBody Invitation invitation) {
        log.info("Send an invitation: {}", invitation);
        invitationService.sendInvitation(invitation);
        return Result.success();
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/api/invitations/accept/{invitationId}")
    public Result acceptInvitations(@PathVariable Long invitationId) {
        log.info("Accept the invitation:{}", invitationId);
        invitationService.acceptInvitation(invitationId);
        return Result.success();
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/api/invitations/decline/{invitationId}")
    public Result declineInvitations(@PathVariable Long invitationId) {
        log.info("Decline the invitation:{}", invitationId);
        invitationService.declineInvitation(invitationId);
        return Result.success();
    }

}
