package com.me.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
    // private static SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private static String secretKeyStatic;
    private static long expirationStatic;

    @Value("${JwtUtils.secretKey}")
    private String secretKey;

    @Value("${JwtUtils.expiration}")
    private long expiration; // (s)

    @PostConstruct
    private void init() {
        secretKeyStatic = secretKey;
        expirationStatic = expiration;
    }

    public static String generateJwt(Map<String, Object> claims) {
        return Jwts.builder()
                .addClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + expirationStatic * 1000))
                .signWith(SignatureAlgorithm.HS256, secretKeyStatic.getBytes())
                .compact();
    }

    // Get Claims from JWT
    public static Claims parseJWT(String jwt) {
        return Jwts.parser()
                .setSigningKey(secretKeyStatic.getBytes())
                .parseClaimsJws(jwt)
                .getBody();
    }

    // Get username from JWT
    public String getUsernameFromToken(String token) {
        return parseJWT(token).getSubject();
    }

    // Check JWT is expired or not
    private boolean isTokenExpired(String token) {
        final Date expiration = parseJWT(token).getExpiration();
        return expiration.before(new Date());
    }

}
