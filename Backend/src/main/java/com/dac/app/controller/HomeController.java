package com.dac.app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	@RequestMapping("/")
	public String greet() {
		return "Welcome to Home";
	}
	
	@RequestMapping("/about")
	public String about() {
		return "Welcome to about page";
	}
	
}
