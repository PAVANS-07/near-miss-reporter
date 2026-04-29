package com.internship.tool.controller;

import com.internship.tool.entity.User;
import com.internship.tool.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository repo;

    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        repo.save(user);
        return "User registered successfully";
    }

    
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        Optional<User> dbUser = repo.findByUsername(user.getUsername());

        if (dbUser.isEmpty()) {
            return "User not found";
        }

        if (!dbUser.get().getPassword().equals(user.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }
}