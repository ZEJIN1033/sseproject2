package com.me.service;

import com.me.entity.Note;
import java.util.List;

public interface NoteService {
    List<Note> showNotes(Integer userid);

    void deletenote(Integer noteId, Integer userId);

    void addNote(Integer userId);

    void updateNote(Note note);

    Note findNote(Integer noteId);

}
