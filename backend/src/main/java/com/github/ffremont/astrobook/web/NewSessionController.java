package com.github.ffremont.astrobook.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/new-session")
public class NewSessionController {
    @GetMapping("")
    public String index() {
        return "Greetings from Spring Boot!";
    }
}
