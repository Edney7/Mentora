//package com.example.mentora.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    // Trata erros de validação dos DTOs
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
//        Map<String, String> erros = new HashMap<>();
//
//        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
//            erros.put(erro.getField(), erro.getDefaultMessage());
//        }
//
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
//    }
//
//    // Você pode adicionar mais métodos aqui para outros tipos de erro (ex: DataIntegrityViolation, etc)
//}
