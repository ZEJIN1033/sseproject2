package com.me.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.OffsetDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note implements Serializable {

    private Integer id;
    private Integer userId;

    private String title;
    private String content;
    private Integer version;
    private Boolean isPublic;

    private OffsetDateTime createdAt = OffsetDateTime.now();
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}