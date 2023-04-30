package com.github.ffremont.astrobook;

import nom.tam.fits.Fits;
import nom.tam.fits.FitsException;
import nom.tam.fits.ImageHDU;
import org.shredzone.commons.suncalc.MoonPhase;
import org.shredzone.commons.suncalc.MoonTimes;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@SpringBootApplication
@EnableAsync
public class AstrobookApplication {
	public final static String DATA_DIR = "astrobook";

	public final static Path WORKDIR;

	static {
		WORKDIR = Paths.get(Optional.ofNullable(System.getProperty("user.home")).orElse("."));
	}

	public static void main(String[] args) throws IOException, FitsException {



		/**URI uri = new URI("http://google.com/");
		Desktop dt = Desktop.getDesktop();
		dt.browse(uri);*/

		SpringApplication.run(AstrobookApplication.class, args);


		  //ZonedDateTime dateTime = LocalDateTime.now().plusDays(3).atZone(ZoneId.of("Europe/Paris"));

		        /*  System.out.println("Hello world!");
		          var s1 = (new Fits("s1.fit")).readHDU();
		var s2 = (new Fits("s2.fit")).readHDU();*/

		        /* var gain  = Integer.valueOf(hdu.getHeader().findCard("GAIN").getValue());
		          var stackCnt  = Integer.valueOf(hdu.getHeader().findCard("STACKCNT").getValue());
		          var dateObs  = LocalDateTime.parse(hdu.getHeader().findCard("DATE-OBS").getValue());
		          var instrume  = hdu.getHeader().findCard("INSTRUME").getValue();
		          var exposure  = Float.parseFloat(hdu.getHeader().findCard("EXPOSURE").getValue());
		          var temp  = Float.parseFloat(hdu.getHeader().findCard("CCD-TEMP").getValue());*/


		          //var r = MoonPhase.compute().fullCycle().on(LocalDateTime.now()).at(46.3, 0.5).execute();

		        // System.out.println(s1);

	}

}
