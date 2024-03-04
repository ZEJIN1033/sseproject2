/*
package com.me.config;

import com.me.entity.Note;
import com.me.mapper.NoteMapper;
// import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class NoteUpdateListener {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private NoteMapper noteMapper;

    @RabbitListener(queues = "notes.update")
    public void NoteUpdate(String noteId) {
        // Get notes from Redis
        Note note = (Note) redisTemplate.opsForValue().get("note:" + noteId);
        if (note != null) { noteMapper.update(note); }
    }

    @RabbitListener(queues = "notes.delete")
    public void NoteDelete(Integer noteId) {
        noteMapper.delete(noteId);
    }
}

 */
