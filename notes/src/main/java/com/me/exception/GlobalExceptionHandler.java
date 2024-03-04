package com.me.exception;

import com.me.entity.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Result> handleUnauthorizedException(UnauthorizedException ex) {
        ex.printStackTrace();

        Result result = Result.error("Access Denied: " + ex.getMessage());
        return new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result> handleGeneralException(Exception ex) {
        // Print stack traces for debugging
        ex.printStackTrace();

        // Creates and returns a Result object containing an error message
        Result result = Result.error("Failed, please contact the manager");
        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

