package com.online_clipboard_backend.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;

@Service
public class JwtService {

    private final ConfigurableJWTProcessor<SecurityContext> jwtProcessor;
    private final String issuer;

    public JwtService(@Value("${clerk.issuer:}") String issuer) throws MalformedURLException {
        this.issuer = issuer;
        if (issuer == null || issuer.isBlank()) {
            jwtProcessor = null;
            return;
        }

        DefaultResourceRetriever resourceRetriever = new DefaultResourceRetriever(2000, 2000);
        URL jwksURL = new URL(issuer + "/.well-known/jwks.json");
        JWKSource<SecurityContext> keySource = new RemoteJWKSet<>(jwksURL, resourceRetriever);

        jwtProcessor = new DefaultJWTProcessor<>();
        JWSAlgorithm expectedJWSAlg = JWSAlgorithm.RS256;
        JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(expectedJWSAlg, keySource);
        jwtProcessor.setJWSKeySelector(keySelector);
    }

    public JWTClaimsSet validate(String token) throws Exception {
        if (jwtProcessor == null) throw new RuntimeException("clerk.issuer not configured");

        SignedJWT signedJWT = SignedJWT.parse(token);
        JWTClaimsSet claims = jwtProcessor.process(signedJWT, null);

        // Basic checks (issuer)
        if (issuer != null && !issuer.isBlank() && !issuer.equals(claims.getIssuer())) {
            throw new JOSEException("Invalid token issuer");
        }

        return claims;
    }
}
