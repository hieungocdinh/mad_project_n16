package com.mad_backend.exception;

import com.mad_backend.dto.response.CommonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<CommonResponse<?>> handleBadCredentials(BadCredentialsException ex) {
        return new ResponseEntity<>(new CommonResponse<>(401, "Invalid username or password", null), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<CommonResponse<?>> handleNotFound(NoSuchElementException ex) {
        return new ResponseEntity<>(new CommonResponse<>(404, ex.getMessage(), null), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
        String errorMessage = Objects.requireNonNull(ex.getBindingResult().getFieldError()).getDefaultMessage();
        return new ResponseEntity<>(new CommonResponse<>(400, errorMessage, null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CommonResponse<?>> handleIllegalArgument(IllegalArgumentException ex) {
        return new ResponseEntity<>(new CommonResponse<>(400, ex.getMessage(), null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<?>> handleAllOtherExceptions(Exception ex) {
        ex.printStackTrace();
        return new ResponseEntity<>(new CommonResponse<>(500, "Internal Server Error: " + ex.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
