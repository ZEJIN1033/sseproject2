package com.me.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Collaborator {
    private Integer noteId;
    private Integer userId;
    private Integer inviterId;
}
