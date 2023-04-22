package com.github.ffremont.astrobook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@SpringBootApplication
public class AstrobookApplication {

	public static void main(String[] args) {
		/**URI uri = new URI("http://google.com/");
		Desktop dt = Desktop.getDesktop();
		dt.browse(uri);*/

		SpringApplication.run(AstrobookApplication.class, args);

		/**
		 * //ZonedDateTime dateTime = LocalDateTime.now().plusDays(3).atZone(ZoneId.of("Europe/Paris"));
		 *
		 *         System.out.println("Hello world!");
		 *         Fits f = new Fits("aa.fit");
		 *         ImageHDU hdu = (ImageHDU) f.readHDU();
		 *
		 *         var gain  = Integer.valueOf(hdu.getHeader().findCard("GAIN").getValue());
		 *         var stackCnt  = Integer.valueOf(hdu.getHeader().findCard("STACKCNT").getValue());
		 *         var dateObs  = LocalDateTime.parse(hdu.getHeader().findCard("DATE-OBS").getValue());
		 *         var instrume  = hdu.getHeader().findCard("INSTRUME").getValue();
		 *         var exposure  = Float.parseFloat(hdu.getHeader().findCard("EXPOSURE").getValue());
		 *         var temp  = Float.parseFloat(hdu.getHeader().findCard("CCD-TEMP").getValue());
		 *
		 *         var r = MoonTimes.compute().fullCycle().on(dateObs).at(46.3, 0.5).execute();
		 *         System.out.println(r);
		 */
	}

}
