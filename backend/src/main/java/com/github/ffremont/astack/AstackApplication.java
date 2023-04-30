package com.github.ffremont.astack;

import nom.tam.fits.FitsException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@SpringBootApplication
@EnableAsync
public class AstackApplication {
	public final static String DATA_DIR = "astack";

	public final static Path WORKDIR;

	static {
		WORKDIR = Paths.get(Optional.ofNullable(System.getProperty("user.home")).orElse("."));
	}

	public static void main(String[] args) throws IOException, FitsException {
		SpringApplication.run(AstackApplication.class, args);
	}

}
