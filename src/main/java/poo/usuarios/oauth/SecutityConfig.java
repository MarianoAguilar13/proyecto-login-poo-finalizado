package poo.usuarios.oauth;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecutityConfig  {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        DefaultSecurityFilterChain build = http.csrf().disable()
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(HttpMethod.POST, "/api/users").permitAll();
                    auth.requestMatchers(HttpMethod.POST).permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/users/data-google").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/users/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/users").permitAll();
                    auth.requestMatchers(HttpMethod.PUT, "/api/users/**").permitAll();
                    auth.requestMatchers(HttpMethod.DELETE, "/api/users/**").permitAll();
                    auth.requestMatchers("/").permitAll();
                    auth.requestMatchers("/index.html").permitAll();
                    auth.requestMatchers("/index.css").permitAll();
                    auth.requestMatchers("/index.js").permitAll();
                    auth.requestMatchers("/admin.html").permitAll();
                    auth.requestMatchers("/admin.css").permitAll();
                    auth.requestMatchers("/admin.js").permitAll();
                    auth.requestMatchers("/sign-up.html").permitAll();
                    auth.requestMatchers("/sign-up.css").permitAll();
                    auth.requestMatchers("/sign-up.js").permitAll();
                    auth.requestMatchers("/welcome.html").permitAll();
                    auth.requestMatchers("/welcome.css").permitAll();
                    auth.requestMatchers("/welcome.js").permitAll();
                    auth.requestMatchers("/api/users/**").permitAll();
                    auth.requestMatchers("/favicon.ico").permitAll();
                    auth.anyRequest().authenticated();
                }).oauth2Login(Customizer.withDefaults()).build();
        return build;
    }


}
